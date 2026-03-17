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
      <SwiperSlide v-for="item in props.list" :key="item.id" class="horizontal-item">
        <video-card :item="item"></video-card>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'

import { FreeMode, Mousewheel } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'

const props = defineProps<{
  list?: any[]
}>()
</script>

<style lang="postcss" scoped>
.horizontal-item {
  margin-right: 8px;
  width: var(--swiper-width, 320px);
}
</style>
