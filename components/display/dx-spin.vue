<template>
  <div class="dx-spin flex-center my-1 mb-1.5">
    <slot name="loading-icon">
      <van-loading size="0.6rem" type="spinner" />
    </slot>
    <span class="loading-tip ml-1">
      {{ props.tip }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tip?: string
  }>(),
  {
    tip: '加载中...'
  }
)
</script>

<style lang="postcss">
.dx-spin {
  --van-loading-spinner-color: var(--dx-primary-color, #fff);
  color: var(--dx-primary-color, #fff);
}
</style>
