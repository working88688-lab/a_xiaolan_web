<script setup lang="ts">
import type { AdItem, BannerItem } from '@types'

const props = defineProps<{
  items?: BannerItem[] | AdItem[]
  adKey?: string | number
  adName?: string
  adType?: string
  /**
   * 每行展示数量，默认 6（与现有首页一致）
   */
  cols?: number
  /**
   * 固定展示的行数。超过 cols*rows 的部分会进入“最后一排自动轮播”
   * 默认 3（保持现有行为不变）
   */
  rows?: number
}>()

const rowItemsLength = computed(() => (Number.isFinite(Number(props.cols)) && Number(props.cols) > 0 ? Number(props.cols) : 6))
const rows = computed(() => (Number.isFinite(Number(props.rows)) && Number(props.rows) > 0 ? Number(props.rows) : 3))

const splitIndex = computed(() => rowItemsLength.value * rows.value)

const rowOneItems = computed(() => {
  return props.items?.slice(0, splitIndex.value)
})
const rowTwoItems = computed(() => {
  return props.items?.slice(splitIndex.value, props.items.length) ?? []
})
</script>

<template>
  <div :key="props.items?.length" class="py-0.5" @touchstart.stop @touchmove.stop @touchend.stop>
    <div class="grid gap-x-1 gap-y-0.5" :style="{ gridTemplateColumns: `repeat(${rowItemsLength}, minmax(0, 1fr))` }">
      <ad-link
        v-for="(item, index) in rowOneItems"
        :key="item.id"
        :ad-key="props.adKey"
        :ad-name="props.adName"
        :ad-type="props.adType"
        :index
        class="my-swipe-item"
        :data="item"
      >
        <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded">
          <dx-image fit="fill" :src="item.img_url" :alt="item.title" />
        </div>
        <div class="ad-title mt-[2px] max-w-full truncate text-center text-tiny text-base2">
          {{ item.title }}
        </div>
      </ad-link>
    </div>
    <MarqueeInfinite v-if="rowTwoItems.length" :items="rowTwoItems" gap="0.32rem" class="mt-1">
      <template #item="{ item, index }">
        <ad-link
          :key="item.id"
          :ad-key="props.adKey"
          :ad-name="props.adName"
          :index="
            index >= 0 && index < rowTwoItems.length - 1
              ? index + splitIndex
              : (index % rowTwoItems.length) + splitIndex
          "
          :ad-type="props.adType"
          class="ad-swipe-item"
          :data="item"
          :is-virtual="index > rowTwoItems.length - 1"
        >
          <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded">
            <dx-image fit="fill" :src="item.img_url" :alt="item.title" />
          </div>
          <div class="ad-title mt-[2px] max-w-full truncate text-center text-tiny text-base2">
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
