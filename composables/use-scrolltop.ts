import type { ShallowRef } from 'vue'
import { useEventListener, useThrottleFn } from '@vueuse/core'

export function useScrollTop(
  el: Readonly<ShallowRef<HTMLElement | any>> | Ref<HTMLElement | any>,
  scrollhandler?: (e: number) => void
) {
  const scrollTop = ref(0)
  onMounted(() => {
    useEventListener(
      el,
      'scroll',
      useThrottleFn(
        e => {
          const _scrollTop = e.target.scrollTop
          scrollTop.value = _scrollTop

          scrollhandler?.(_scrollTop)
        },
        100,
        true,
        true
      ),
      {
        passive: true
      }
    )
  })

  return {
    scrollTop
  }
}
