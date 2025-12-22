<script setup lang="ts">
import type { AdItem, TabItem } from '@types'

import { ROUTE_PARAMS } from '@utils/constants/route'

/***
 *  bot_style_one ： 今日热点
 *  bot_style_two： 普通列表数据
 *  mid_style_category： 普通列表中间标签
 *  mid_style_recommend： 推荐中间导航
 */
const props = defineProps<{
  tab: TabItem
}>()

provide(ROUTE_PARAMS, {
  tab_id: props.tab.id
})
const __ = useNuxtApp()

const { mv_nag_tab } = useGlobalStore()
const sort = ref(mv_nag_tab?.[0].name)

const banners = ref<AdItem[]>([])

const mid_style_category = ref<any[]>([])
const mid_style_recommend = ref<any[]>([])

const is_recommend = props.tab.name === '推荐'

const { listData, execute, loading, refresh, isEmpty, isEnd, result, isError, isReady } = useFetchList<any>({
  api: __.$Api.dynamic({ url: props.tab.api, method: 'post' }),
  params: {
    sort,
    ...(props.tab?.params ?? {}),
    _config: {
      showError: false
    }
  },

  success(_result, is_refresh) {
    if (!banners.value.length && result.value.data?.banner?.length) {
      banners.value = result.value.data.banner
    }

    if (!mid_style_category.value.length && result.value.data?.mid_style_category?.length) {
      mid_style_category.value = result.value.data.mid_style_category
    }

    if (!mid_style_recommend.value.length && result.value.data?.mid_style_recommend?.length) {
      mid_style_recommend.value = result.value.data.mid_style_recommend
    }
  },
  immediate: true,
  startRefreshEmptyData: !is_recommend,
  fields: is_recommend ? 'bot_style_one' : 'bot_style_two',
  usePageSize: false,
  adConfig: !is_recommend
    ? {
      key: 'list_ads'
    }
    : undefined
})

if (props.tab.type === 1) {
  useSyncCacheData(cacheData => {
    if (cacheData.module === 'user') {
      const { data } = cacheData
      listData.value = listData.value.map(item => {
        return item.user.uid === data.uid
          ? {
            ...item,
            user: {
              ...item.user,
              ...data
            }
          }
          : item
      })
    }
    if (cacheData.module === 'like') {
      const { data: _data } = cacheData
      listData.value = listData.value.map(item => {
        return item.id === _data.id
          ? {
            ...item,
            is_like: _data.is_follow,
            like: _data.like_num
          }
          : item
      })
    }
  })
}
const containerRef = useTemplateRef('scroll')
const { scrollTop } = useScrollTop(containerRef)
</script>
<template>
  <scroll-list ref="scroll" v-dom-rect :is-end="is_recommend ? isEnd : false"
    :pullup="is_recommend ? execute : undefined" :pull-down-refresh="is_recommend ? refresh : undefined">
    <dx-spin v-show="loading && !isReady" size="0.6rem" class="my-2 text-center"></dx-spin>

    <dx-empty v-if="isError" description="暂无数据"></dx-empty>
    <!-- 轮播 -->
    <div class="px-1.5">
      <dx-ads :items="banners" :ad-key="tab.id" :ad-name="tab.name"></dx-ads>
    </div>
    <!-- mid_style_recommend -->
    <scroll-x-view v-if="mid_style_recommend.length" class="mt-2" @touchmove.stop>
      <div class="relative flex items-center px-1">
        <nuxt-link v-for="(item, index) in mid_style_recommend.filter(item => item.type !== 10)" :key="index"
          class="flex-col-center mr-[34px] last:mr-0" :to="navigate(item.type)">
          <div class="mb-0.5 size-[44px]">
            <dx-image no-bg :src="item.icon"></dx-image>
          </div>
          {{ item.title }}
        </nuxt-link>
      </div>
    </scroll-x-view>
    <!-- <div v-if="mid_style_recommend.length" class="mt-2 grid grid-cols-4 gap-1.5 px-1">
      <nuxt-link
        v-for="(item, index) in mid_style_recommend.filter(item => item.type !== 10)"
        :key="index"
        class="flex-col-center"
        :to="navigate(item.type)"
      >
        <div class="mb-0.5 h-4 w-4">
          <dx-image no-bg :src="item.icon"></dx-image>
        </div>
        {{ item.title }}
      </nuxt-link>
    </div> -->

    <!-- bot_style_one -->
    <template v-if="is_recommend">
      <div v-for="(item, index) in listData" :key="index">
        <van-cell class="!sticky left-0 top-[-1px] z-10" value="查看更多" :border="false" :to="item.type === 5
            ? navigate(
              item.type,
              `/tag?_type=home&${format_url_params({
                construct_id: item.id,
                has_sort: item.has_tab,
                title: item.title
              })}`
            )
            : `/tag?_type=home&${format_url_params({
              construct_id: item.id,
              has_sort: item.has_tab,
              title: item.title
            })}`
          " is-link>
          <template #title>
            <div class="flex items-center whitespace-nowrap">
              <dx-image v-if="item.icon" class="mr-0.5 !h-[26px] !w-[26px]" :src="item.icon"></dx-image>
              <span class="mr-0.5 text-base7">{{ item.title }}</span>
              <span class="text-mini text-base3">{{ item.sub_title }}</span>
            </div>
          </template>
        </van-cell>
        <div class="dx-grid-2 pb-0.5">
          <video-card v-for="(card, lIndex) in item.list.slice(0, item.show_max)" :key="card.id" :list="item.list"
            :index="lIndex" :item="card" lines></video-card>
        </div>
      </div>
    </template>

    <!-- mid_style_category -->
    <div v-if="mid_style_category.length" class="my-1.5 grid grid-cols-4 gap-1 px-1.5">
      <nuxt-link v-for="item in mid_style_category.slice(0, 12)" :key="item.id" :to="item.id === -1
          ? `/home/cate?${format_url_params({
            nag_id: props.tab.id,
            title: item.title
          })}`
          : `/tag?_type=home&${format_url_params({
            construct_id: item.id,
            title: item.title,
            has_sort: 1
          })}`
        " class="block text-center">
        <div class="mb-[8px] h-4">
          <dx-image :src="item.bg_thumb"></dx-image>
        </div>
        <div class="truncate text-base">{{ item.title }}</div>
      </nuxt-link>
    </div>

    <!-- bot_style_two -->
    <template v-if="mid_style_category.length">
      <dx-tabs v-model:active="sort" stop-propagation line-width="0px" line-height="0px" sticky
        class="my-nest-tabs text-medium first-no-padding" title-inactive-color="#333333" shrink>
        <van-tab v-for="item in mv_nag_tab" :key="item.name" v-bind="item"></van-tab>
      </dx-tabs>
      <div class="scroll-container list-container">
        <scroll-list :loading="loading" :is-empty="isEmpty" :pull-down-refresh="refresh" :is-end="isEnd"
          :pullup="execute" :disabled-refresh="scrollTop > 0">
          <div class="grid grid-cols-2 gap-1 px-1 pb-1.5">
            <video-card v-for="(item, lIndex) in listData" :key="item.id" :list="listData" :index="lIndex" :item="item"
              lines></video-card>
          </div>
        </scroll-list>
      </div>
    </template>
  </scroll-list>
</template>

<style lang="postcss" scoped>
.list-container {
  height: calc(var(--dom-rect-height, 520px) - 44px);
}

.my-nest-tabs {
  margin: 12px 0 0 0;
  /* height: calc(var(--dom-rect-height, 520px) - 44px); */
  --van-tabs-line-height: 40px;

  &> :deep(.van-tabs__wrap) {
    top: -1px;
    padding-bottom: 12px;
  }

  /* :deep(.van-tabs__content) {
    height: 100%;
  } */
}
</style>
