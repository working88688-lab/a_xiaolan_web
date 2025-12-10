function createFetchQueue(maxConcurrency = 5) {
  let currentCount = 0
  const queue = []

  function runNext() {
    if (currentCount >= maxConcurrency) return
    if (queue.length === 0) return

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

  function enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      queue.push({ taskFn, resolve, reject })
      runNext()
    })
  }

  function limitedFetch(input, init) {
    return enqueue(() => fetch(input, init))
  }

  return limitedFetch
}
const limitedFetch = createFetchQueue(5)
const DEFAULT_REPORT_URL = 'https://api.shuifeng.cc/api/eventTracking/report.json'
// 简单 UUID 生成
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 设备类型
function getDeviceType() {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  return 'PC'
}

// 持久化 device_id
function getDeviceId() {
  try {
    const KEY = 'sf_device_id'
    var id = localStorage.getItem(KEY)
    if (!id) {
      id = generateUUID()
      localStorage.setItem(KEY, id)
    }
    return id
  } catch (e) {
    return generateUUID()
  }
}

// 会话 id
function getSessionId() {
  try {
    const KEY = 'sf_session_id'
    var id = sessionStorage.getItem(KEY)
    if (!id) {
      id = generateUUID()
      sessionStorage.setItem(KEY, id)
    }
    return id
  } catch (e) {
    return generateUUID()
  }
}

// 公共字段
function buildCommonFields(ctx, eventCode) {
  var nowTs = Math.floor(Date.now() / 1000)

  return {
    event: eventCode || '', // 事件名称/Code
    channel: ctx.channel || '', // 渠道码
    event_id: generateUUID(), // 事件唯一标识
    app_id: ctx.appId || '', // 应用 id
    uid: ctx.uid || '', // 用户 id
    sid: getSessionId(), // 会话 id
    client_ts: nowTs, // 10 位时间戳
    device: getDeviceType(), // 设备类型
    device_id: getDeviceId(), // 设备 id
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    device_brand: '', // Web 为空
    device_model: '' // Web 为空
  }
}

// 实际上报方法
function send(ctx, eventCode, extra) {
  if (!ctx.reportUrl && !DEFAULT_REPORT_URL) {
    if (typeof console !== 'undefined') {
      console.error('[Tracker] reportUrl 未配置')
    }
  }

  var common = buildCommonFields(ctx, eventCode)
  var data = {}
  var key

  // 合并公共字段
  for (key in common) {
    if (Object.prototype.hasOwnProperty.call(common, key)) {
      data[key] = common[key]
    }
  }

  // 合并 extra
  if (extra) {
    for (key in extra) {
      data[key] = extra[key]
    }
  }

  var form = new URLSearchParams()
  for (key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      var v = data[key]
      form.append(key, v == null ? '' : String(v))
    }
  }

  return limitedFetch(ctx.reportUrl || DEFAULT_REPORT_URL, {
    method: 'POST',
    body: form
  })
}
// SDK 主体
export const Tracker = {
  _ctx: {
    appId: '',
    channel: '',
    uid: '',
    reportUrl: DEFAULT_REPORT_URL,
    adSelector: '',
    searchResultClickSelector: ''
  },
  /**
   * 初始化 SDK
   * @param {{appId: string, channel?: string, reportUrl?: string, adSelector?: string}} options
   */
  init: function (options) {
    options = options || {}
    this._ctx.appId = options.appId || ''
    this._ctx.channel = options.channel || ''
    if (options.reportUrl) {
      this._ctx.reportUrl = options.reportUrl
    }
    const adSelector = options.adSelector
    window.addEventListener('click', event => {
      const el = event.target
      // 广告点击追踪
      if (el.classList.contains(adSelector)) {
        const trackData = el.dataset.track
        return Tracker.trackAdClick(JSON.parse(trackData))
      }
      // 搜索结果点击追踪
      const searchResultClickSelector = options.searchResultClickSelector
      if (el.classList.contains(searchResultClickSelector)) {
        const trackData = el.dataset.track
        return Tracker.trackKeywordClick(JSON.parse(trackData))
      }
      //  点击事件追踪
      // const click_page_x = event.clientX
      // const click_page_y = event.clientY
      // const screen_width = window.screen.width
      // const screen_height = window.screen.height
      // Tracker.trackPageClick({
      //   click_page_x,
      //   click_page_y,
      //   screen_width,
      //   screen_height,
      //   click_x_percent: (click_page_x / screen_width).toFixed(2) * 100,
      //   click_y_percent: (click_page_y / screen_height).toFixed(2) * 100
      // })
    })

    if (adSelector) {
      const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target
            const trackData = el.dataset.track
            Tracker.trackAdImpression(JSON.parse(trackData))
            observer.unobserve(el)
          }
        })
      })
      const adDisplayItems = Array.from(document.querySelectorAll(`.${adSelector}`))
      if (adDisplayItems.length) {
        adDisplayItems.forEach(el => {
          observer.observe(el)
        })
      }
    }
  },

  /**
   * 设置 / 更新当前用户 id
   */
  setUid: function (uid) {
    this._ctx.uid = uid || ''
  },

  /**
   * 通用 track
   */
  track: function (eventCode, extra) {
    return send(this._ctx, eventCode, extra)
  },

  // 落地页展示 landing_page_view
  trackLandingPageView: function (extra) {
    return send(this._ctx, 'landing_page_view', extra)
  },

  // 落地页点击 landing_page_click
  trackLandingPageClick: function (extra) {
    return send(this._ctx, 'landing_page_click', extra)
  },

  // 用户注册 user_register
  trackUserRegister: function (extra) {
    return send(this._ctx, 'user_register', extra)
  },

  // 用户登录 user_login
  trackUserLogin: function (extra) {
    return send(this._ctx, 'user_login', extra)
  },

  // 导航路径行为 navigation
  trackNavigation: function (extra) {
    return send(this._ctx, 'navigation', extra)
  },

  // 应用页面展示 app_page_view
  trackAppPageView: function (extra) {
    return send(this._ctx, 'app_page_view', extra)
  },

  // 应用页面点击 page_click
  trackPageClick: function (extra) {
    return send(this._ctx, 'page_click', extra)
  },

  // APP 广告行为 advertising
  trackAdvertising: function (extra) {
    return send(this._ctx, 'advertising', extra)
  },

  // 页面存活 page_lifecycle
  trackPageLifecycle: function (extra) {
    return send(this._ctx, 'page_lifecycle', extra)
  },

  // 视频事件 video_event
  trackVideoEvent: function (extra) {
    return send(this._ctx, 'video_event', extra)
  },

  // 视频点赞 / 取消点赞 video_like
  trackVideoLike: function (extra) {
    return send(this._ctx, 'video_like', extra)
  },

  // 视频评论 video_comment
  trackVideoComment: function (extra) {
    return send(this._ctx, 'video_comment', extra)
  },

  // 视频收藏 / 取消收藏 video_collect
  trackVideoCollect: function (extra) {
    return send(this._ctx, 'video_collect', extra)
  },

  // 视频购买 video_purchase
  trackVideoPurchase: function (extra) {
    return send(this._ctx, 'video_purchase', extra)
  },

  // 关键词搜索 keyword_search
  trackKeywordSearch: function (extra) {
    return send(this._ctx, 'keyword_search', extra)
  },

  // 关键词搜索点击 keyword_click
  trackKeywordClick: function (extra) {
    return send(this._ctx, 'keyword_click', extra)
  },

  // 广告展示 ad_impression
  trackAdImpression: function (extra) {
    return send(this._ctx, 'ad_impression', extra)
  },

  // 广告点击 ad_click
  trackAdClick: function (extra) {
    return send(this._ctx, 'ad_click', extra)
  }
}
