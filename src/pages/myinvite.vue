<template>
  <div class="container">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading">
        <div class="user-info text-xl text-white">
          <div class="pt-3.5 text-center">最新男男资源，尽在小蓝视频</div>
          <div class="absolute right-2 top-11 w-[160px] text-center">
            <div class="user-make-money-top-box">
              <div class="mb-1">
                累计邀请
                <span class="text-[#F2FF00]">{{ data?.total_invited_num || 0 }}</span>
                人
              </div>
              <div class="size-[160px] overflow-hidden rounded-[16px] border border-solid border-[#64DDFF]">
                <vue-qrcode :value="user.share_url" :options="{ margin: 2.5 }" full></vue-qrcode>
              </div>
              <div class="my-1">
                我的邀请码：
                <span class="text-[#F2FF00]">{{ user.aff_code }}</span>
              </div>
              <div class="text-sm">
                <p>永久官网地址：</p>
                <p>{{ config.pwa_download_url }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between px-1">
          <dx-button class="btn-item" @click="onCopy">复制链接</dx-button>
          <dx-button class="btn-item" color="#FF7B00" @click="onSave">保存图片</dx-button>
        </div>

        <div class="mb-2 mt-2.5 text-center">
          <h1 class="text-2xl font-medium">邀请步骤</h1>
          <p class="text-tiny text-base3">VIP会员时特惠，畅看全场</p>
        </div>

        <div class="shadow-item mx-1 mb-1 p-2">
          <p class="text-xl text-[#3DA7FD]">第一步</p>
          <p class="text-normal text-[#151515]">点击【保存图片】或【复制链接】</p>
        </div>
        <div class="shadow-item mx-1 mb-1 p-2">
          <p class="text-xl text-[#3DA7FD]">第二步</p>
          <p class="text-normal text-[#151515]">将图片或者链接通过各种渠道发行去</p>
          <div class="my-1.5 grid grid-cols-6 gap-2">
            <nuxt-icon name="share/wechat" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/note" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/qq" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/momo" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/soul" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/tieba" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/zhihu" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/weibo" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/tieba" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/tiktok" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/douban" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/unknow" filled class="text-[38px]"></nuxt-icon>
          </div>
          <p class="text-normal text-[#151515]">等常见社交软件</p>
          <div class="mt-1.5 grid grid-cols-6 gap-2">
            <nuxt-icon name="share/wechat" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/note" filled class="text-[38px]"></nuxt-icon>
            <nuxt-icon name="share/qq" filled class="text-[38px]"></nuxt-icon>
          </div>
        </div>
        <div class="shadow-item mx-1 mb-1 p-2">
          <p class="text-xl text-[#3DA7FD]">第三步</p>
          <p class="text-normal text-[#151515]">被邀请人下载进入APP，即可自动绑定，邀请可兑换VIP会员金币观影</p>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const __ = useNuxtApp()
const { data, loading } = useMyFetch<any>({
  api: __.$Api.User.myInvite,
  immediate: true
})

const userStore = useUserStore()
const { u: user } = storeToRefs(userStore)

const { config } = storeToRefs(useGlobalStore())
const { copy } = useClipboard({ source: '', legacy: true })

const app = useNuxtApp()

const onCopy = () => {
  copy(user.value.share_text)
  app.$Toast('复制成功，快去分享吧')
}
const onSave = () => {
  app.$Toast('请自行在本页面截图保存')
}
</script>

<style lang="postcss" scoped>
.user-info {
  width: 350px;
  height: 390px;
  margin: auto;
  background-image: url(@/assets/image/my/share/share-bg.png);
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
}

.btn-item {
  width: 155px !important;
}

.shadow-item {
  box-shadow: 0px 4px 16px 0px #e2ebff80;
  border-radius: 10px;
  background-color: white;
}
</style>
