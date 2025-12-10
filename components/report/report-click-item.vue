<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
  data: any
  stopPropagation?: boolean
}>()

defineOptions({
  inheritAttrs: false
})

const app = useNuxtApp()
const clickRef = useTemplateRef('clickRef')

useEventListener(clickRef, 'click', (event: Event) => {
  app.$Tracker.track(props.data)
  if (props.stopPropagation) {
    event.stopPropagation()
  }
})
</script>

<template>
  <div ref="clickRef" class="report-click-item">
    <slot></slot>
  </div>
</template>
