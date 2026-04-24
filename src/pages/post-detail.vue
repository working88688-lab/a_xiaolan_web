<template>
  <div class="container">
    <dx-navbar class="my-nav-bar" :border="false" :title="detailsData.data?.title" left-arrow @click-left="__.$Back">
      <template #title>
        <div class="dx dx-flex dx-align-center">
          <dx-avatar
            v-show="detailsData.data?.user?.avatar_url"
            :size="0.6"
            :img="detailsData.data?.user?.avatar_url"
          ></dx-avatar>
          <span class="post-detail-title van-ellipsis">{{ detailsData.data?.title }}</span>
        </div>
      </template>
      <template #right>
        <btn-follow
          v-if="detailsData.data?.user?.uid"
          use-default-style
          :attention="detailsData.data?.user?.is_attention"
          :uid="detailsData.data?.user?.uid"
          symbol="+"
        ></btn-follow>
      </template>
    </dx-navbar>
    <div class="scroll-container">
      <scroll-list :loading="loading" :is-ready="!loading">
        <div class="content-layout">
          <dx-ads class="mb-1" :items="detailsData?.ads ?? []"></dx-ads>
          <p>{{ detailsData?.data?.title }}</p>
          <span>{{ detailsData?.data?.created_at }}</span>
          <div class="content-layout_txt" v-html="DOMPurify.sanitize(detailsData?.data?.content?.replaceAll?.('\n', '<br/>') ?? '')"></div>

          <div class="banner">
            <div
              v-if="detailsData?.data?.is_pay === 0"
              :style="{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backdropFilter: 'blur(5px)',
                backgroundColor: 'rgba(16, 16, 17, 0.3)',
                zIndex: 999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }"
            >
              <div v-if="detailsData?.data?.type === 2" class="pay-item" @click="toPayCoin">
                <img src="~/assets/image/community/gold_icon.png" style="margin: 0 auto" />
                <span class="text-nowrap">支付{{ detailsData?.data?.price }}金币解锁帖子全部内容</span>
              </div>

              <div v-if="detailsData?.data?.type === 1" v-link="`/renewal`" class="pay-item-vip">
                <img src="~/assets/image/community/vip_icon.png" style="margin: 0 auto" />
                <span class="text-nowrap">开通VIP解锁观看帖子全部内容</span>
              </div>
            </div>
            <div v-if="imgList.length" class="image-list">
              <template v-if="detailsData?.data?.is_pay === 0">
                <div class="image-pay">
                  <div class="main-img">
                    <dx-image :src="imgList[0].img_url"></dx-image>
                  </div>
                  <div class="flex-1">
                    <dx-image v-if="imgList[1]" :src="imgList[1].img_url"></dx-image>
                    <dx-image v-if="imgList[2]" :src="imgList[2].img_url"></dx-image>
                  </div>
                </div>
              </template>
              <template v-else>
                <dx-image v-for="(item, index) in imgList" :key="index" :src="item.img_url"></dx-image>
              </template>
            </div>
          </div>
          <div v-if="videoData">
            <p>精彩视频</p>

            <div class="video-layout">
              <xg-player
                :autoplay="false"
                :poster="videoData.cover_url_full"
                :src="videoData.media_url_full"
              ></xg-player>
              <div v-if="detailsData?.data?.is_pay === 0" class="video-bg">
                <div v-if="detailsData?.data.type === 2" class="pay-item" @click="toPayCoin">
                  <img src="~/assets/image/community/gold_icon.png" />
                  <span class="text-nowrap">支付{{ detailsData?.data?.price }}金币解锁帖子全部内容</span>
                </div>

                <div v-if="detailsData?.data.type === 1" v-link="`/renewal`" class="pay-item-vip">
                  <img src="~/assets/image/community/vip_icon.png" />
                  <span class="text-nowrap">开通VIP解锁观看帖子全部内容</span>
                </div>
              </div>
            </div>
          </div>

          <comment-action :item="detailsData.data"></comment-action>
        </div>
        <div class="line2"></div>
        <div class="all-comment-layout">
          <p class="all-comment-layout-title">全部评论（{{ detailsData?.data?.comment_num ?? 0 }}）</p>
          <div class="scroll-container">
            <scroll-list :pullup="execute" :is-empty="isEmpty" :is-end="isEnd">
              <div class="dx-list">
                <comment-item
                  v-for="(item, index) in listData"
                  :id="id"
                  :key="index"
                  :data="item"
                  @click="onClickComment(item)"
                ></comment-item>
              </div>
            </scroll-list>
          </div>
        </div>
      </scroll-list>
    </div>
    <div v-show="!loading" class="comment-area">
      <input
        v-if="select_comment?.id"
        ref="inputRef"
        v-model="content"
        type="text"
        :placeholder="`回复${select_comment?.user?.nickname}`"
        @blur="onBlur"
      />
      <input v-else ref="inputRef" v-model="content" type="text" placeholder="说点好听的...." />
      <nuxt-icon name="send" class="text-6xl text-primary" @click="createComment"></nuxt-icon>
      <div class="van-safe-area-bottom"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import type { CommentItem, PostItem } from '@types'
const __ = useNuxtApp()
const route = useRoute()

const id = route.query.id
let comment_id: number | undefined
const select_comment = ref()
const content = ref()
const inputRef = ref()

const {
  data: detailsData,
  loading,
  execute: getPostDetailData
} = useMyFetch<{
  data: PostItem
}>({
  api: __.$Api.Community.postDetail,
  params: {
    id
  },
  immediate: true,
  success() {
    useDb('post', toRaw(detailsData.value.data))
  }
})
const { listData, execute, isEmpty, isEnd, refresh } = useFetchList<CommentItem>({
  api: __.$Api.Community.postDetailComments,
  params: {
    id
  },
  immediate: true
})
const imgList = computed(() => {
  return (
    detailsData.value?.data?.medias
      ?.filter(item => item.type === 1)
      .map(item => ({
        id: item.pid,
        img_url: item.media_url_full
      })) ?? []
  )
})

const videoData = computed(() => {
  return detailsData.value?.data?.medias?.filter(item => item.type === 2)?.[0]
})

const onClickComment = (item: CommentItem) => {
  content.value = ''
  select_comment.value = {
    ...item
  }
  nextTick(() => {
    inputRef.value.focus()
  })
  comment_id = item.id
}

const createComment = async () => {
  if (!content.value) {
    return __.$Toast('请填写评论')
  }
  try {
    await __.$Api.Community.createComment({
      post_id: id,
      content: content.value,
      comment_id
    })
    refresh()
  } catch (error) {
  } finally {
    content.value = ''
  }
}

const onBlur = () => {
  setTimeout(() => {
    select_comment.value = undefined
    content.value = ''
  }, 0)
}

const { to_recharge } = useReachage()
const toPayCoin = async () => {
  try {
    const res = await __.$Api.Community.unlock_post({ id: id })
    if (res.status === 1) {
      detailsData.value.data.is_pay = 1
      return getPostDetailData()
    }

    to_recharge(res)
  } catch (error) {}
}
</script>

<style lang="postcss" scoped>
@import '@styles/post-detail.css';
</style>
