<template>
  <div @touchstart.stop>
    <Swiper
      :modules="[FreeMode, Mousewheel]"
      :slides-per-view="'auto'"
      :free-mode="true"
      direction="horizontal"
      :mousewheel="{
        forceToAxis: true
      }"
      class="my-free-swiper"
    >
      <slot></slot>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper } from 'swiper/vue'

// 按需引入模块
import { FreeMode, Mousewheel } from 'swiper/modules'

// 样式（必须）
import 'swiper/css'
import 'swiper/css/free-mode'
</script>

<style scoped></style>
