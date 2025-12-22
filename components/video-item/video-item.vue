<template>
  <div
    class="video-item flex"
    :class="{
      'flex-col': props.align === 'column'
    }"
  >
    <video-item-cover :class="{ 'flex-1': props.align === 'row' }" :views :duration :poster :height></video-item-cover>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    poster?: string
    views?: number | string
    duration?: number | string
    height?: number
    align?: 'row' | 'column'
  }>(),
  {
    poster: '',
    views: undefined,
    duration: undefined,
    height: 2.75,
    align: 'row'
  }
)
</script>

<style lang="postcss"></style>
