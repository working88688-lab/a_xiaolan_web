<script setup lang="ts">
import type { BaseCard, StoryData } from '@types'

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
</script>

<template>
  <nuxt-link class="graphic-information-common" :to="`/${props.page}?id=${item.id}`">
    <dx-cover class="aspect-h-4 aspect-w-3" :poster="props.item?.thumb_full">
      <dx-pay-type :coins="item.coins" class="absolute right-0.5 top-0.5" />
      <div
        v-if="props.page !== 'images'"
        class="absolute bottom-0.5 right-0 z-10 rounded-s-lg bg-morange py-[2px] pl-1 pr-0.5 text-tiny text-white"
      >
        {{ item.is_finish ? '已完结' : '连载中' }}
      </div>
    </dx-cover>
    <div class="text-sm" :class="[props.lines ? 'line-clamp-2' : 'truncate']">
      {{ props.item.title }}
    </div>
  </nuxt-link>
</template>
