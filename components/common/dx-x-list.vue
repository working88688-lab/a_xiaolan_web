<template>
  <div ref="scroller_ref" class="dx-x-list flex w-full overflow-auto">
    <div ref="inner_ref" v-bind="$attrs" class="pointer-events-none relative flex items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const scroller_ref = ref()
const inner_ref = ref()

let scroller_width: number
let inner_width: number

let start_x = 0
let is_at_edge = false
onMounted(() => {
  scroller_width = (scroller_ref.value as HTMLDivElement).getBoundingClientRect().width
  inner_width = (inner_ref.value as HTMLDivElement).getBoundingClientRect().width
  useEventListener(
    scroller_ref.value,
    'touchstart',
    e => {
      start_x = e.touches[0].clientX
    },
    {
      passive: true
    }
  )

  useEventListener(
    scroller_ref.value,
    'touchmove',
    e => {
      const moveX = e.touches[0].clientX

      if (moveX - start_x > 0) {
        is_at_edge = scroller_ref.value.scrollLeft === 0
      } else {
        is_at_edge =
          scroller_width >= inner_width || scroller_ref.value.scrollLeft === Math.ceil(inner_width - scroller_width)
      }

      if (!is_at_edge) {
        e.stopPropagation()
      }
    },
    {
      passive: true
    }
  )
})
</script>

<style lang="postcss" scoped></style>
