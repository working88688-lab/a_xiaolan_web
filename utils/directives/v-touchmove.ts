import type { DirectiveBinding } from 'vue'

export const vTouchMoveTranslate = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const translateX = { value: 0 }
    const translateY = { value: 0 }
    let startX: number
    let startY: number

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        event.preventDefault()
        event.stopPropagation()
        const touch = event.touches[0]
        startX = touch.clientX
        startY = touch.clientY
        const currentTransform = getCurrentTransform(el)
        const scaleX = currentTransform.scaleX || 1
        const handleTouchMove = (event: TouchEvent) => {
          if (event.touches.length === 1) {
            event.stopPropagation()
            event.preventDefault()
            const touch = event.touches[0]

            const deltaX = touch.clientX - startX
            const deltaY = touch.clientY - startY

            translateX.value += deltaX
            translateY.value += deltaY

            const transformStr = `translate(${translateX.value}px, ${translateY.value}px) scale(${scaleX})`
            el.style.transform = transformStr

            // 更新起始位置
            startX = touch.clientX
            startY = touch.clientY
          }
        }

        const handleTouchEnd = () => {
          el.removeEventListener('touchmove', handleTouchMove)
          el.removeEventListener('touchend', handleTouchEnd)
        }

        el.addEventListener('touchmove', handleTouchMove)
        el.addEventListener('touchend', handleTouchEnd)
      }
    }

    el.addEventListener('touchstart', handleTouchStart)

    // 清理事件监听器
    el._vDirectListener = () => {
      el.removeEventListener('touchstart', handleTouchStart)
    }
  },

  unmounted(el: HTMLElement) {
    el._vDirectListener?.()
  }
}
