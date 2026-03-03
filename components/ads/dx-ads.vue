<script setup lang="ts">
import type { AdItem, BannerItem } from '@types'

const props = defineProps<{
  items?: BannerItem[] | AdItem[]
  adKey?: string | number
  adName?: string
  adType?: string
}>()

const rowItemsLength = 6
const rows = 3

const splitIndex = rowItemsLength * rows

const rowOneItems = computed(() => {
  return props.items?.slice(0, splitIndex)
})
const rowTwoItems = computed(() => {
  return props.items?.slice(splitIndex, props.items.length) ?? []
})
</script>

<template>
  <div :key="props.items?.length" class="py-0.5" @touchstart.stop @touchmove.stop @touchend.stop>
    {{ props.items?.length }}
    <div class="grid grid-cols-6 gap-x-1 gap-y-0.5">
      <ad-link v-for="(item, index) in rowOneItems" :key="item.id" :ad-key="props.adKey" :ad-name="props.adName"
        :ad-type="props.adType" :index class="my-swipe-item" :data="item">
        <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded">
          <dx-image fit="fill" :src="item.img_url" :alt="item.title" />
        </div>
        <div class="ad-title mt-[2px] max-w-full truncate text-center text-sm text-base2">
          {{ item.title }}
        </div>
      </ad-link>
    </div>
    <MarqueeInfinite v-if="rowTwoItems.length" :items="rowTwoItems" gap="0.25rem" class="mt-1">
      <template #item="{ item, index }">
        <ad-link :key="item.id" :ad-key="props.adKey" :ad-name="props.adName"
          :index="index >= 0 && index < rowTwoItems.length - 1 ? index + 5 : (index % rowTwoItems.length) + 5"
          :ad-type="props.adType" class="ad-swipe-item" :data="item" :is-virtual="index > rowTwoItems.length - 1">
          <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded">
            <dx-image fit="fill" :src="item.img_url" :alt="item.title" />
          </div>
          <div class="ad-title mt-[2px] max-w-full truncate text-center text-sm text-base2">
            {{ item.title }}
          </div>
        </ad-link>
      </template>
    </MarqueeInfinite>
  </div>
</template>

<style lang="postcss" scoped>
.ad-swipe-slide,
.ad-swipe-item {
  width: 48px;
  height: 48px;
}

:deep(.report-click-item) {
  width: 48px;
}

.marquee {
  --swiper-wrapper-transition-timing-function: linear;

  .marquee {
    touch-action: pan-y;
  }

  :deep(.swiper-wrapper) {
    gap: 12px;
  }
}
</style>
