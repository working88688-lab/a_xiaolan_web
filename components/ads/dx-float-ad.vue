<script setup lang="ts">
import 'swiper/css'
import { Controller, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { AdItem } from '@types'

const props = defineProps<{
  items?: Array<AdItem>
  showClose?: boolean
}>()
</script>

<template>
  <div v-if="props?.items?.length" class="dx-float-ad">
    <div class="dx-float-ad-container">
      <swiper :modules="[Controller, Autoplay]" class="swiper-container h-full w-full overflow-hidden rounded-sm"
        :touch-move-stop-propagation="true" :loop="true" :autoplay="true" :space-between="0" :initial-slide="0"
        :centered-slides="true">
        <swiper-slide v-for="(item, index) in props.items" :key="item.id">
          <ad-link class="my-swipe-item" :data="item">
            <div class="aspect-h-1 aspect-w-1">
              <dx-image fit="fill" :src="item.img_url" no-bg :alt="item.title" />
            </div>
            <div class="mt-[2px] max-w-full truncate text-center text-sm text-[#666]">{{ item.title }}</div>
          </ad-link>
        </swiper-slide>
      </swiper>
    </div>
    <div v-if="showClose" class="dx-float-ad-close">
      <nuxt-icon name="close"></nuxt-icon>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.dx-float-ad {
  position: absolute;
  right: 10px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-container {
    width: 60px;
    height: 60px;
    /* border-radius: 8px; */
    overflow: hidden;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
  }

  &-close {
    margin-top: 8px;
    background-color: #a1a1a1;
    border-radius: 50%;
    color: #fff;
    font-size: 22px;
  }
}
</style>
