<template>
  <div class="empty-container">
    <van-empty :image-size="size" v-bind="$attrs">
      <template #image>
        <img class="empty-icon" src="@assets/image/noData.png" alt="" />
      </template>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import type { EmptyProps } from 'vant'
withDefaults(
  defineProps<{
    position?: string
    size?: EmptyProps['imageSize']
  }>(),
  {
    position: 'static',
    size: () => ['8.6rem', '5rem']
  }
)
</script>

<style lang="less" scoped>
.empty-container {
  position: v-bind(position);
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .empty-icon {
    object-fit: cover;
    width: 100%;
    height: auto;
  }
}
</style>
