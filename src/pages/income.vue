<template>
  <div class="myIncome container">
    <dx-navbar
      class="custom-nav-bar"
      right-text="提现记录"
      :border="false"
      title="我的收益"
      left-arrow
      @click-left="__.$Back"
      @click-right="__.$NavigateTo('/withdraw-record')"
    ></dx-navbar>

    <dx-tabs
      v-if="key"
      v-model:active="active"
      class="dx-tabs"
      line-width="20px"
      line-height="4px"
      swipeable
      lazy-render
      color="#d2a152"
      title-active-color="#d2a152"
      shrink
      @rendered="onRender"
    >
      <van-tab title="视频收益">
        <div class="px-1">
          <income-item
            is-video
            :card-data="videoData"
            :hot-api="__.$Api.User.hottestProfit"
            :new-api="__.$Api.User.newestProfit"
            @success="videoFetch"
          ></income-item>
        </div>
      </van-tab>
      <van-tab title="贴文收益">
        <div class="px-1">
          <income-item
            :type="5"
            :hot-api="__.$Api.User.incomeList"
            :new-api="__.$Api.User.incomeList"
            :card-data="profitData"
            @success="profitFetch"
          ></income-item>
        </div>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<script setup lang="ts">
import type { IncomeItem } from '@types'

const active = ref(0)
const __ = useNuxtApp()

const { data: videoData, execute: videoFetch } = useMyFetch<IncomeItem>({
  api: __.$Api.User.videoProfit
})

const { data: profitData, execute: profitFetch } = useMyFetch<IncomeItem>({
  api: __.$Api.User.postProfit
})

const fetchMap = {
  '0': () => {
    videoFetch()
  },
  '1': () => {
    profitFetch()
  }
}
const onRender = (index: keyof typeof fetchMap) => {
  fetchMap[index]?.()
}

const { key } = useKeepAlive({})
</script>

<style lang="less" scoped></style>
