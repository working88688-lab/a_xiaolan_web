<script setup lang="ts">
import type { VideoItem } from '@types'

const props = withDefaults(
  defineProps<{
    item: VideoItem
    showTop?: boolean
    isLink?: boolean
    type?: 0 | 1
  }>(),
  {
    item: () => ({}) as unknown as VideoItem,
    showTop: true,
    isLink: true,
    type: 1
  }
)
</script>

<template>
  <nuxt-link :to="props.isLink ? `/player?id=${props.item.id}` : undefined" class="flex">
    <div class="mr-1 w-[180px]">
      <dx-cover class="aspect-h-9 aspect-w-16 rounded-sm" :poster="item.cover_thumb_url">
        <div class="linear-bg absolute bottom-0 flex w-full p-0.5">
          <span class="ml-auto text-sm text-white">
            {{ item.duration_str }}
          </span>
        </div>
        <dx-pay-type :coins="item.coins" class="absolute right-0.5 top-0.5" />
        <!-- <div v-if="item.is_top && showTop" class="video_top">
          <img src="~/assets/image/icon_video_top.png">
        </div> -->
      </dx-cover>
    </div>
    <div class="flex flex-1 flex-col justify-around text-base">
      <div class="video-title line-clamp-2 text-base">
        {{ item.title }}
      </div>
      <slot name="author">
        <div class="mr-0.5 flex items-center">
          <dx-image round class="my-0.5 mr-0.5 !size-4" :src="item.user?.avatar_url" />
          {{ item.user?.nickname }}
        </div>
      </slot>
      <div class="flex items-center text-sm text-base2">
        <div>{{ $Utils.formatNumber(item.rating) }}次播放</div>
      </div>
    </div>
  </nuxt-link>
</template>

<style lang="postcss" scoped></style>
