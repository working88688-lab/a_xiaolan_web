<script setup lang="ts">
import type { BannerItem, TabItem, Tag, VideoItem } from '@types'

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

const { mv_nag_tab } = useGlobalStore()
const sort = ref(mv_nag_tab?.[0].name)

const { listData, loading, refresh, result, execute, isEnd, isEmpty, isReady } = useFetchList<VideoItem>({
  api: __.$Api.dynamic({ url: props.tab.api, method: 'post' }),
  params: {
    sort,
    size: 20,
    ...(props.tab?.params ?? {})
  },
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
  startRefreshEmptyData: true,
  adConfig: {
    key: 'list_ads'
  }
})

const containerRef = useTemplateRef('scroll')
const { scrollTop } = useScrollTop(containerRef)
</script>
<template>
  <scroll-list ref="scroll" v-dom-rect :pull-down-refresh="refresh">
    <dx-spin v-show="loading && !isReady" size="0.6rem" class="my-2 text-center"></dx-spin>
    <!-- 轮播 -->
    <div class="px-1.5">
      <dx-ads :items="banners"></dx-ads>
    </div>
    <!-- <ranking-list class="my-1" page="home/rank" use-index :data="rank_list"></ranking-list> -->
    <!-- 分类 -->
    <div class="my-1 grid grid-cols-4 gap-1 px-1">
      <nuxt-link v-for="(item, index) in icons" :key="index"
        :to="`/tag?_type=find&title=${item.name}&api=${item.api}&has_sort=${item.has_sort}&${format_url_params(item.params)}`"
        class="flex-col-center">
        <div class="size-[70px]">
          <dx-image no-bg :src="item.icon"></dx-image>
        </div>
      </nuxt-link>
    </div>
    <!-- 发现精彩 -->
    <div v-show="body.name" class="mt-1.5 px-1.5">
      <div class="sticky -top-[1px] z-10 -mr-1 flex items-center bg-white">
        <!-- <div v-if="body.icon" class="mr-1 h-[26px] w-[26px]">
          <dx-image :src="body.icon"></dx-image>
        </div> -->
        <h2 class="text-xl">{{ body.name }}</h2>
        <dx-link class="ml-auto" to="/home/discover-list" style="color: var(--van-cell-value-color)">
          查看更多
          <van-icon name="arrow" />
        </dx-link>
      </div>
      <div class="relative z-[2] grid grid-cols-3 gap-1 pt-0.5">
        <discover-nav-item v-for="(item, index) in body.item" :key="index" :item></discover-nav-item>
      </div>
    </div>

    <dx-tabs v-model:active="sort" stop-propagation line-width="0px" line-height="0px" sticky
      class="my-nest-tabs text-medium first-no-padding" title-inactive-color="#333333" shrink>
      <van-tab v-for="item in mv_nag_tab" :key="item.name" v-bind="item"></van-tab>
    </dx-tabs>
    <div class="scroll-container list-container">
      <scroll-list :loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute"
        :disabled-refresh="scrollTop > 0">
        <div class="grid grid-cols-2 gap-1 px-1 pb-1.5">
          <video-card v-for="(item, lIndex) in listData" :key="item.id" :list="listData" :index="lIndex" :item="item"
            lines></video-card>
        </div>
      </scroll-list>
    </div>
  </scroll-list>
</template>

<style lang="postcss" scoped>
.list-container {
  height: calc(var(--dom-rect-height, 520px) - 44px);
}
</style>
