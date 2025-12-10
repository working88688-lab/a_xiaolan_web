<template>
  <div v-if="items?.length">
    <h6>剧集列表</h6>
    <scroll-x-view v-if="items.length">
      <div class="mt-0.5 flex gap-1.5">
        <van-button
          v-for="(item, index) in items"
          :key="index"
          class="!h-[48px] !w-[48px] !text-[#242424]"
          :class="{
            'is-current': current === item.sort
          }"
          type="default"
          color="#f8f8f8"
          @click="on_play_sort(item)"
        >
          <template v-if="current === item.sort">
            <nuxt-icon class="text-3xl text-primary" name="play"></nuxt-icon>
          </template>
          <template v-else>{{ item.sort }}</template>
        </van-button>
      </div>
    </scroll-x-view>
  </div>
</template>

<script setup lang="ts">
import type { VideoEpisode } from '@types'
const props = withDefaults(
  defineProps<{
    items?: VideoEpisode[]
    current?: number
  }>(),
  {
    items: undefined,
    current: 1
  }
)

const __ = useNuxtApp()
const route = useRoute()
const on_play_sort = (_item: VideoEpisode) => {
  __.$Replace(`/original-detail?id=${route.query.id}&sort=${_item.sort}&type=2`)
}
</script>

<style lang="postcss" scoped></style>
