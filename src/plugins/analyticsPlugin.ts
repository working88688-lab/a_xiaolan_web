/* eslint-disable */
// @ts-nocheck
/**
 * desc: Google统计分析
 * date: 2023.03.20
 */
export default defineNuxtPlugin(() => {
  if (process.client) {
    ;(function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r
      ;(i[r] =
        i[r] ||
        function () {
          ;(i[r].q = i[r].q || []).push(arguments)
        }),
        (i[r].l = 1 * new Date())
      ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
      a.async = 1
      a.src = g
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'js/analytics.js', 'ga')
    ga('create', 'UA-137257734-1', {
      storage: 'none',
      clientId: localStorage.getItem('ga:clientId')
    })
    ga(function (tracker) {
      localStorage.setItem('ga:clientId', tracker.get('clientId'))
    })
    ga('set', 'checkProtocolTask', null)
    ga('set', 'page', 'index')
    ga('send', 'pageview')
  }
})
