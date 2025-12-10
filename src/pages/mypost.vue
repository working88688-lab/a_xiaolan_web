<template>
  <div :key="key" class="container">
    <dx-navbar
      class="custom-nav-bar"
      right-text="发帖"
      :border="false"
      title="我的帖子"
      left-arrow
      @click-left="__.$Back"
      @click-right="__.$NavigateTo('/post/publish-post')"
    ></dx-navbar>

    <div class="mypost-bg">
      <div class="asset-details-bg">
        <div class="asset-details-item">
          <p>{{ profit?.post_coins }}</p>
          <span>钱包余额</span>
        </div>
        <div class="asset-details-item">
          <p>{{ profit?.total_post_coins }}</p>
          <span>累计收益</span>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="scroll-container">
      <dx-tabs v-model:active="active" shrink line-height="0" line-width="0" class="dx-tabs" @rendered="onRender">
        <van-tab title="发布成功">
          <scroll-list v-model:loading="successLoading" :is-empty="successEmpty">
            <post-item v-for="_item in successData" :key="_item.id" show-original :item="_item"></post-item>
          </scroll-list>
        </van-tab>
        <van-tab title="审核中">
          <scroll-list v-model:loading="verifyLoading" :is-empty="verifyEmpty">
            <post-item
              v-for="_item in verifyData"
              :key="_item.id"
              show-original
              :is-link="false"
              :item="_item"
            ></post-item>
          </scroll-list>
        </van-tab>
        <van-tab title="未通过">
          <scroll-list v-model:loading="refuseLoading" :is-empty="refuseEmpty">
            <post-item
              v-for="_item in refuseData"
              :key="_item.id"
              show-original
              :is-link="false"
              :item="_item"
            ></post-item>
          </scroll-list>
        </van-tab>
      </dx-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostItem } from '@types'

const active = ref(0)
const __ = useNuxtApp()
const key = ref()
const { data: profit } = useMyFetch<{
  post_coins: number
  total_post_coins: number
}>({
  api: __.$Api.User.postProfit,
  params: {
    type: 'release'
  },
  immediate: true
})
const {
  listData: successData,
  loading: successLoading,
  execute: successFetch,
  isEmpty: successEmpty,
  reset: videoReset
} = useFetchList<PostItem>({
  api: __.$Api.User.myPost,
  params: {
    stat: 'release'
  },
  fields: 'post'
})
const {
  listData: verifyData,
  loading: verifyLoading,
  execute: verifyFetch,
  isEmpty: verifyEmpty,
  reset: combinesReset
} = useFetchList<PostItem>({
  api: __.$Api.User.myPost,
  params: {
    stat: 'verify'
  },
  fields: 'post'
})
const {
  listData: refuseData,
  loading: refuseLoading,
  execute: refuseFetch,
  isEmpty: refuseEmpty,
  reset: manhuasReset
} = useFetchList<PostItem>({
  api: __.$Api.User.myPost,
  params: {
    stat: 'refuse'
  },
  fields: 'post'
})

const fetchMap = {
  '0': successFetch,
  '1': verifyFetch,
  '2': refuseFetch
}
const onRender = (index: keyof typeof fetchMap) => {
  if (key.value) {
    fetchMap[index]?.()
  }
}

const back = () => {
  videoReset()
  combinesReset()
  manhuasReset()
  key.value = ''
  active.value = 0
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value) {
    key.value = Math.random()
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>

<style lang="less" scoped>
.dx-tabs:deep(.van-tabs__nav) {
  border: 1px solid #548aef;
  display: flex;
  padding: 0;
  border-radius: 50px;
}
.dx-tabs:deep(.van-tabs__wrap) {
  height: 34px;
  display: flex;
  overflow: visible;
  justify-content: center;
  margin-bottom: 12px;
}
.dx-tabs:deep(.van-tab--active) {
  background: #548aef;
  color: #fff;
}
:deep(.van-tab) {
  color: #666;
  font-size: 12px;
  width: 90px;
}
.line {
  width: 100%;
  height: 8px;
  background-color: #f6f7f8;
  margin: 20px 0;
}
.mypost-bg {
  padding: 0 15px;

  .asset-details-bg {
    width: 100%;
    height: 125px;
    background-image: url('~/assets/image/my/asset-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .asset-details-item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      p {
        font-size: 34px;
        font-weight: 500;
        color: #fff;
      }

      span {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
      }

      // .btn-img {
      //   margin-top: 16px;
      //   width: 110px;
      //   height: 30px;
      //   background-image: url('~/assets/image/my/btn-bg.png');
      //   background-size: 100% 100%;
      //   background-repeat: no-repeat;
      //   text-align: center;
      //   line-height: 30px;
      //   color: #9e6d1f;
      //   font-size: 13px;
      // }
    }
  }
}
</style>
