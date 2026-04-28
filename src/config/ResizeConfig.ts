/**
 * desc: 屏幕适配
 * date: 2024.04.01
 */

// 设置尺寸
function setRem() {
  ;(function flexible(window, document) {
    const docEl = document.documentElement
    const dpr = window.devicePixelRatio || 1

    // adjust body font size
    function setBodyFontSize() {
      if (document.body) {
        document.body.style.fontSize = `${12 * dpr}px`
      } else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize)
      }
    }

    const MAX_DIVICE_WIDTH = 500
    /** 布局/弹窗上限宽度（px），供 CSS var(--max-app-width) 与 device-width 大屏分支一致 */
    docEl.style.setProperty('--max-app-width', `${MAX_DIVICE_WIDTH}px`)
    setBodyFontSize()
    function setRemUnit() {
      const clientWidth = docEl.clientWidth
      if (clientWidth <= MAX_DIVICE_WIDTH) {
        const rem = clientWidth / 10
        docEl.style.fontSize = `${rem}px`

        docEl.style.setProperty('--device-width', '100%')
      } else {
        docEl.style.setProperty('--device-width', `${MAX_DIVICE_WIDTH}px`)
        const rem = MAX_DIVICE_WIDTH / 10
        docEl.style.fontSize = `${rem}px`
      }
    }

    setRemUnit()

    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', e => {
      if (e.persisted) {
        setRemUnit()
      }
    })
    if (!isPWA()) {
      // 可能需要移除 padding，避免重复
      document.documentElement.classList.add('in-webview')
      document.body.classList.add('in-webview')
    }
  })(window, document)
}

export default defineNuxtPlugin(() => {
  setRem()
})
