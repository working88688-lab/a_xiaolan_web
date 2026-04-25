<script setup lang="ts">
import type { AdItem, TabItem } from '@types'
import { SwiperSlide } from 'swiper/vue'
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
/** 与后端下发的暗网 tab name 一致，选中时跳转 /darkweb */
const DARKWEB_TAB_NAME = '__darkweb__'

const sort = ref(mv_nag_tab?.[0].name)

const banners = ref<AdItem[]>([])

const mid_style_category = ref<any[]>([])
const mid_style_recommend = ref<any[]>([])
const is_role_tab = props.tab.name === '角色'

function resolveMidRecommendIcon(it: any) {
  return it?.icon_new || it?.cover || it?.icon || it?.img || it?.img_url || ''
}

function classifyIconSrc(src: string) {
  if (!src) return 'EMPTY'
  if (src.startsWith('data:')) return 'DATA_URL(本地内联)'
  if (src.startsWith('blob:')) return 'BLOB_URL(本地运行时)'
  if (src.includes('/_nuxt/')) return 'NUXT_ASSET(本地构建产物)'
  if (/\.svg(\?|#|$)/i.test(src)) return 'SVG(可能本地/远程)'
  if (/^https?:\/\//i.test(src)) return 'HTTP_URL(接口返回远程)'
  if (src.startsWith('/')) return 'ABS_PATH(多半本地/同域)'
  return 'OTHER'
}

/** 推荐 + 发现精彩：下方双列应为 bot_style_two，不能与 bot_style_one 的区块列表混用 */
const bot_style_two_list = ref<any[]>([])

const is_recommend = props.tab.name === '推荐'
// 关注 Tab：根据接口地址判断，更稳
const is_follow_tab = computed(() => props.tab.api === '/api/mv/listOfFollow')
const followTabDebug = import.meta.dev && import.meta.client

function pickLikeFieldsFromFollowListItem(item: any) {
  return {
    id: item?.id ?? item?.mv_id ?? item?._id,
    title: item?.title ?? item?.name,
    user_uid: item?.user?.uid ?? item?.uid,
    // 常见点赞/喜欢字段：不同接口命名可能不同
    like_num: item?.like_num,
    likes: item?.likes,
    like: item?.like,
    is_like: item?.is_like,
    is_follow: item?.is_follow,
    is_followed: item?.is_followed,
    is_attention: item?.is_attention
  }
}

function pickLikeFieldsFromRecommendUser(user: any) {
  return {
    uid: user?.uid,
    nickname: user?.nickname,
    total_likes: user?.total_likes,
    like_num: user?.like_num,
    is_followed: user?.is_followed,
    is_attention: user?.is_attention
  }
}

const followRecommendList = ref<any[]>([])
const loadingFollowRecommend = ref(false)
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
    // 关注 Tab：打印 /api/mv/listOfFollow 原始返回（便于对照 data.list / data.recommend_users）
    if (followTabDebug && is_follow_tab.value) {
      const d = result.value?.data
      const listLike = d?.list ?? d?.data?.list ?? d?.bot_style_two ?? d?.bot_style_one
      // eslint-disable-next-line no-console
      console.log('%c[关注Tab] /api/mv/listOfFollow 原始响应', 'font-weight:bold;color:#1677ff', result.value)
      // eslint-disable-next-line no-console
      console.log('[关注Tab] data.list(或近似字段)=', listLike)
      // eslint-disable-next-line no-console
      console.log('[关注Tab] data.recommend_users=', d?.recommend_users)
    }

    // 关注 Tab：如果 list 为空，直接用接口返回的 recommend_users
    if (is_follow_tab.value) {
      const d: any = result.value?.data
      const list = Array.isArray(d?.list) ? d.list : []
      const users = Array.isArray(d?.recommend_users) ? d.recommend_users : []

      if (followTabDebug) {
        const titleStyle =
          'background:#111827;color:#fff;padding:6px 10px;border-radius:8px;font-weight:900;font-size:13px'
        const metaStyle = 'color:#60a5fa;font-weight:900'
        // eslint-disable-next-line no-console
        console.groupCollapsed(
          `%c[关注Tab] 数据分支检查%c list=${list.length} recommend_users=${users.length}（用于排查点赞字段）`,
          titleStyle,
          metaStyle
        )
        // eslint-disable-next-line no-console
        console.log('[关注Tab] list[0..10] 原始片段 =', list.slice(0, 10))
        // eslint-disable-next-line no-console
        console.table(list.slice(0, 20).map(pickLikeFieldsFromFollowListItem))
        // eslint-disable-next-line no-console
        console.log('[关注Tab] recommend_users[0..10] 原始片段 =', users.slice(0, 10))
        // eslint-disable-next-line no-console
        console.table(users.slice(0, 20).map(pickLikeFieldsFromRecommendUser))
        // eslint-disable-next-line no-console
        console.groupEnd()
      }

      if (list.length === 0 && users.length && !followRecommendList.value.length) {
        followRecommendList.value = users.slice(0, 50)
      }
    }

    if (!banners.value.length && result.value.data?.banner?.length) {
      banners.value = result.value.data.banner
    }

    if (!mid_style_category.value.length && result.value.data?.mid_style_category?.length) {
      mid_style_category.value = result.value.data.mid_style_category
    }

    if (!mid_style_recommend.value.length && result.value.data?.mid_style_recommend?.length) {
      mid_style_recommend.value = result.value.data.mid_style_recommend
    }

    const two = _result?.data?.bot_style_two
    if (is_recommend && Array.isArray(two)) {
      bot_style_two_list.value = is_refresh ? [...two] : [...bot_style_two_list.value, ...two]
    }
  },
  immediate: true,
  startRefreshEmptyData: !is_recommend,
  // 关注 Tab：接口返回在 data.list；其他 Tab 仍用原约定字段
  fields: is_follow_tab.value ? 'list' : is_recommend ? 'bot_style_one' : 'bot_style_two',
  usePageSize: false,
  adConfig: !is_recommend
    ? {
        key: 'list_ads'
      }
    : undefined
})

watch(
  mid_style_recommend,
  list => {
    if (!import.meta.client) return
    if (!is_role_tab) return
    if (!Array.isArray(list) || !list.length) return

    const view = list.map((it, idx) => {
      const src = resolveMidRecommendIcon(it)
      return {
        idx,
        id: it?.id,
        type: it?.type,
        title: it?.title,
        name: it?.name,
        icon_new: it?.icon_new,
        icon: it?.icon,
        cover: it?.cover,
        resolvedSrc: src,
        srcType: classifyIconSrc(String(src || ''))
      }
    })

    // eslint-disable-next-line no-console
    console.log(
      '%c[首页-角色Tab] 金刚区(mid_style_recommend) 原始数据/图片来源判定',
      'background:#ff4d4f;color:#fff;font-weight:700;padding:2px 6px;border-radius:4px;'
    )
    // eslint-disable-next-line no-console
    console.log('[raw]', list)
    // eslint-disable-next-line no-console
    console.table(view)

    const bad = view.filter(i => !i.resolvedSrc || i.srcType === 'EMPTY')
    if (bad.length) {
      // eslint-disable-next-line no-console
      console.warn('[首页-角色Tab] 金刚区存在空图片字段:', bad)
    }
  },
  { immediate: true }
)

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
const followRecommendFromApi = computed(() => {
  const d: any = result.value?.data
  const u = d?.recommend_users
  return Array.isArray(u) ? u : []
})

// 关注 Tab 推荐用户（未关注任何人时展示，最多50个；仅使用 /api/mv/listOfFollow 返回的 recommend_users）
const fetchFollowRecommend = async () => {
  if (!is_follow_tab.value || loadingFollowRecommend.value || hasFollowRecommend.value) return

  loadingFollowRecommend.value = true
  try {
    const users = followRecommendFromApi.value
    if (users.length) {
      followRecommendList.value = users.slice(0, 50)
    }
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
  } catch (error) {}
}

const gridVideoList = computed(() => {
  if (is_recommend && mid_style_category.value.length) {
    return bot_style_two_list.value
  }
  return listData.value
})

const gridIsEmpty = computed(() => {
  if (is_recommend && mid_style_category.value.length) {
    return !loading.value && !gridVideoList.value.length
  }
  return isEmpty.value
})
</script>
<template>
  <!-- 关注 Tab：优先展示 list（关注内容）；list 为空时展示 recommend_users -->
  <template v-if="is_follow_tab">
    <template v-if="listData.length">
      <scroll-list ref="scroll" v-dom-rect :is-end="false" :pullup="undefined" :pull-down-refresh="refresh">
        <dx-spin v-show="loading && !isReady" size="0.6rem" class="my-2 text-center"></dx-spin>
        <dx-empty v-if="isError" description="暂无数据"></dx-empty>
        <div class="px-1 pb-1.5">
          <feature-item
            v-for="(item, lIndex) in listData"
            :key="item.id ?? lIndex"
            :data="item"
            :list="listData"
            :index="lIndex"
          />
        </div>
      </scroll-list>
    </template>
    <template v-else>
      <dx-spin v-if="loadingFollowRecommend && !hasFollowRecommend" size="0.6rem" class="my-2 text-center"></dx-spin>
      <follow-recommend v-else :list="followRecommendList"></follow-recommend>
    </template>
  </template>

  <!-- 其他 Tab：保持原有逻辑 -->
  <template v-else>
    <scroll-list
      ref="scroll"
      v-dom-rect
      :is-end="is_recommend ? isEnd : false"
      :pullup="is_recommend ? execute : undefined"
      :pull-down-refresh="refresh"
    >
      <dx-spin v-show="loading && !isReady" size="0.6rem" class="my-2 text-center"></dx-spin>

      <dx-empty v-if="isError" description="暂无数据"></dx-empty>

      <!-- 轮播 -->
      <div v-if="banners.length" class="mb-1 px-1.5">
        <dx-ads :items="banners"></dx-ads>
      </div>

      <!-- mid_style_recommend -->
      <div v-if="mid_style_recommend.length" class="mb-1 px-1.5">
        <dx-scrollview-swiper>
          <SwiperSlide v-for="item in mid_style_recommend" :key="item.id" class="recommend-item">
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
          <card-renderder
            :item="item"
            :replace-api="refreshItemApi"
            @replace="newItems => onReplace(item, newItems)"
          ></card-renderder>
        </div>
      </template>

      <van-cell
        v-if="mid_style_category.length"
        value="查看更多"
        style="--van-cell-background: transparent"
        :border="false"
        is-link
        :to="`/home/cate?${format_url_params({
          nag_id: props.tab.id,
          title: '发现精彩'
        })}`"
      >
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
            <nuxt-link
              :key="item.id"
              :to="`/tag?_type=home&${format_url_params({
                construct_id: item.id,
                title: item.title,
                has_sort: 1
              })}`"
              class="block h-full w-full overflow-hidden rounded text-center"
            >
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
        <dx-tabs
          v-model:active="sort"
          stop-propagation
          line-width="0px"
          line-height="0px"
          sticky
          class="my-nest-tabs text-medium first-no-padding"
          title-inactive-color="#333333"
          shrink
        >
          <van-tab v-for="item in mv_nag_tab ?? []" :key="item.name ?? item.title" v-bind="item"></van-tab>
        </dx-tabs>
        <div class="scroll-container list-container">
          <scroll-list
            :loading="loading"
            :is-empty="gridIsEmpty"
            :is-end="isEnd"
            :pullup="execute"
            :disabled-refresh="scrollTop > 0"
          >
            <div class="grid grid-cols-2 gap-1 px-1 pb-1.5">
              <video-card
                v-for="(item, lIndex) in gridVideoList"
                :key="item.id"
                :list="gridVideoList"
                :index="lIndex"
                :item="item"
                lines
              ></video-card>
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

  & > :deep(.van-tabs__wrap) {
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
