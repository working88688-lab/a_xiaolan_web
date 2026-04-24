<template>
  <div class="container">
    <dx-navbar
      class="my-nav-bar !text-white"
      :border="false"
      title="原创博主认证"
      left-arrow
      @click-left="__.$Back"
    ></dx-navbar>
    <div class="scroll-container">
      <scroll-list :loading="loading">
        <div>
          <img class="img-auth" src="~/assets/image/community/post-auth.png" alt="" />
        </div>
        <div class="auth-bg px-5 pb-2">
          <div class="text-center">
            <h2 class="text-2xl font-black">添加官方管理人员</h2>
            <p class="my-2">请通过以下方式添加官方审核帐号：</p>
            <div class="flex-center flex flex-wrap gap-1">
              <nuxt-link
                v-for="item in data.contact"
                :key="item.value"
                :href="item.value"
                target="__blank"
                class="flex-col-center"
                external
              >
                <div class="h-[50px] w-[50px]">
                  <img src="~/assets/image/tg.png" alt="" />
                </div>
                <span class="mt-0.5">{{ item.name }}</span>
              </nuxt-link>
            </div>
          </div>
          <div class="my-2">
            <h6 class="mb-0.5 font-semibold">入驻说明</h6>
            <div class="text-sm" v-html="DOMPurify.sanitize(data.tips?.replaceAll('\n', '<br/>') ?? '')"></div>
          </div>
          <van-button v-if="data.status === 1" block color="#1c1c1c">审核中</van-button>

          <van-button
            v-else
            block
            :loading="apply_loading"
            class="!text-[#9e4800]"
            color="linear-gradient(to right, rgb(244,181,98), rgb(244, 199, 68))"
            @click="execute"
          >
            提交审核
          </van-button>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
const __ = useNuxtApp()

const {
  data,
  loading,
  execute: get_auth_info
} = useMyFetch<any>({
  api: __.$Api.Community.auth_info,
  immediate: true
})

const { loading: apply_loading, execute } = useMyFetch<any>({
  api: __.$Api.Community.auth_apply,
  params: {
    type: 0
  }
})
</script>

<style lang="postcss" scoped>
.container {
  --van-nav-bar-background: #0b0b21;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}

.img-auth {
  max-width: 100%;
  height: auto;
}

.auth-bg {
  background-image: url(~/assets/image/community/auth_bg.jpg);
}
</style>
