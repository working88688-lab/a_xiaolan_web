<script setup lang="ts">
import type { BannerItem, TabItem, Tag } from '@types'

import { get as _get } from 'lodash-es'

import { format_url_params } from '@utils/helper'

const props = defineProps<{
  tab: TabItem
}>()

const __ = useNuxtApp()

const rank_list = ref<any[]>([])
const banners = ref<BannerItem[]>([])
const icons = ref<any[]>([])
const body = ref<any>({
  name: '',
  icon: '',
  item: []
})

const { listData, loading, refresh, result, execute, isEnd } = useFetchList<Tag>({
  api: __.$Api.dynamic({ url: props.tab.api, method: 'post' }),
  params: {
    size: 20,
    ...(props.tab?.params ?? {})
  },
  fields: 'body.item',
  success() {
    if (!banners.value.length) {
      banners.value = result.value.data?.banner ?? []
    }
    if (!rank_list.value.length) {
      rank_list.value = result.value.data?.rank ?? []
    }

    if (!icons.value.length) {
      icons.value = result.value.data?.icon ?? []
    }

    if (!body.value.name) {
      body.value = {
        ..._get(result.value.data, 'body', {})
      }
    }
  },
  immediate: true,
  startRefreshEmptyData: true
})
</script>
<template>
  <scroll-list v-dom-rect :loading="loading" :is-end="isEnd" :pull-down-refresh="refresh" :pullup="execute">
    <!-- 轮播 -->
    <div class="px-1.5">
      <dx-ads :items="banners" :ad-key="tab.id" :ad-name="tab.name"></dx-ads>
    </div>
    <ranking-list class="my-1" page="home/rank" use-index :data="rank_list"></ranking-list>
    <!-- 明星创作者 -->
    <div class="my-1 grid grid-cols-2 gap-1 px-1">
      <nuxt-link v-for="(item, index) in icons" :key="index"
        :to="`/tag?_type=find&title=${item.name}&api=${item.api}&has_sort=${item.has_sort}&${format_url_params(item.params)}`"
        class="flex-col-center">
        <div class="h-[50px] w-[170px]">
          <dx-image no-bg :src="item.icon"></dx-image>
        </div>
      </nuxt-link>
    </div>
    <!-- 发现精彩 -->
    <div class="mt-1.5 px-1.5">
      <div class="sticky -top-[1px] z-10 -mr-1 flex items-center bg-white">
        <div v-if="body.icon" class="mr-1 h-[26px] w-[26px]">
          <dx-image :src="body.icon"></dx-image>
        </div>
        <h2 class="mb-0.5 text-xl">{{ body.name }}</h2>
      </div>
      <div class="relative z-[2] grid grid-cols-3 gap-1">
        <nuxt-link v-for="(item, index) in listData" :key="index"
          :to="`/tag?_type=discover&title=${item.name}&tag=${item.name}&has_sort=1`" class="cover-item relative">
          <dx-image no-bg :src="item.img_url_full"></dx-image>
          <div class="translate-50 absolute left-1/2 top-1/2 z-10 w-full whitespace-nowrap text-center text-white">
            <div class="w-full truncate px-1 text-2xl">{{ item.name }}</div>
            <div class="text-sm">{{ $Utils.formatNumber(item.works_num) }}部</div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </scroll-list>
</template>

<style lang="postcss" scoped>
.cover-item {
  width: 110px;
  height: 110px;
  border-radius: 4px;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
