<script setup lang="ts">
const { tip = '~~我也是有底线的~~' } = defineProps<{
  tip?: string
}>()
</script>

<template>
  <div class="end-tip">
    {{ tip }}
  </div>
</template>

<style lang="postcss" scoped>
.end-tip {
  text-align: center;
  padding: 8px 0;
  color: #999;
}
</style>
