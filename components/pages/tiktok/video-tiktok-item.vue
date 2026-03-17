<script setup lang="ts">
import type { VideoItem } from '@types'

const props = withDefaults(
  defineProps<{
    item: VideoItem
    showTitle?: boolean
    api?: string
    list?: VideoItem[]
    index?: number
    params?: any
    fieldPath?: string
  }>(),
  {}
)
</script>

<template>
  <stack-link
    :field-path="props.fieldPath"
    :api="props.api"
    :params="props.params"
    :data="props.item"
    :list="props.list"
    :index="props.index"
    :mv-type="4"
  >
    <dx-cover class="aspect-h-5 aspect-w-4 overflow-hidden rounded-sm" :poster="props.item.cover_thumb_url">
      <div class="linear-bg absolute bottom-0 left-0 right-0 flex items-center p-0.5 text-white">
        <nuxt-icon name="video/play" class="mr-[2px] !text-normal"></nuxt-icon>
        {{ $Utils.formatNumber(item?.rating) }}
        <div class="img-bottom-item ml-auto truncate">
          {{ props.item?.duration_str || '0:00' }}
        </div>
      </div>

      <dx-pay-type :coins="item.coins" class="absolute left-0.5 top-0.5" />
    </dx-cover>
    <h3 v-if="showTitle" class="mt-0.5 truncate text-default">
      {{ item.title }}
    </h3>
  </stack-link>
</template>

<style scoped></style>
