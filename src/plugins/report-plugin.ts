/* eslint-disable */
// @ts-nocheck

import MD5 from 'crypto-js/md5'
import SHA1 from 'crypto-js/sha1'

let ad_impression_queue = []
let ad_impression_timer = null

const PAGE_ALIVE_MAP = new Map()
const PAGE_LOAD_MAP = new Map()
let PAGE_ALIVE_TIMER: any

export function encryptSecret(key: string, time: number): string {
  const parts = key.split('_')
  const secret = parts[0]
  const intervalStr = parts[parts.length - 1]
  const parsedInterval = Number.parseInt(intervalStr, 10)
  const interval = time
  const ct = Math.floor(Date.now() / 1000 / interval)
  const cal = SHA1(secret + ct.toString()).toString()
  const sha = SHA1(secret + cal).toString()
  const str = MD5(sha.toString()).toString()
  return str.substring(0, 16)
}

function checkRule(ctx, role_key) {
  const key = `is_report_${role_key}`
  // key 未配置时默认开启，显式设为 0 才关闭
  return ctx.bury_point[key] !== 0
}

function getPageTrackData(page: any) {
  return {
    key: page.name,
    name: page.meta?.trackPageName || page.meta?.title || page.query?.title,
  }
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const groupKey = item[key] // 比如 item['age']
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {})
}

function groupAds() {
  const groupedAds = groupBy(ad_impression_queue, 'ad_slot_key')
  return Object.keys(groupedAds).reduce((acc, ad_slot_key) => {
    const values = groupedAds[ad_slot_key]
    return [...acc, {
      ...values[0],
      ad_id: values.map(item => item.ad_id).join(','),
    }]
  }, [])
}

function buildTagKey(tagName: string | undefined): string {
  if (!tagName) return 'default'
  const tags = tagName.split(',').map(t => t.trim()).filter(Boolean)
  if (!tags.length) return 'default'
  return tags.map(t => MD5(t).toString()).join(',')
}

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
        navigation_name: to.meta.title || to.meta.trackPageName,
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
    app.$Tracker.setPageTraceId('')
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
      page_load_time: Math.floor(performance.now() - PAGE_LOAD_MAP.get(to.name)),
      recommend_trace_id: '',
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
    let currentCount = 0
    const queue = []

    // ---------------- 并发控制核心 ----------------
    function runNext() {
      if (currentCount >= maxConcurrency)
        return
      if (queue.length === 0)
        return

      const { taskFn, resolve, reject } = queue.shift()
      currentCount++

      taskFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          currentCount--
          runNext()
        })
    }

    function enqueueRequest(batchBody) {
      const url = Tracker._ctx.bury_point.click_transit_path

      return new Promise((resolve, reject) => {
        const taskFn = () =>
          url
            ? fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': Tracker._ctx.bury_point.is_encryption ? 'application/x-www-form-urlencoded' : 'application/json',
                'Cf-Ray-Xf': encryptSecret(Tracker._ctx.bury_point.authentication_key, Tracker._ctx.bury_point.authentication_time),
              },
              body: Tracker._ctx.bury_point.is_encryption ? Tracker._ctx.createSign(batchBody, Tracker._ctx.bury_point.encryption_key, Tracker._ctx.bury_point.encryption_iv, Tracker._ctx.bury_point.sign_key) : JSON.stringify(batchBody),
            })
            : Promise.resolve()

        queue.push({ taskFn, resolve, reject })
        runNext()
      })
    }

    let batch = []
    let timer = null

    function flush() {
      if (batch.length === 0)
        return

      const currentBatch = batch
      batch = []

      // 拿到这一批要上报的数据
      const payload = currentBatch.map(item => item.event)
      console.log('[Tracker] flush', payload.length, 'events', payload.map(e => e.event))

      // 先备份 resolve/reject
      const resolvers = currentBatch.map(item => ({
        resolve: item.resolve,
        reject: item.reject,
      }))

      // 真正发请求（走并发队列）
      const p = enqueueRequest(payload)

      p.then((res) => {
        // 这一批里所有事件共用同一次请求结果
        resolvers.forEach(r => r.resolve(res))
      }).catch((err) => {
        resolvers.forEach(r => r.reject(err))
      })

      return p
    }

    function scheduleFlush() {
      if (timer)
        return
      timer = setTimeout(() => {
        timer = null
        flush()
      }, batchInterval)
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
        batch.push({ event: report_json, resolve, reject })

        // 条数达标：立即上报
        if (batch.length >= batchSize) {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
          flush() // resolve/reject 会在 flush 里统一处理
        }
        else {
          // 没达到条数，就走定时器 5 秒上报
          scheduleFlush()
        }
      })
    }

    return limitedFetch
  }

  const limitedFetch = createFetchQueue(5, 10, 5000)

  // 简单 UUID 生成
  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  function generateEventId(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const charsLen = chars.length
    let result = ''
    const cryptoObj = globalThis.crypto || globalThis.msCrypto // 兼容老浏览器
    if (cryptoObj && cryptoObj.getRandomValues) {
      const randomValues = new Uint32Array(length)
      cryptoObj.getRandomValues(randomValues)
      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % charsLen]
      }
    }
    else {
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * charsLen)]
      }
    }

    return result
  }

  // 持久化 device_id
  function getDeviceId() {
    try {
      const KEY = 'sf_device_id'
      let id = localStorage.getItem(KEY)
      if (!id) {
        id = generateUUID()
        localStorage.setItem(KEY, id)
      }
      return id
    }
    catch (e) {
      return generateUUID()
    }
  }

  // 会话 id
  function getSessionId() {
    try {
      const KEY = 'sf_session_id'
      let id = sessionStorage.getItem(KEY)
      if (!id) {
        id = generateUUID()
        sessionStorage.setItem(KEY, id)
      }
      return id
    }
    catch (e) {
      return generateUUID()
    }
  }

  // 设备类型
  function getDeviceType() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    if (/Android/i.test(ua))
      return 'Android'
    if (/iPhone|iPad|iPod/i.test(ua))
      return 'iOS'
    return 'PC'
  }

  // 公共字段
  function buildCommonFields(ctx) {
    return {
      channel: ctx.channel || '', // 渠道码
      event_id: generateEventId(), // 事件唯一标识
      app_id: ctx.appId || '', // 应用 id
      uid: ctx.uid || '', // 用户 id
      sid: getSessionId(), // 会话 id
      client_ts: Math.floor(Date.now() / 1000), // 10 位时间戳
      device: getDeviceType(), // 设备类型
      device_id: ctx.deviceId, // 设备 id
      user_agent: ctx.user_agent,
      device_brand: '', // Web 为空
      device_model: '', // Web 为空
    }
  }

  // 实际上报方法
  function send(ctx, trackData) {
    let common = buildCommonFields(ctx)

    const { event, ...payload } = trackData
    const data = {
      ...common,
      event,
      payload,
    }

    console.log('[Tracker]', event, payload)

    return limitedFetch(data).catch((e) => {
      console.log('e: ', e)
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
      createSign: () => { },
      currentPageTraceId: '',
    },
    /**
     * 初始化 SDK
     * @param {{appId: string, channel?: string, deviceId?:string}} options
     */
    init(options) {
      options = options || {}
      this._ctx.appId = options.appId || ''
      this._ctx.channel = options.channel || ''
      this._ctx.uid = options.uid.toString() || ''
      this._ctx.deviceId = options.deviceId
      this._ctx.bury_point = options?.bury_point || {}
      this._ctx.createSign = options.createSign
      if (options.rule) {
        this._ctx.rule = options.rule
      }
      window.addEventListener('click', (event) => {
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
          click_y_percent: ((click_page_y / screen_height).toFixed(2) * 100).toFixed(2),
          recommend_trace_id: app.$Tracker._ctx.currentPageTraceId,
        })
      })
    },
    setPageTraceId(traceId: string) {
      this._ctx.currentPageTraceId = traceId || ''
    },
    /**
     * 通用 track
     */
    track(trackData) {
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
            adGrounds.forEach((_data) => {
              send(ctx, _data)
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
    trackNavigation(extra) {
      if (checkRule(this._ctx, 'navigation')) {
        window.WebSDK?.track({
          event: 'navigation',
          payload: {
            navigation_key: extra.navigation_key,
            navigation_name: extra.navigation_name,
          },
        })
        return send(this._ctx, {
          event: 'navigation',
          ...extra,
        })
      }
    },

    // 应用页面展示 app_page_view
    trackAppPageView(extra) {
      if (checkRule(this._ctx, 'app_page_view')) {
        window.WebSDK?.track({
          event: 'app_page_view',
          payload: {
            user_type: extra.user_type,
            page_key: extra.page_key,
            page_name: extra.page_name,
            referrer_page_key: extra.referrer_page_key,
            referrer_page_name: extra.referrer_page_name,
            current_page_key: extra.current_page_key,
            current_page_name: extra.current_page_name,
            page_load_time: extra.page_load_time,
            recommend_trace_id: extra.recommend_trace_id,
          },
        })
        return send(this._ctx, {
          event: 'app_page_view',
          ...extra,
        })
      }
    },

    // 应用页面点击 page_click
    trackPageClick(extra) {
      if (checkRule(this._ctx, 'page_click')) {
        window.WebSDK?.track({
          event: 'page_click',
          payload: {
            page_key: extra.page_key,
            page_name: extra.page_name,
            click_page_x: extra.click_page_x,
            click_page_y: extra.click_page_y,
            click_x_percent: extra.click_x_percent,
            click_y_percent: extra.click_y_percent,
            screen_width: extra.screen_width,
            screen_height: extra.screen_height,
            recommend_trace_id: extra.recommend_trace_id,
          },
        })
        return send(this._ctx, {
          event: 'page_click',
          ...extra,
        })
      }
    },

    // APP 广告行为 advertising
    trackAdvertising(extra) {
      if (checkRule(this._ctx, 'advertising')) {
        window.WebSDK?.track({
          event: 'advertising',
          payload: {
            event_type: extra.event_type,
            advertising_key: extra.advertising_key,
            advertising_name: extra.advertising_name,
            advertising_id: extra.advertising_id,
          },
        })
        return send(this._ctx, {
          event: 'advertising',
          ...extra,
        })
      }
    },

    // 页面存活 page_lifecycle
    trackPageLifecycle(extra) {
      if (checkRule(this._ctx, 'page_lifecycle')) {
        return send(this._ctx, {
          event: 'page_lifecycle',
          ...extra,
        })
      }
    },

    // 视频事件 video_event
    trackVideoEvent(extra) {
      if (checkRule(this._ctx, 'video_event')) {
        const video_tag_name = extra.video_tag_name || '默认标签'
        const video_tag_key = buildTagKey(extra.video_tag_name)
        window.WebSDK?.track({
          event: 'video_event',
          payload: {
            media_id: extra.media_id,
            video_id: extra.video_id,
            video_title: extra.video_title,
            video_type_id: extra.video_type_id || 'default',
            video_type_name: extra.video_type_name || '默认分类',
            video_content_type: extra.video_content_type,
            video_tag_key,
            video_tag_name,
            video_duration: extra.video_duration,
            video_behavior_key: extra.video_behavior_key,
            video_behavior_name: extra.video_behavior_name,
            play_duration: extra.play_duration,
            play_progress: extra.play_progress,
            recommend_trace_id: extra.recommend_trace_id,
          },
        })
        return send(this._ctx, {
          event: 'video_event',
          ...extra,
          video_type_id: extra.video_type_id || 'default',
          video_type_name: extra.video_type_name || '默认分类',
          video_tag_key,
          video_tag_name,
          media_id: extra.media_id,
          recommend_trace_id: extra.recommend_trace_id,
        })
      }
    },

    // 关键词搜索 keyword_search
    trackKeywordSearch(extra) {
      if (checkRule(this._ctx, 'keyword_search')) {
        window.WebSDK?.track({
          event: 'keyword_search',
          payload: {
            keyword: extra.keyword,
            search_result_count: extra.search_result_count,
            search_content_type: extra.search_content_type,
            search_trace_id: extra.search_trace_id,
            search_id: extra.search_id,
          },
        })
        return send(this._ctx, {
          event: 'keyword_search',
          ...extra,
        })
      }
    },

    // 关键词搜索点击 keyword_click
    trackKeywordClick(extra) {
      if (checkRule(this._ctx, 'keyword_click')) {
        window.WebSDK?.track({
          event: 'keyword_click',
          payload: {
            keyword: extra.keyword,
            click_item_id: extra.click_item_id,
            click_item_type_key: extra.click_item_type_key,
            click_item_type_name: extra.click_item_type_name,
            click_position: extra.click_position,
            search_trace_id: extra.search_trace_id,
          },
        })
        return send(this._ctx, {
          event: 'keyword_click',
          ...extra,
        })
      }
    },

    // 广告展示 ad_impression
    trackAdImpression(extra) {
      if (checkRule(this._ctx, 'ad_impression')) {
        const ctx = this._ctx
        ad_impression_queue.push(extra)
        if (ad_impression_timer) {
          return
        }
        ad_impression_timer = setTimeout(() => {
          const adGrounds = groupAds()
          adGrounds.forEach((_data) => {
            window.WebSDK?.track({
              event: 'ad_impression',
              payload: {
                page_key: _data.page_key,
                page_name: _data.page_name,
                ad_slot_key: _data.ad_slot_key,
                ad_slot_name: _data.ad_slot_name,
                ad_id: _data.ad_id,
                creative_id: _data.creative_id,
                ad_type: _data.ad_type,
              },
            })
            send(ctx, {
              event: 'ad_impression',
              ..._data,
            })
          })
          ad_impression_queue = []
          clearTimeout(ad_impression_timer)
          ad_impression_timer = null
        }, 5000)
      }
    },

    // 小说事件 novel_event
    trackNovelEvent(extra) {
      if (checkRule(this._ctx, 'novel_event')) {
        const novel_tag_name = extra.novel_tag_name || '默认标签'
        const novel_tag_key = buildTagKey(extra.novel_tag_name)
        window.WebSDK?.track({
          event: 'novel_event',
          payload: {
            media_id: extra.media_id,
            novel_id: extra.novel_id,
            novel_title: extra.novel_title,
            chapter_id: extra.chapter_id,
            chapter_name: extra.chapter_name,
            novel_type_id: extra.novel_type_id || 'default',
            novel_type_name: extra.novel_type_name || '默认分类',
            recommend_trace_id: extra.recommend_trace_id,
            novel_tag_key,
            novel_tag_name,
            read_progress: extra.read_progress,
            page_no: extra.page_no,
            novel_behavior_key: extra.novel_behavior_key,
            novel_behavior_name: extra.novel_behavior_name,
          },
        })
        return send(this._ctx, {
          event: 'novel_event',
          ...extra,
          novel_type_id: extra.novel_type_id || 'default',
          novel_type_name: extra.novel_type_name || '默认分类',
          novel_tag_key,
          novel_tag_name,
          media_id: extra.media_id,
          recommend_trace_id: extra.recommend_trace_id,
        })
      }
    },

    // 漫画事件 comic_event
    trackComicEvent(extra) {
      if (checkRule(this._ctx, 'comic_event')) {
        const comic_tag_name = extra.comic_tag_name || '默认标签'
        const comic_tag_key = buildTagKey(extra.comic_tag_name)
        window.WebSDK?.track({
          event: 'comic_event',
          payload: {
            media_id: extra.media_id,
            comic_id: extra.comic_id,
            comic_title: extra.comic_title,
            comic_type_id: extra.comic_type_id || 'default',
            comic_type_name: extra.comic_type_name || '默认分类',
            recommend_trace_id: extra.recommend_trace_id,
            comic_tag_key,
            comic_tag_name,
            read_progress: extra.read_progress,
            page_no: extra.page_no,
            comic_behavior_key: extra.comic_behavior_key,
            comic_behavior_name: extra.comic_behavior_name,
          },
        })
        return send(this._ctx, {
          event: 'comic_event',
          ...extra,
          comic_type_id: extra.comic_type_id || 'default',
          comic_type_name: extra.comic_type_name || '默认分类',
          comic_tag_key,
          comic_tag_name,
          media_id: extra.media_id,
          recommend_trace_id: extra.recommend_trace_id,
        })
      }
    },

    // 广告点击 ad_click
    trackAdClick(extra) {
      if (checkRule(this._ctx, 'ad_click')) {
        window.WebSDK?.track({
          event: 'ad_click',
          payload: {
            page_key: extra.page_key,
            page_name: extra.page_name,
            ad_slot_key: extra.ad_slot_key,
            ad_slot_name: extra.ad_slot_name,
            ad_id: extra.ad_id,
            creative_id: extra.creative_id,
            ad_type: extra.ad_type,
          },
        })
        return send(this._ctx, {
          event: 'ad_click',
          ...extra,
        })
      }
    },
  }

  return {
    provide: {
      Tracker,
    },
  }
})
