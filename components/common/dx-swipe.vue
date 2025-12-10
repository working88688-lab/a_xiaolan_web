<template>
  <van-swipe v-if="list?.length" :autoplay="3000" class="my-swipe my-top-swipe">
    <van-swipe-item v-for="(item, index) in props.list" :key="index">
      <ad-link class="my-swipe-item" :data="item">
        <slot name="item" :item="item">
          <dx-image fit="fill" :src="item.img_url" :alt="item.title" />
        </slot>
      </ad-link>
    </van-swipe-item>
  </van-swipe>
</template>

<script setup lang="ts">
import type { AdItem } from '@types'

const props = withDefaults(
  defineProps<{
    list?: AdItem[]
    height?: number
  }>(),
  {
    list: () => [],
    height: 140
  }
)
</script>

<style lang="postcss">
.my-swipe {
  .my-swipe-item {
    height: 140px;
  }
}
.van-swipe__indicators {
  will-change: transform;
}

.van-swipe {
  .van-swipe__indicator {
    transition: all 0.3s;

    &.van-swipe__indicator--active {
      width: 22px;
      border-radius: 50px;
    }
  }
}
</style>
