<template>
  <div class="page-container container">
    <div class="page-header" :style="headerStyle">
      <dx-navbar
        class="my-nav-bar"
        :right-text="props.rightText"
        :border="false"
        :title="props.title"
        left-arrow
        @click-left="__.$Back"
        @click-right="__.$NavigateTo(props.to || '/charge-record')"
      ></dx-navbar>
      <slot name="header"></slot>
    </div>
    <div class="scroll-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rightText?: string
  headerBg?: string
  title?: string
  color?: string
  to?: string
}>()
const headerStyle = computed(() => {
  return props.headerBg
    ? {
        backgroundImage: `url(${props.headerBg})`
      }
    : {}
})
const __ = useNuxtApp()
const _color = props.color || '#fff'
</script>

<style lang="less" scoped>
.my-nav-bar {
  background: transparent;
  :deep(.van-icon-arrow-left),
  :deep(.van-nav-bar__title) {
    color: v-bind(_color);
  }
  :deep(.van-nav-bar__text) {
    color: #999999;
    font-size: 14px;
  }
}
.page-header {
  background-size: 100%;
  z-index: 9;
  background-repeat: no-repeat;
}
</style>
