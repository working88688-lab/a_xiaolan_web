<script setup lang="ts">
import type { AdItem, BannerItem } from '@types'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const props = defineProps<{
  items?: BannerItem[] | AdItem[]
  adKey?: string | number
  adName?: string
  adType?: string
}>()

const rowItemsLength = 5 // 每行5个
const rows = 2 // 两行
const itemsPerPage = rowItemsLength * rows // 每页10个

// 将广告项分组，每10个为一页
const adPages = computed(() => {
  if (!props.items?.length) return []
  const pages: (BannerItem[] | AdItem[])[] = []
  for (let i = 0; i < props.items.length; i += itemsPerPage) {
    pages.push(props.items.slice(i, i + itemsPerPage))
  }
  return pages
})
</script>

<template>
  <div :key="props.items?.length" class="py-0.5" @touchstart.stop @touchmove.stop @touchend.stop>
    <swiper
      v-if="adPages.length > 0"
      :modules="[Autoplay]"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false
      }"
      :loop="adPages.length > 1"
      class="ad-swiper"
    >
      <swiper-slide v-for="(page, pageIndex) in adPages" :key="pageIndex">
        <div class="grid w-full grid-cols-5 gap-x-1 gap-y-1">
          <ad-link
            v-for="(item, index) in page"
            :key="item.id"
            :ad-key="props.adKey"
            :ad-name="props.adName"
            :ad-type="props.adType"
            :index="pageIndex * itemsPerPage + index"
            class="my-swipe-item flex h-full !w-full flex-col items-center justify-center"
            :data="item as AdItem"
          >
            <div class="h-full w-full overflow-hidden rounded-sm">
              <dx-image fit="fill" :src="item.img_url" :alt="item.title" />
            </div>
            <div class="mt-[2px] max-w-full truncate text-center text-tiny font-normal leading-[24px] text-[#1a1a1a]">
              {{ item.title }}
            </div>
          </ad-link>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="postcss" scoped>
.ad-swipe-slide,
.ad-swipe-item {
  width: 48px;
  height: 48px;
}
</style>
