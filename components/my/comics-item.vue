<script setup lang="ts">
import type { BaseCard, StoryData } from '@types'

const __ = useNuxtApp()

const props = withDefaults(
  defineProps<{
    item: BaseCard | StoryData
    page?: string
    lines?: boolean
  }>(),
  {
    lines: true,
    page: 'comics'
  }
)

function getViewCount(item: any) {
  return item?.view_count ?? item?.view_num ?? item?.rating ?? 0
}

function getTotalCount(item: any) {
  return item?.total ?? (Array.isArray(item?.series) ? item.series.length : 0) ?? 0
}
</script>

<template>
  <nuxt-link class="graphic-information-common" :to="`/${props.page}?id=${item.id}`">
    <dx-cover class="aspect-h-4 aspect-w-3 overflow-hidden rounded-[8px]" :poster="props.item?.thumb_full">
      <dx-pay-type :coins="(props.item as any)?.coins" class="absolute right-0.5 top-0.5" />
      <div class="absolute bottom-0.5 left-0.5 right-0.5 z-10 flex justify-between text-white">
        <div class="flex items-center gap-0.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.0386 3.59131C5.021 3.59131 0.952637 10.0015 0.952637 10.0015C0.952637 10.0015 5.021 16.4136 10.0386 16.4136C15.0562 16.4136 19.1245 10.0425 19.1245 10.0425C19.1245 10.0425 15.0581 3.59131 10.0386 3.59131ZM10.0386 12.7026C8.54731 12.7026 7.33838 11.4937 7.33838 10.0024C7.33838 8.51117 8.54731 7.30225 10.0386 7.30225C11.5298 7.30225 12.7388 8.51117 12.7388 10.0024C12.7388 11.4937 11.5299 12.7026 10.0386 12.7026Z"
              fill="white"
            />
          </svg>
          <span class="text-[0.28rem]">
            {{ __.$Utils.formatNumber(getViewCount(props.item) || 0) }}
          </span>
        </div>
        <div class="text-[0.28rem]">{{ getTotalCount(props.item) || 0 }}张</div>
      </div>
      <div
        v-if="props.page !== 'images'"
        class="absolute bottom-0.5 right-0 z-10 rounded-s-lg bg-morange py-[2px] pl-1 pr-0.5 text-tiny text-white"
      >
        {{ (props.item as any)?.is_finish ? '已完结' : '连载中' }}
      </div>
    </dx-cover>
    <div class="text-sm" :class="[props.lines ? 'line-clamp-2' : 'truncate']">
      {{ props.item.title }}
    </div>
  </nuxt-link>
</template>
