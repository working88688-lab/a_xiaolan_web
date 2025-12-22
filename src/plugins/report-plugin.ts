/* eslint-disable */
// @ts-nocheck

// utils/encryptSecret.ts
import SHA1 from 'crypto-js/sha1';
import MD5 from 'crypto-js/md5';

export function encryptSecret(key: string, time: number): string {
  const parts = key.split('_');
  const secret = parts[0];
  const intervalStr = parts[parts.length - 1];
  const parsedInterval = parseInt(intervalStr, 10);
  const interval = time;
  const ct = Math.floor(Date.now() / 1000 / interval);
  const cal = SHA1(secret + ct.toString()).toString();
  const sha = SHA1(secret + cal).toString();
  const str = MD5(sha.toString()).toString();
  return str.substring(0, 16);
}


function checkRule(ctx, role_key) {
  const key = `is_report_${role_key}`
  return ctx.bury_point[key] === 1
}

function getPageTrackData(page: any) {
  return {
    key: page.name,
    name: page.meta?.trackPageName || page.meta?.title || page.query?.title,
  }
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const groupKey = item[key];     // 比如 item['age']
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
}

function groupAds() {
  const groupedAds = groupBy(ad_impression_queue, 'ad_slot_key')
  return Object.keys(groupedAds).reduce((acc, ad_slot_key) => {
    const values = groupedAds[ad_slot_key];
    return [...acc, {
      ...values[0],
      ad_id: values.map(item => item.ad_id).join(',')
    }]
  }, [])
}

let ad_impression_queue = [];
let ad_impression_timer = null;


const PAGE_ALIVE_MAP = new Map()
const PAGE_LOAD_MAP = new Map()
let PAGE_ALIVE_TIMER: any


export default defineNuxtPlugin((nuxtApp) => {

  const route = useRoute()
  // document.addEventListener('visibilitychange', (e) => {
  //   const cache = PAGE_ALIVE_MAP.get(route.name);
  //   if (document.hidden) {
  //     PAGE_ALIVE_MAP.set(route.name, {
  //       status: 'hidden',
  //       alive_time: performance.now() - cache.show_at
  //     })
  //   } else {
  //     PAGE_ALIVE_MAP.set(route.name, {
  //       status: 'show',
  //       show_at: performance.now(),
  //       alive_time: cache.alive_time
  //     })
  //   }
  // })
  const app = useNuxtApp()
  const userStore = useUserStore()
  app.$router.beforeEach((to, from) => {
    if (PAGE_ALIVE_TIMER) {
      clearInterval(PAGE_ALIVE_TIMER)
      PAGE_ALIVE_TIMER = null
    }
    if (to.meta.bottom && from.meta.bottom && to.meta?.name !== from.name) {
      app.$Tracker.trackNavigation({
        navigation_key: to.name,
        navigation_name: to.meta.title || to.meta.trackPageName
      })
    }
    PAGE_LOAD_MAP.set(to.name, performance.now())

    // PAGE_ALIVE_MAP.set(route.name, {
    //   status: 'status',
    //   show_at: performance.now(),
    //   alive_time: 0
    // })

  })

  app.$router.afterEach((to, from) => {
    const pageMeta = getPageTrackData(to)
    const referrerMeta = getPageTrackData(from)
    app.$Tracker.trackAppPageView({
      page_key: pageMeta.key,
      page_name: pageMeta.name,
      user_type: userStore.u.is_vip ? 'vip' : 'normal',
      referrer_page_key: referrerMeta.key,
      referrer_page_name: referrerMeta.name,
      current_page_key: pageMeta.key,
      current_page_name: pageMeta.name,
      page_load_time: performance.now() - PAGE_LOAD_MAP.get(to.name)
    })

    // PAGE_ALIVE_TIMER = setInterval(() => {
    //   const current = PAGE_ALIVE_MAP.get(to.name);
    //   if (current) {
    //     app.$Tracker.trackPageLifecycle({
    //       lifecycle_status: current.status,
    //       page_key: pageMeta.key,
    //       page_name: pageMeta.name,
    //       duration: current.status === 'show' ? performance.now() - current.show_at + (current.alive_time || 0) : current.alive_time
    //     })
    //   } else {
    //     app.$Tracker.trackPageLifecycle({
    //       lifecycle_status: 'show',
    //       page_key: pageMeta.key,
    //       page_name: pageMeta.name,
    //       duration: 10 * 60
    //     })
    //   }
    // }, 10 * 60 * 1000)
  })

  function createFetchQueue(maxConcurrency = 5, batchSize = 10, batchInterval = 5000) {
    let currentCount = 0;
    const queue = [];

    // ---------------- 并发控制核心 ----------------
    function runNext() {
      if (currentCount >= maxConcurrency) return;
      if (queue.length === 0) return;

      const { taskFn, resolve, reject } = queue.shift();
      currentCount++;

      taskFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          currentCount--;
          runNext();
        });
    }

    function enqueueRequest(batchBody) {
      const url = Tracker._ctx.bury_point.click_transit_path
      console.log('url: ', url);
      return new Promise((resolve, reject) => {
        const taskFn = () =>
          url ? fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': Tracker._ctx.bury_point.is_encryption ? 'application/x-www-form-urlencoded' : 'application/json',
              'Cf-Ray-Xf': encryptSecret(Tracker._ctx.bury_point.authentication_key, Tracker._ctx.bury_point.authentication_time)
            },
            body: Tracker._ctx.bury_point.is_encryption ? Tracker._ctx.createSign({ [`${Tracker._ctx.bury_point.sign_key}`]: batchBody }, Tracker._ctx.bury_point.encryption_key, Tracker._ctx.bury_point.encryption_iv, Tracker._ctx.bury_point.sign_key) : JSON.stringify(batchBody)
          }) : Promise.resolve();

        queue.push({ taskFn, resolve, reject });
        runNext();
      });
    }

    let batch = [];
    let timer = null;

    function flush() {
      if (batch.length === 0) return;

      const currentBatch = batch;
      batch = [];

      // 拿到这一批要上报的数据
      const payload = currentBatch.map(item => item.event);

      // 先备份 resolve/reject
      const resolvers = currentBatch.map(item => ({
        resolve: item.resolve,
        reject: item.reject
      }));

      // 真正发请求（走并发队列）
      const p = enqueueRequest(payload);

      p.then(res => {
        // 这一批里所有事件共用同一次请求结果
        resolvers.forEach(r => r.resolve(res));
      }).catch(err => {
        resolvers.forEach(r => r.reject(err));
      });

      return p;
    }

    function scheduleFlush() {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        flush();
      }, batchInterval);
    }

    /**
     * 对外暴露的方法：
     * limitedFetch(report_json) 每次只传一条事件，
     * 内部会做：
     * - 加入 batch
     * - 满 10 条立刻 flush
     * - 或者 5 秒后自动 flush
     */
    function limitedFetch(report_json) {
      return new Promise((resolve, reject) => {
        // 加入当前批次
        batch.push({ event: report_json, resolve, reject });

        // 条数达标：立即上报
        if (batch.length >= batchSize) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          flush(); // resolve/reject 会在 flush 里统一处理
        } else {
          // 没达到条数，就走定时器 5 秒上报
          scheduleFlush();
        }
      });
    }

    return limitedFetch;
  }

  const limitedFetch = createFetchQueue(5, 10, 5000);

  // 简单 UUID 生成
  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function generateEventId(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charsLen = chars.length;
    let result = '';
    const cryptoObj = globalThis.crypto || globalThis.msCrypto; // 兼容老浏览器
    if (cryptoObj && cryptoObj.getRandomValues) {
      const randomValues = new Uint32Array(length);
      cryptoObj.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % charsLen];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * charsLen)];
      }
    }

    return result;
  }

  // 持久化 device_id
  function getDeviceId() {
    try {
      const KEY = 'sf_device_id';
      var id = localStorage.getItem(KEY);
      if (!id) {
        id = generateUUID();
        localStorage.setItem(KEY, id);
      }
      return id;
    } catch (e) {
      return generateUUID();
    }
  }

  // 会话 id
  function getSessionId() {
    try {
      const KEY = 'sf_session_id';
      var id = sessionStorage.getItem(KEY);
      if (!id) {
        id = generateUUID();
        sessionStorage.setItem(KEY, id);
      }
      return id;
    } catch (e) {
      return generateUUID();
    }
  }

  // 设备类型
  function getDeviceType() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    return 'PC';
  }

  // 公共字段
  function buildCommonFields(ctx) {
    return {
      channel: ctx.channel || '',             // 渠道码
      event_id: generateEventId(),               // 事件唯一标识
      app_id: ctx.appId || '',                // 应用 id
      uid: ctx.uid || '',                     // 用户 id
      sid: getSessionId(),                    // 会话 id
      client_ts: Math.floor(Date.now() / 1000),                       // 10 位时间戳
      device: getDeviceType(),                // 设备类型
      device_id: ctx.deviceId,               // 设备 id
      user_agent: ctx.user_agent,
      device_brand: '',                       // Web 为空
      device_model: '',                       // Web 为空
    };
  }

  // 实际上报方法
  function send(ctx, trackData) {
    var common = buildCommonFields(ctx);

    const { event, ...payload } = trackData
    const data = {
      ...common,
      event,
      payload
    }

    return limitedFetch(data).catch((e) => {
      console.log('e: ', e);
    })
  }
  // SDK 主体
  const Tracker = {
    _ctx: {
      appId: '',
      channel: '',
      uid: '',
      deviceId: '',
      user_agent: typeof navigator !== 'undefined'
        ? navigator.userAgent
        : '',
      bury_point: {},
      createSign: () => { }
    },
    /**
      * 初始化 SDK
      * @param {{appId: string, channel?: string, deviceId?:string}} options
      */
    init: function (options) {
      options = options || {};
      this._ctx.appId = options.appId || '';
      this._ctx.channel = options.channel || '';
      this._ctx.uid = options.uid.toString() || ''
      this._ctx.deviceId = options.deviceId
      this._ctx.bury_point = options.bury_point
      this._ctx.createSign = options.createSign
      console.log('options.bury_point: ', options.bury_point);
      if (options.rule) {

        this._ctx.rule = options.rule
      }
      window.addEventListener('click', event => {
        const el = event.target

        if (el.closest('.van-overlay') || el.closest('van-popup')) {
          return
        }
        //  点击事件追踪
        const click_page_x = event.clientX
        const click_page_y = event.clientY
        const screen_width = window.screen.width
        const screen_height = window.screen.height
        const pageMeta = getPageTrackData(route)
        app.$Tracker.trackPageClick({
          page_key: pageMeta.key,
          page_name: pageMeta.name,
          click_page_x,
          click_page_y,
          screen_width,
          screen_height,
          click_x_percent: ((click_page_x / screen_width).toFixed(2) * 100).toFixed(2),
          click_y_percent: ((click_page_y / screen_height).toFixed(2) * 100).toFixed(2)
        })
      })
    },
    /**
     * 通用 track
     */
    track: function (trackData) {
      const event = trackData.event
      const ctx = this._ctx
      if (checkRule(ctx, event)) {
        if (event === 'ad_impression') {
          ad_impression_queue.push(trackData)
          if (ad_impression_timer) {
            return
          }
          ad_impression_timer = setTimeout(() => {
            const adGrounds = groupAds()
            adGrounds.forEach(_data => {
              send(ctx, _data);
            })
            ad_impression_queue = []
            clearTimeout(ad_impression_timer)
            ad_impression_timer = null
          }, 5000)

          return
        }
        return send(ctx, trackData)
      }
    },
    // 导航路径行为 navigation
    trackNavigation: function (extra) {
      if (checkRule(this._ctx, 'navigation')) {
        return send(this._ctx, {
          event: 'navigation',
          ...extra
        })
      }
    },

    // 应用页面展示 app_page_view
    trackAppPageView: function (extra) {
      if (checkRule(this._ctx, 'app_page_view')) {
        return send(this._ctx, {
          event: 'app_page_view',
          ...extra
        })
      }
    },

    // 应用页面点击 page_click
    trackPageClick: function (extra) {
      if (checkRule(this._ctx, 'page_click')) {
        return send(this._ctx, {
          event: 'page_click',
          ...extra
        })

      }
    },

    // APP 广告行为 advertising
    trackAdvertising: function (extra) {
      if (checkRule(this._ctx, 'advertising')) {
        return send(this._ctx, {
          event: 'advertising',
          ...extra
        })
      }
    },

    // 页面存活 page_lifecycle
    trackPageLifecycle: function (extra) {
      if (checkRule(this._ctx, 'page_lifecycle')) {
        return send(this._ctx, {
          event: 'page_lifecycle',
          ...extra
        })
      }
    },

    // 视频事件 video_event
    trackVideoEvent: function (extra) {
      if (checkRule(this._ctx, 'video_event')) {
        return send(this._ctx, {
          event: 'video_event',
          ...extra
        })
      }
    },

    // 关键词搜索 keyword_search
    trackKeywordSearch: function (extra) {
      if (checkRule(this._ctx, 'keyword_search')) {
        return send(this._ctx, {
          event: 'keyword_search',
          ...extra
        })
      }
    },

    // 关键词搜索点击 keyword_click
    trackKeywordClick: function (extra) {
      if (checkRule(this._ctx, 'keyword_click')) {
        return send(this._ctx, {
          event: 'keyword_click',
          ...extra
        })
      }
    },

    // 广告展示 ad_impression
    trackAdImpression: function (extra) {
      if (checkRule(this._ctx, 'ad_impression')) {
        const ctx = this._ctx
        ad_impression_queue.push(extra)
        if (ad_impression_timer) {
          return
        }
        ad_impression_timer = setTimeout(() => {
          const adGrounds = groupAds()
          adGrounds.forEach(_data => {
            send(ctx, {
              event: 'ad_impression',
              ..._data
            });
          })
          ad_impression_queue = []
          clearTimeout(ad_impression_timer)
          ad_impression_timer = null
        }, 5000)
      }
    },

    // 广告点击 ad_click
    trackAdClick: function (extra) {
      if (checkRule(this._ctx, 'ad_click')) {
        return send(this._ctx, {
          event: 'ad_click',
          ...extra
        })
      }
    }
  }

  return {
    provide: {
      Tracker: Tracker,
    },
  }
})
