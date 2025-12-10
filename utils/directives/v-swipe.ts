import type { Directive, DirectiveBinding } from 'vue'

interface SwipeHandlers {
  handleTouchStart: (event: TouchEvent) => void
  handleTouchEnd: (event: TouchEvent) => void
}

declare global {
  interface HTMLElement {
    __swipeHandlers?: SwipeHandlers
  }
}

export const vSwipe: Directive<HTMLElement, (direction: 'left' | 'right') => void> = {
  mounted(el, binding: DirectiveBinding<(direction: 'left' | 'right') => void>) {
    let startX = 0
    let startY = 0
    let startTime = 0
    const threshold = 20 // 最小滑动距离
    const maxDuration = 300 // 最大滑动时间，单位 ms

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX
      startY = event.touches[0].clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0].clientX
      const endY = event.changedTouches[0].clientY
      const diffX = endX - startX
      const diffY = endY - startY
      const duration = Date.now() - startTime
      if (Math.abs(diffY) < threshold && Math.abs(diffX) > threshold && duration < maxDuration) { // 快速滑动
        if (diffX > 0) {
          binding.value('right') // 右滑
        }
        else {
          binding.value('left') // 左滑
        }
      }
    }

    el.__swipeHandlers = { handleTouchStart, handleTouchEnd }
    el.addEventListener('touchstart', handleTouchStart, true)
    el.addEventListener('touchend', handleTouchEnd, true)
  },

  beforeUnmount(el) {
    if (el.__swipeHandlers) {
      el.removeEventListener('touchstart', el.__swipeHandlers.handleTouchStart, true)
      el.removeEventListener('touchend', el.__swipeHandlers.handleTouchEnd, true)
      delete el.__swipeHandlers
    }
  },
}
