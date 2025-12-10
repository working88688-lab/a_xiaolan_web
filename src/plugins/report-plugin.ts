/* eslint-disable */
// @ts-nocheck

function getPageTrackData(page: any) {
  return {
    key: page.name,
    name: page.meta?.trackPageName || page.meta?.title || page.query?.title,
  }
}

const PAGE_ALIVE_MAP = new Map()
const PAGE_LOAD_MAP = new Map()
let PAGE_ALIVE_TIMER: any


export default defineNuxtPlugin((nuxtApp) => {

  const route = useRoute()
  document.addEventListener('visibilitychange', (e) => {
    const cache = PAGE_ALIVE_MAP.get(route.name);
    if (document.hidden) {
      PAGE_ALIVE_MAP.set(route.name, {
        status: 'hidden',
        alive_time: performance.now() - cache.show_at
      })
    } else {
      PAGE_ALIVE_MAP.set(route.name, {
        status: 'show',
        show_at: performance.now(),
        alive_time: cache.alive_time
      })
    }
  })
  const app = useNuxtApp()

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

    PAGE_ALIVE_MAP.set(route.name, {
      status: 'status',
      show_at: performance.now(),
      alive_time: 0
    })

  })

  app.$router.afterEach((to, from) => {
    const pageMeta = getPageTrackData(to)
    const referrerMeta = getPageTrackData(from)
    app.$Tracker.trackAppPageView({
      page_key: pageMeta.key,
      page_name: pageMeta.name,
      referrer_page_key: referrerMeta.key,
      referrer_page_name: referrerMeta.name,
      current_page_key: pageMeta.key,
      current_page_name: pageMeta.name,
      page_load_time: performance.now() - PAGE_LOAD_MAP.get(to.name)
    })

    PAGE_ALIVE_TIMER = setInterval(() => {
      const current = PAGE_ALIVE_MAP.get(to.name);
      if (current) {
        app.$Tracker.trackPageLifecycle({
          lifecycle_status: current.status,
          page_key: pageMeta.key,
          page_name: pageMeta.name,
          duration: current.status === 'show' ? performance.now() - current.show_at + (current.alive_time || 0) : current.alive_time
        })
      } else {
        app.$Tracker.trackPageLifecycle({
          lifecycle_status: 'show',
          page_key: pageMeta.key,
          page_name: pageMeta.name,
          duration: 10 * 60
        })
      }
    }, 10 * 60 * 1000)
  })

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

    function limitedFetch(report_json) {
      return enqueue(() => app.$Api.Home.report({ report_json: JSON.stringify(report_json) }))
    }

    return limitedFetch
  }
  const limitedFetch = createFetchQueue(5)

  // 实际上报方法
  function send(trackData) {
    return limitedFetch(trackData)
  }
  // SDK 主体
  const Tracker = {
    _ctx: {
      appId: '',
      channel: '',
      uid: '',
    },
    /**
     * 初始化 SDK
     * @param {{appId?: string, channel?: string, reportUrl?: string, adSelector?: string}} options
     */
    init: function (options) {
      options = options || {}
      this._ctx.appId = options.appId || ''
      this._ctx.channel = options.channel || ''
      const adSelector = options.adSelector
      window.addEventListener('click', event => {
        const el = event.target
        //  点击事件追踪
        const click_page_x = event.clientX
        const click_page_y = event.clientY
        const screen_width = window.screen.width
        const screen_height = window.screen.height
        app.$Tracker.trackPageClick({
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
      return send(trackData)
    },
    // 导航路径行为 navigation
    trackNavigation: function (extra) {
      return send({
        event: 'navigation',
        ...extra
      })
    },

    // 应用页面展示 app_page_view
    trackAppPageView: function (extra) {
      return send({
        event: 'app_page_view',
        ...extra
      })
    },

    // 应用页面点击 page_click
    trackPageClick: function (extra) {
      return send({
        event: 'page_click',
        ...extra
      })
    },

    // APP 广告行为 advertising
    trackAdvertising: function (extra) {
      return send({
        event: 'advertising',
        ...extra
      })
    },

    // 页面存活 page_lifecycle
    trackPageLifecycle: function (extra) {
      return send({
        event: 'page_lifecycle',
        ...extra
      })
    },

    // 视频事件 video_event
    trackVideoEvent: function (extra) {
      return send({
        event: 'video_event',
        ...extra
      })
    },

    // 关键词搜索 keyword_search
    trackKeywordSearch: function (extra) {
      return send({
        event: 'keyword_search',
        ...extra
      })
    },

    // 关键词搜索点击 keyword_click
    trackKeywordClick: function (extra) {
      return send({
        event: 'keyword_click',
        ...extra
      })
    },

    // 广告展示 ad_impression
    trackAdImpression: function (extra) {
      return send({
        event: 'ad_impression',
        ...extra
      })
    },

    // 广告点击 ad_click
    trackAdClick: function (extra) {
      return send({
        event: 'ad_click',
        ...extra
      })
    }
  }

  return {
    provide: {
      Tracker: Tracker,
    },
  }
})
