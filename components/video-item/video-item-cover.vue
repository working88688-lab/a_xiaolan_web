<template>
  <div :style="computed_style" class="dx-video-item--cover relative overflow-hidden rounded-sm text-white">
    <dx-image :src="props.poster" />
    <div
      v-if="bottomMetaVisible"
      class="absolute bottom-0 left-0 flex w-full items-center justify-between p-[6px] text-sm"
    >
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
  /** 高度（rem），与 widthPx 可同时使用 */
  height?: number
  /** 固定宽度（px），用于列表封面；仅设置宽度且无 height 时用横版 16:9 */
  widthPx?: number
  /** 是否显示底部播放次数 / 时长（待审核等非上架状态可关闭） */
  showBottomMeta?: boolean
}>()

const bottomMetaVisible = computed(() => props.showBottomMeta !== false)

const computed_style = computed(() => {
  const s: Record<string, string> = {}
  if (props.widthPx != null && Number.isFinite(props.widthPx)) {
    s.width = `${props.widthPx}px`
    s.flexShrink = '0'
  }
  if (props.height != null && Number.isFinite(props.height)) {
    s.height = `${props.height}rem`
  } else if (props.widthPx != null && Number.isFinite(props.widthPx)) {
    s.aspectRatio = '16 / 9'
  }
  return Object.keys(s).length ? s : undefined
})
</script>

<style scoped></style>
