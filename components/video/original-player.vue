<!--
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-28 21:07:45
 * @Description: 原创视频播放
-->
<script setup lang="ts">
import type { CommentItem, OriginalData } from '@types'

const __ = useNuxtApp()
const route = useRoute()
const id = ref(route.query.id as unknown as string)

const { to_recharge } = useReachage()
const { value: shareDialogVisiable, open: showShareDialog } = useBoolean()
const { value: buyLayer, open: showBuyLayer } = useBoolean()
const { value: shareLayer, open: showShare, close: closeShare } = useBoolean()
let isActive = true

const previewEnd = ref(false)
const paying = ref(false)
const selected = ref(Number(route.query.sort || 1))

const mvType = ref((route.query.type as unknown as '2' | '3') || '2')
const API_MAP = {
  detail: {
    2: 'api/original/detail',
    3: 'api/cartoon/detail'
  },
  comments: {
    2: 'api/original/comment_list',
    3: 'api/cartoon/comment_list'
  },
  buy: {
    2: 'api/original/buy',
    3: 'api/cartoon/buy'
  },
  like: {
    2: 'api/original/like',
    3: 'api/cartoon/like'
  },
  like_comment: {
    2: 'api/original/like_comment',
    3: 'api/cartoon/like_comment'
  }
}

const {
  data,
  loading,
  execute: fetchVideo,
  result
} = useMyFetch<OriginalData>({
  api: API_MAP.detail[mvType.value],
  success() {
    useDb(mvType.value === '2' ? 'original' : 'cartoon', toRaw(data.value.detail))
  }
})

const {
  listData: comments,
  execute: get_comments,
  loading: loading_comments,
  isEnd,
  isEmpty,
  refresh,
  reset
} = useFetchList<CommentItem>({
  api: API_MAP.comments[mvType.value],
  startRefreshEmptyData: true
})

const play_url = computed(() => {
  return (result.value?.isVV && data.value?.detail?.coins === 0) || data.value?.detail?.is_pay === 1
    ? data.value?.detail?.source
    : data.value?.detail?.preview_video
})

const preview_tip = computed(() => {
  if (data.value?.detail?.is_pay === 1) {
    return ''
  }

  if (data.value?.detail?.coins === 0) {
    return result.value?.isVV ? '' : '购买VIP观看完整版'
  }

  return `${data.value?.detail?.coins}金币购买完整版`
})

const is_player_active = computed(() => {
  return !!id.value
})

const submitRef = ref()
function onReply(item: CommentItem) {
  submitRef.value?.onReply(item)
}

const onVideoEnd = () => {
  if (isActive && preview_tip.value && !buyLayer.value && !shareLayer.value && !paying.value) {
    if (data.value?.detail.coins === 0) {
      showShare()
    } else {
      showBuyLayer()
    }
  }
}

function fetch_comments() {
  return get_comments({
    id: id.value
  })
}
function _refresh_comments() {
  return refresh({
    id: id.value
  })
}

function refresh_comments() {
  data.value.detail.com_count += 1
  return refresh({
    id: id.value
  })
}

async function onPay() {
  try {
    paying.value = true
    const _api = __.$Api.dynamic({
      url: API_MAP.buy[mvType.value]
    })
    const res = await _api({ id: data.value.detail.video_id })
    if (res.status === 1) {
      const { data: _data, ...rest } = res
      data.value.detail = {
        ..._data
      }
      data.value.detail.is_pay = 1
      // @ts-ignore
      result.value = {
        ...rest
      }
      previewEnd.value = false

      return __.$Toast('购买成功')
    }
    to_recharge(res, 0, '余额')
  } catch (error) {
    console.log('error: ', error)
  } finally {
    paying.value = false
  }
}

function init_fetch() {
  fetchVideo({
    id: id.value,
    selected: selected.value
  })
  _refresh_comments()
}

function onBack() {
  id.value = ''
  reset()
  // @ts-ignore
  data.value = {}
  isActive = false
  previewEnd.value = false
}

onActivated(() => {
  isActive = true
  if (id.value || (id.value && id.value !== route.query.id)) {
    onBack()
    id.value = route.query.id as unknown as string
    init_fetch()
  }
})

onMounted(() => {
  init_fetch()
})
onDeactivated(() => {
  isActive = false
})

useActivatiedEventListener(window, 'popstate', onBack)

onBeforeRouteUpdate(async to => {
  previewEnd.value = false
  await nextTick()
  id.value = to.query.id as string
  selected.value = Number(to.query.sort || 1)
  init_fetch()
})

const { isPageActive } = usePageActive()
</script>

<template>
  <div :key="id" class="container relative">
    <div class="video-box">
      <dx-loading v-if="loading" />
      <video-placeholder v-else-if="previewEnd" :coins="data.detail?.coins" @confirm="onVideoEnd" />
      <template v-else-if="data.detail">
        <xg-player :active="is_player_active && isPageActive" :src="play_url" :poster="data.detail?.cover_full"
          :preview-config="{
            mode: +!!preview_tip,
            time: !!preview_tip ? 10 : 0
          }" @preview-ended="onVideoEnd" />
      </template>
      <div v-else class="translate-50 absolute left-1/2 top-1/2 text-xl font-semibold text-white">资源不存在</div>

      <div v-show="data.detail && preview_tip" class="preview-tip" @click="onVideoEnd">
        仅预览10s，
        <template v-if="data.detail?.coins">{{ data?.detail.coins }}金币购买完整版</template>
        <template v-else>{{ preview_tip }}</template>
      </div>
      <nuxt-icon name="arrow-left" size="0.6rem" class="btn-back text-4xl text-white" @click="$router.back" />
    </div>

    <div class="scroll-container relative">
      <scroll-list :loading="loading || loading_comments" :pullup="fetch_comments" :is-empty="isEmpty" :is-end="isEnd">
        <div class="dx-list">
          <div class="info-top mt-1">
            <p class="info-title mb-1 line-clamp-2 font-medium">
              {{ data.detail?.title }}
            </p>
            <div class="flex flex-wrap gap-1">
              <dx-tag v-for="(item, index) in data.detail?.tags" :key="index"
                v-link="`/tag?title=${item}&tag=${item}&_type=original_tag&_sort_key=type`" :text="item" :type="1" />
            </div>
            <div class="my-1.5 flex items-center text-sm text-base2">
              <span>{{ $Utils.formatNumber(data.detail?.play_count, 'en') }}播放</span>
              <div class="ml-auto flex items-center gap-2">
                <dx-btn-like :id="data.detail?.id" :key="data.detail?.id" class="action-icon" align="row"
                  :like="data.detail?.is_like === 1" :likes="data.detail?.like_count" :api="API_MAP.like[mvType]"
                  :use-toast="false" size="0.6rem" icon="like-o" active-icon="like" active-color="#ff416a" />
                <nuxt-link class="flex items-center" to="/myinvite">
                  <div class="mr-0.5 h-[28px] w-[28px]">
                    <img src="~/assets/image-icon/share-rect.png" />
                  </div>
                  <span>分享</span>
                </nuxt-link>
              </div>
            </div>
          </div>

          <video-episodes class="mb-1" :current="selected" :items="data.detail?.videos" />

          <dx-ads class="mt-1.5" :items="data?.ads ?? []" />

          <div v-if="data.recommend?.length" class="info-recommend">
            <p class="info-recommend-title">为你推荐</p>
            <div class="grid grid-cols-2 gap-1">
              <video-card v-for="(item, index) in data.recommend" :key="index" :index="index" lines replace
                :show-type="false" :mv-type="Number(mvType || 1)" :show-duration="false"
                :item="{ cover_thumb_url: item.cover_full, ...item, rating: item.play_count }" />
            </div>
          </div>

          <h2 class="mb-1.5 mt-2 text-xl">全部评论（{{ data.detail?.com_count || 0 }}）</h2>
          <div class="grid grid-cols-1 gap-1.5">
            <video-comment-item v-for="item in comments" :key="item.id" :item="{
              ...item,
              user: {
                ...item.user,
                thumb: item.user.avatar_url
              },
              createdAt: item.created_at,
              hasLike: item.is_like === 1,
              likes: item.like_num,
              comments: item.comments.map(_comment => ({
                ..._comment,
                user: {
                  ..._comment.user,
                  thumb: _comment.user.avatar_url
                },
                createdAt: _comment.created_at,
                hasLike: _comment.is_like === 1,
                likes: _comment.like_num
              }))
            }" :id-key="mvType === '2' ? 'id' : 'comment_id'" :api="API_MAP.like_comment[mvType]" sub-key="comments"
              comment-key="content" @reply="onReply" />
          </div>
        </div>
      </scroll-list>
    </div>

    <!-- 底部评论 -->
    <video-comment :id="id" ref="submitRef" :type="Number(mvType)" @comment="refresh_comments" />
    <!-- 非vip 观看分享提示 -->
    <dx-share-popup v-model:show="shareLayer" title=""></dx-share-popup>
    <!-- 分享弹框 -->
    <share-dialog v-model:show="shareDialogVisiable"
      :data="{ cover_thumb_url: data.detail?.cover_full, ...data.detail }"></share-dialog>
    <!-- 金币提示弹框 -->
    <buy-popup v-model:show="buyLayer" :video-info="data.detail" @submit="onPay"></buy-popup>
    <van-overlay z-index="10" :show="paying">
      <dx-loading></dx-loading>
    </van-overlay>
  </div>
</template>

<style lang="postcss" scoped>
@import '@styles/player.css';

.container {
  --van-tab-font-size: 15px;
}
</style>
