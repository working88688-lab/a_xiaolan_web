<script setup lang="ts">
import type { BannerItem, TabItem, Tag, VideoItem } from '@types'

import { get as _get } from 'lodash-es'

import { format_url_params } from '@utils/helper'

const props = defineProps<{
  tab: TabItem
  isFirst?: boolean
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
const DARKWEB_TAB_NAME = '__darkweb__'

const is_follow_tab = computed(() => props.isFirst === true)

const tabsWithDarkweb = computed(() => {
  const tabs = mv_nag_tab ?? [] 
  if (!tabs.length) return tabs

  const hasDarkweb = tabs.some(tab => tab.name === DARKWEB_TAB_NAME || tab.title === '暗网')
  if (hasDarkweb) return tabs

  const index = tabs.findIndex(tab => tab.title === '独家')
  if (index === -1) return tabs

  const insertTabs = [...tabs]
  insertTabs.splice(index + 1, 0, {
    name: DARKWEB_TAB_NAME,
    title: '暗网'
  })

  return insertTabs
})

const sort = ref(mv_nag_tab?.[0].name)

const followRecommendList = ref<any[]>([])
const loadingFollowRecommend = ref(false)
const hasFollowRecommend = computed(() => followRecommendList.value.length > 0)

// MOCK：关注推荐作者
const USE_MOCK_FOLLOW_RECOMMEND = true

const mockFollowRecommendList = [
  {
    uid: 10001,
    avatar: 'https://dummyimage.com/200x200/3b82f6/ffffff&text=U1',
    nickname: '推荐用户一',
    video_num: 587,
    fans_num: 587,
    total_play_num: 123400,
    like_num: 587,
    is_attention: 0,
    videos: [
      {
        id: 1,
        cover: 'https://dummyimage.com/320x180/1f2937/ffffff&text=Video1',
        play_num: 123400,
        duration: 60 * 23 + 4
      },
      {
        id: 2,
        cover: 'https://dummyimage.com/320x180/111827/ffffff&text=Video2',
        play_num: 82340,
        duration: 60 * 12 + 18
      }
    ]
  },
  {
    uid: 10002,
    avatar: 'https://dummyimage.com/200x200/6366f1/ffffff&text=U2',
    nickname: '推荐用户二',
    video_num: 321,
    fans_num: 9987,
    total_play_num: 456700,
    like_num: 8099,
    is_attention: 0,
    videos: [
      {
        id: 3,
        cover: 'https://dummyimage.com/320x180/0f766e/ffffff&text=Video3',
        play_num: 220000,
        duration: 60 * 15 + 9
      }
    ]
  }
]

const followRecommendApi = __.$Api.createApi({
  url: '/api/home/follow_recommend'
})

const fetchFollowRecommend = async () => {
  if (!is_follow_tab.value || loadingFollowRecommend.value || hasFollowRecommend.value) return

  loadingFollowRecommend.value = true
  try {
    if (USE_MOCK_FOLLOW_RECOMMEND) {
      followRecommendList.value = mockFollowRecommendList
    } else {
      const { data } = await followRecommendApi({})
      followRecommendList.value = (data || []).slice(0, 50)
    }
  } catch (error) {
  } finally {
    loadingFollowRecommend.value = false
  }
}

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

onBeforeMount(() => {
  if (is_follow_tab.value) {
    fetchFollowRecommend()
  }
})

watch(
  sort,
  (value, oldValue) => {
    if (value === DARKWEB_TAB_NAME) {
      __.$Replace('/darkweb')
      sort.value = oldValue ?? mv_nag_tab?.[0].name
    }
  }
)
</script>
<template>
  <scroll-list ref="scroll" v-dom-rect :pull-down-refresh="refresh">
    <dx-spin v-show="loading && !isReady" size="0.6rem" class="my-2 text-center"></dx-spin>

    <!-- 关注 Tab 且列表为空：直接展示推荐作者 -->
    <template v-if="is_follow_tab && !loading && isEmpty">
      <dx-spin v-if="loadingFollowRecommend && !hasFollowRecommend" size="0.6rem" class="my-2 text-center"></dx-spin>
      <follow-recommend v-else :list="followRecommendList"></follow-recommend>
    </template>

    <!-- 其它情况保留原有发现页结构 -->
    <template v-else>
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
        <van-tab v-for="item in tabsWithDarkweb" :key="item.name ?? item.title" v-bind="item"></van-tab>
      </dx-tabs>
      <div class="scroll-container list-container">
        <scroll-list :loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute"
          :disabled-refresh="scrollTop > 0">
          <div class="grid grid-cols-2 gap-1 px-1 pb-1.5">
            <video-card v-for="(item, lIndex) in listData" :key="item.id" :list="listData" :index="lIndex"
              :item="item" lines></video-card>
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
</style>
