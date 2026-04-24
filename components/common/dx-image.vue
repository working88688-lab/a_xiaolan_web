<template>
  <div ref="containerRef" :class="classNames">
    <img
      v-if="props.src && isDirectSrc"
      :key="props.src"
      :src="props.src"
      :style="{
        'object-fit': fit
      }"
      :data-index="props.index"
      :data-image-preview="preview"
      :alt="alt"
    />
    <img
      v-else-if="props.src"
      :key="props.src"
      v-lazyLoad:[props.groupId]="props.src"
      :style="{
        'object-fit': fit
      }"
      :data-index="props.index"
      :data-image-preview="preview"
      :alt="alt"
      @decrypted="onDecrypted"
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

const [name, bem] = createNamespace('image')

const classNames = computed(() => {
  return [
    bem({
      round: props.round,
      noBg: props.noBg
    })
  ]
})

const isDirectSrc = computed(() => {
  const s = String(props.src ?? '').trim()
  if (!s) return false
  // 本地预览（blob/data）不走 lazyLoad 指令，否则无法反显
  return s.startsWith('blob:') || s.startsWith('data:')
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')

function onDecrypted() {
  containerRef.value?.classList.add('dx-image--noBg')
  containerRef.value?.classList.remove('dx-image--loading')
}
</script>

<style lang="postcss">
.dx-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #f6f6f6;

  &--noBg {
    background: transparent;
  }

  &--round {
    border-radius: 50%;
    overflow: hidden;
  }

  &--placeholder {
    width: 60%;
    height: 60%;
  }

  img.is-error,
  img.loading {
    object-fit: contain !important;
    /* width: 60%;
    height: 60%; */
  }

  &--element {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &--gray {
    background: var(--dx-base8-color);
  }

  &--loading {
    height: var(--image-loading-height);
  }
}
</style>
