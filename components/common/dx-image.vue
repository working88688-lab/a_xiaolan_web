<template>
  <div
    class="dx-image"
    :class="{
      'no-bg': props.noBg,
      'overflow-hidden !rounded-full': props.round
    }"
  >
    <img
      v-if="props.src"
      :key="props.src"
      v-lazyLoad:[props.groupId]="props.src"
      :style="{
        'object-fit': fit
      }"
      :data-index="props.index"
      :data-image-preview="preview"
      :alt="alt"
    />
    <img v-else style="object-fit: contain" :src="loading" alt="alt" />
  </div>
</template>

<script setup lang="ts">
import loading from '@assets/image/img_loading.png'

import type { CSSProperties } from 'vue'
const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    noBg?: boolean
    preview?: boolean
    groupId?: string | number
    index?: number
    fit?: CSSProperties['object-fit']
    round?: boolean
  }>(),
  {
    src: '',
    alt: undefined,
    noBg: false,
    preview: undefined,
    groupId: undefined,
    index: undefined,
    round: false,
    fit: 'cover'
  }
)
</script>

<style lang="less">
.dx-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #f6f6f6;
  &.no-bg {
    background: transparent;
  }
  img.loading {
    object-fit: contain !important;
  }
  img.is-error {
    object-fit: contain !important;
  }
}
</style>
