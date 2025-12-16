<!--
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-28 21:06:49
 * @Description: 视频播放
-->
<template>
  <div :key="id" class="container relative">
    <div class="video-box">
      <dx-loading v-if="loading"></dx-loading>
      <template v-else>
        <xg-player ref="player" :active="is_player_active && isPageActive" :src="play_url"
          :poster="data.detail?.cover_thumb_url" :preview-config="{
            mode: +!!data.detail?.preview_tip,
            time: !!data.detail?.preview_tip ? 10 : 0
          }" :video-info="{
            video_id: data.detail?.id,
            video_type_id: '',
            video_type_name: '',
            video_tag_key: '',
            video_title: data.detail?.title,
            video_tag_name: data.detail?.tags,
            duration: data.detail?.duration
          }" @preview-ended="onVideoEnd"></xg-player>
      </template>

      <div v-show="data.detail?.preview_tip" class="preview-tip" @click="onVideoEnd">
        仅预览10s，
        <template v-if="data.detail?.coins">{{ data?.detail.coins }}金币购买完整版</template>
        <template v-else>购买VIP观看完整版</template>
      </div>

      <nuxt-icon name="arrow-left" size="0.6rem" class="btn-back cursor-pointer text-4xl text-white"
        @click="$router.back"></nuxt-icon>
    </div>

    <div class="scroll-container relative">
      <scroll-list :loading="loading || loading_comments" :pullup="fetch_comments" :is-empty="isEmpty" :is-end="isEnd">
        <div class="dx-list">
          <div class="info-top">
            <user-item :key="data.detail?.user?.uid" :is-follow="data.detail?.user?.is_attention"
              :item="data.detail?.user"></user-item>
            <p class="info-title mb-1 line-clamp-2 font-medium">{{ data.detail?.title }}</p>
            <div class="flex flex-wrap gap-1">
              <dx-tag v-for="(item, index) in data.detail?.tags_list" :key="index"
                v-link="`/tag?&_type=discover&title=${item}&has_sort=1&tag=${item}`" :text="item" :type="1" />
            </div>
            <div class="my-1.5 flex items-center text-sm text-base2">
              <span>{{ $Utils.formatNumber(data.detail?.rating, 'en') }}播放 · {{ data.detail?.created_str }}发布</span>
              <div class="ml-auto flex items-center gap-2">
                <dx-btn-like :id="data.detail?.id" class="action-icon btn" align="row"
                  :like="data.detail?.is_like === 1" :likes="data.detail?.like" :api="__.$Api.Video.liking"
                  :use-toast="false" size="0.6rem">
                  <template #default="{ likes }">
                    {{ $Utils.formatNumber(likes, 'en') }}
                  </template>
                </dx-btn-like>
                <nuxt-link class="btn flex items-center" to="/myinvite" @click="openShare">
                  <div class="mr-0.5 h-[22px] w-[22px]">
                    <img src="~/assets/image/home/share.png" />
                  </div>
                  <span>分享</span>
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- 合集 -->
          <template v-if="data.topic_info">
            <van-cell class="heji-link" :border="false" is-link :title="data.topic_info.title" @click="showHejiLayer">
              <template #title>
                <van-tag round size="medium" class="!text-mini" type="warning">合集</van-tag>
                <span class="ml-0.5 text-base">{{ data.topic_info.title }}</span>
              </template>
            </van-cell>
            <scroll-x-view v-if="collect.list?.length">
              <div class="collect-list">
                <video-card v-for="(item, index) in collect.list" :key="index" class="inline-collect" :item="item"
                  :list="collect.list" :index="index" :show-play-count="false" lines replace></video-card>
              </div>
            </scroll-x-view>
          </template>
          <dx-ads class="mt-1.5" :items="data?.ads ?? []"></dx-ads>
          <!-- 推荐列表 -->
          <div v-if="res_recommend.recommend?.length" class="info-recommend">
            <p class="info-recommend-title">为你推荐</p>
            <div class="grid grid-cols-2 gap-1">
              <video-card v-for="(item, index) in res_recommend.recommend" :key="index" :list="res_recommend.recommend"
                :index="index" lines replace show-type :item="item" />
            </div>
          </div>
          <!-- 评论 -->
          <h2 class="mb-1.5 mt-2 text-xl">全部评论（{{ data.detail?.comment || 0 }}）</h2>
          <video-comment-item v-for="item in comments" :key="item.id" :item="item" :api="__.$Api.Video.likingComments"
            @reply="onReply"></video-comment-item>
        </div>
      </scroll-list>
    </div>

    <!-- 底部评论 -->
    <video-comment :id="id" ref="submitRef" @comment="refresh_comments"></video-comment>

    <!-- 非vip 观看分享提示 -->
    <dx-share-popup v-model:show="shareLayer" title=""></dx-share-popup>
    <!-- 分享弹框 -->
    <share-dialog v-model:show="shareDialogVisiable" :data="data.detail"></share-dialog>
    <!-- 金币提示弹框 -->
    <buy-popup v-model:show="buyLayer" :video-info="data.detail" @submit="onPay"></buy-popup>
    <!-- 合集 -->
    <video-collect-popup v-model:show="hejiLayer" :list="collect.list"
      :title="data.topic_info?.title"></video-collect-popup>
    <van-overlay z-index="10" :show="paying">
      <dx-loading></dx-loading>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
import type { CollectDetail, CommentItem, VideoData, VideoItem } from '@types'

const __ = useNuxtApp()
const route = useRoute()
const id = ref(route.query.id as unknown as string)
const paying = ref(false)
let active = true

const playerRef = useTemplateRef('player')
const { to_recharge } = useReachage()
const { value: shareDialogVisiable, open: showShareDialog } = useBoolean()
const { value: buyLayer, open: showBuyLayer } = useBoolean()
const { value: shareLayer, open: showShare } = useBoolean()
const { value: hejiLayer, open: showHejiLayer } = useBoolean()
const {
  data,
  loading,
  execute: fetchVideo,
  result
} = useMyFetch<VideoData>({
  api: __.$Api.Video.detail,
  success() {
    if (data.value.topic_info?.id) {
      get_collects({
        topic_id: data.value.topic_info.id
      })
      useDb('collect', toRaw(data.value.detail))
    } else {
      useDb('video', toRaw(data.value.detail))
    }
  }
})

function openShare() {
  // showShareDialog()

  __.$Tracker.trackVideoEvent({
    event: 'video_event',
    video_id: data.value.detail?.id,
    video_title: data.value.detail?.title,
    video_tag_name: data.value.detail?.tags,
    video_behavior_key: 'video_share',
    video_behavior_name: '分享',
    ...(playerRef.value?.getReportInfo() ?? {})
  })
}

const { data: collect, execute: get_collects } = useMyFetch<CollectDetail>({
  api: __.$Api.collect.mvlist
})

const { execute: report_record } = useMyFetch<any>({
  api: __.$Api.Video.watching
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
  api: __.$Api.Video.comments,
  startRefreshEmptyData: true
})

const { data: res_recommend, execute: get_recommend } = useMyFetch<{
  recommend: VideoItem[]
}>({
  api: __.$Api.Video.detail_recommend
})

const play_url = computed(() => {
  return (result.value?.isVV && data.value?.detail?.coins === 0) || data.value?.detail?.is_pay === 1
    ? data.value?.detail?.play_url
    : data.value?.detail?.preview_video
})

const is_player_active = computed(() => {
  return !!id.value
})

const onVideoEnd = () => {
  if (active && data.value?.detail?.preview_tip && !buyLayer.value && !shareLayer.value && !paying.value) {
    if (data.value?.detail.coins === 0) {
      showShare()
    } else {
      showBuyLayer()
    }
  }
}

const fetch_comments = () => {
  return get_comments({
    id: id.value
  })
}
const _refresh_comments = () => {
  return refresh({
    id: id.value
  })
}
const refresh_comments = () => {
  data.value.detail.comment += 1

  return refresh({
    id: id.value
  })
}

const onPay = async () => {
  try {
    paying.value = true
    const res = await __.$Api.Video.buy({ id: id.value })

    if (res.status === 1) {
      const { data: _data, ...rest } = res
      data.value.detail = {
        ..._data
      }
      // @ts-ignore
      result.value = {
        ...rest
      }
      return __.$Toast('购买成功')
    }
    to_recharge(res, 1008)
  } catch (error) {
  } finally {
    paying.value = false
  }
}

const init_fetch = () => {
  fetchVideo({
    id: id.value
    // tab_id: route.query.tab_id
  })
  _refresh_comments()
  get_recommend({
    id: id.value
  })
  report_record({
    id_log: id.value,
    timestamp: Date.now()
  })
}

const onBack = () => {
  id.value = ''
  reset()
  // @ts-ignore
  data.value = {}
  // @ts-ignore
  collect.value = {}
  // @ts-ignore
  res_recommend.value = {}
}

const submitRef = ref()
const onReply = (item: CommentItem) => {
  submitRef.value?.onReply(item)
}
onActivated(() => {
  active = true
  if (!id.value || (id.value && id.value !== route.query.id)) {
    onBack()
    id.value = route.query.id as string
    init_fetch()
  }
})
onDeactivated(() => {
  active = false
})
onMounted(() => {
  init_fetch()
})

useActivatiedEventListener(window, 'popstate', onBack)

onBeforeRouteUpdate(async to => {
  active = true
  await nextTick()
  id.value = to.query.id as string

  init_fetch()
})

useSyncCacheData(cacheData => {
  if (cacheData.type === 'follow') {
    if (data.value.detail.user.uid === cacheData.data.uuid) {
      data.value.detail.user.is_attention = cacheData.data.is_attention
    }
  }
})

const { isPageActive } = usePageActive()
</script>

<style lang="postcss" scoped>
@import '@styles/player.css';

.container {
  --van-tab-font-size: 15px;
}
</style>
