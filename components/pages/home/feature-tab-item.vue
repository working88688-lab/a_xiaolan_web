<script setup lang="ts">
import type { AdItem, TabItem } from '@types'
import { SwiperSlide } from 'swiper/vue'
import { ROUTE_PARAMS } from '@utils/constants/route'
import qiandaoIcon from '~/assets/image/qiandao.png'
import tongquanIcon from '~/assets/image/tongquan.png'

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
const DARKWEB_TAB_NAME = '__darkweb__'

const tabsWithDarkweb = computed(() => {
  const tabs = mv_nag_tab ?? []
  if (!tabs.length) return tabs

  const hasDarkweb = tabs.some((tab: any) => tab.name === DARKWEB_TAB_NAME || tab.title === '暗网')
  if (hasDarkweb) return tabs

  const index = tabs.findIndex((tab: any) => tab.title === '独家')
  if (index === -1) return tabs

  const insertTabs = [...tabs]
  insertTabs.splice(index + 1, 0, {
    name: DARKWEB_TAB_NAME,
    title: '暗网'
  })

  return insertTabs
})

const sort = ref(mv_nag_tab?.[0].name)

const banners = ref<AdItem[]>([])

const mid_style_category = ref<any[]>([])
const mid_style_recommend = ref<any[]>([])
const mid_style_recommend_with_static = computed(() => {
  const list = mid_style_recommend.value ?? []
  const hasQiandao = list.some(i => i?.type === 14)
  const hasTongquan = list.some(i => i?.type === 10)

  const staticItems = [
    ...(hasQiandao
      ? []
      : [
        {
          id: -14,
          type: 14,
          icon_new: qiandaoIcon
        }
      ]),
    ...(hasTongquan
      ? []
      : [
        {
          id: -10,
          type: 10,
          icon_new: tongquanIcon
        }
      ])
  ]

  return [...staticItems, ...list]
})

const is_recommend = props.tab.name === '推荐'
// 关注 Tab：根据接口地址判断，更稳
const is_follow_tab = computed(() => props.tab.api === '/api/mv/listOfFollow')

const followRecommendList = ref<any[]>([])
const loadingFollowRecommend = ref(false)
console.log(props.tab.api,"props.tab.api")
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
      console.log(result.value.data.mid_style_recommend)
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

const hasFollowRecommend = computed(() => followRecommendList.value.length > 0)

// 关注 Tab 推荐用户接口（未关注任何人时展示，按视频总播放量排序，最多50个）
const fetchFollowRecommend = async () => {
  if (!is_follow_tab.value || loadingFollowRecommend.value || hasFollowRecommend.value) return

  loadingFollowRecommend.value = true
  try {
    const res = await __.$Api.Home.recommendUsers({ page: 1, limit: 50 })
    console.log(res,"res")
    followRecommendList.value = (res?.data || []).slice(0, 50)
  } catch (error) {
    console.error('获取推荐用户失败:', error)
  } finally {
    loadingFollowRecommend.value = false
  }
}

onBeforeMount(() => {
  // 关注 tab 提前拉推荐列表（后端好之前用 mock）
  if (is_follow_tab.value) {
    fetchFollowRecommend()
  }
})
const containerRef = useTemplateRef('scroll')
const { scrollTop } = useScrollTop(containerRef)

const refreshItemApi = __.$Api.createApi({
  url: '/api/tabnew/list_hyh_mv'
})

watch(sort, (value, oldValue) => {
  if (value === DARKWEB_TAB_NAME) {
    __.$Replace('/darkweb')
    sort.value = oldValue ?? mv_nag_tab?.[0].name
  }
})

watch(
  () => ({
    loading: loading.value,
    length: listData.value.length
  }),
  state => {
    // 任意 Tab 在接口返回且列表为空时，尝试拉取关注推荐（目前主要用于首页“关注”Tab）
    if (!state.loading && state.length === 0 && is_follow_tab.value) {
      fetchFollowRecommend()
    }
  },
  { immediate: true }
)

async function onReplace(item: TabItem, newItems: any) {
  try {
    item.list = [...newItems]
  } catch (error) { }
}
</script>
<template>
  <!-- 关注 Tab：直接使用推荐作者卡片，不再显示原空态 -->
  <template v-if="is_follow_tab">
    <dx-spin v-if="loadingFollowRecommend && !hasFollowRecommend" size="0.6rem" class="my-2 text-center"></dx-spin>
    <follow-recommend v-else :list="followRecommendList"></follow-recommend>
  </template>

  <!-- 其他 Tab：保持原有逻辑 -->
  <template v-else>
    <scroll-list ref="scroll" v-dom-rect :is-end="is_recommend ? isEnd : false"
      :pullup="is_recommend ? execute : undefined" :pull-down-refresh="refresh">
      <dx-spin v-show="loading && !isReady" size="0.6rem" class="my-2 text-center"></dx-spin>

      <dx-empty v-if="isError" description="暂无数据"></dx-empty>

      <!-- 轮播 -->
      <div v-if="banners.length" class="mb-1 px-1.5">
        <dx-ads :items="banners"></dx-ads>
      </div>

      <!-- mid_style_recommend -->
      <div v-if="mid_style_recommend_with_static.length" class="mb-1 px-1.5">
        <dx-scrollview-swiper>
          <SwiperSlide v-for="item in mid_style_recommend_with_static" :key="item.id" class="recommend-item">
            <nuxt-link class="flex-col-center h-full" :to="navigate(item.type)">
              <div class="mb-0.5 h-full w-full">
                <dx-image :src="item.icon_new"></dx-image>
              </div>
            </nuxt-link>
          </SwiperSlide>
        </dx-scrollview-swiper>
      </div>

      <!-- bot_style_one -->
      <template v-if="is_recommend">
        <div v-for="(item, index) in listData" :key="index">
          <card-renderder :item="item" :replace-api="refreshItemApi"
            @replace="newItems => onReplace(item, newItems)"></card-renderder>
        </div>
      </template>

      <van-cell v-if="mid_style_category.length" value="查看更多" style="--van-cell-background: transparent" :border="false"
        is-link :to="`/home/cate?${format_url_params({
          nag_id: props.tab.id,
          title: '发现精彩'
        })}`">
        <template #title>
          <div class="flex items-center whitespace-nowrap">
            <span class="mr-0.5 text-base7">发现精彩</span>
          </div>
        </template>
      </van-cell>
      <!-- mid_style_category -->
      <div v-if="mid_style_category.length" class="mb-1.5 px-1.5" @touchstart.stop>
        <dx-scrollview-swiper>
          <SwiperSlide v-for="item in mid_style_category" :key="item.id" class="slide-item">
            <nuxt-link :key="item.id" :to="`/tag?_type=home&${format_url_params({
              construct_id: item.id,
              title: item.title,
              has_sort: 1
            })}`" class="block h-full w-full overflow-hidden rounded text-center">
              <div class="relative mb-[8px] h-full">
                <dx-image :src="item.bg_thumb"></dx-image>
                <div class="cate-title absolute bottom-0 left-0 right-0 truncate text-center text-base">
                  {{ item.title }}
                </div>
              </div>
            </nuxt-link>
          </SwiperSlide>
        </dx-scrollview-swiper>
      </div>

      <!-- bot_style_two -->
      <template v-if="mid_style_category.length">
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

.slide-item {
  width: 100px !important;
  height: 100px;
  margin-right: 6px;

  &:last-child {
    margin-right: 0;
  }

  .cate-title {
    backdrop-filter: blur(8px);
    color: white;
    padding: 2px 0;
  }
}

.recommend-item {
  width: 90px;
  height: 48px;
  margin-right: 10px;

  :deep(.dx-image) {
    height: 100%;
  }
}
</style>
