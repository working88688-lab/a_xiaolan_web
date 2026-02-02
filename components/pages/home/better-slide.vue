<template>
  <div ref="scrollRef" class="horizontal-wrapper">
    <div class="slide-banner-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
import Slide from '@better-scroll/slide'
import { onMounted } from 'vue'

BScroll.use(NestedScroll)
BScroll.use(Slide)

const scrollRef = ref()
let scroll
onMounted(() => {
  setTimeout(() => {
    scroll = new BScroll(scrollRef.value, {
      nestedScroll: {
        groupId: 'mixed-nested-scroll'
      },
      scrollX: true,
      scrollY: false,
      slide: {
        loop: false,
        autoplay: false,
        threshold: 100
      },
      momentum: false,
      bounce: false,
      click: true
    })
  }, 1000)
})
</script>

<style lang="less">
.slide-banner-content {
  white-space: nowrap;
  font-size: 0;
  .slide-item {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 26px;
  }
}
</style>
