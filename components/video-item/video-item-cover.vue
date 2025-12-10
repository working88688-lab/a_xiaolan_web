<template>
  <div :style="computed_style" class="dx-video-item--cover relative overflow-hidden rounded-sm text-white">
    <dx-image :src="props.poster" />
    <div class="absolute bottom-0 left-0 flex w-full items-center justify-between p-[6px] text-sm">
      <slot name="views">
        <span>{{ $Utils.formatNumber(views ?? 0) }}次播放</span>
      </slot>

      <slot name="duration">
        <span>
          {{ duration }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  poster?: string
  views?: number | string
  duration?: number | string
  height?: number
}>()

const computed_style = computed(() => {
  return props.height
    ? {
        height: `${props.height}rem`
      }
    : undefined
})
</script>

<style scoped></style>
