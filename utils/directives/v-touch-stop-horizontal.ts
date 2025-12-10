export const vTouchStopHorizontal = {
  mounted(el: HTMLElement) {
    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX
      const deltaY = e.touches[0].clientY - startY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 横向滑动，阻止冒泡
        e.stopPropagation()
      }
    }
    // @ts-ignore
    el.__touchHandlers__ = {
      onTouchStart,
      onTouchMove
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
  },

  unmounted(el: HTMLElement) {
    // @ts-ignore
    const handlers = el.__touchHandlers__
    if (handlers) {
      el.removeEventListener('touchstart', handlers.onTouchStart)
      el.removeEventListener('touchmove', handlers.onTouchMove)
      // @ts-ignore
      delete el.__touchHandlers__
    }
  }
}
