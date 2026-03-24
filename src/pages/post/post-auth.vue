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
                v-for="item in auth_contact"
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
            <div class="text-sm" v-html="auth_tips"></div>
          </div>
          <van-button v-if="auth_status === 1" block color="#1c1c1c">审核中</van-button>

          <van-button
            v-else
            block
            :disabled="!can_apply"
            :loading="apply_loading"
            class="!text-[#9e4800]"
            color="linear-gradient(to right, rgb(244,181,98), rgb(244, 199, 68))"
            @click="onApply"
          >
            {{ can_apply ? '提交审核' : auth_status_text || '暂不可申请' }}
          </van-button>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const {
  data: auth_conf,
  loading: conf_loading
} = useMyFetch<any>({
  api: __.$Api.Creator.verifyConf,
  immediate: true
})

const {
  data: apply_info,
  loading: info_loading,
  execute: get_apply_info
} = useMyFetch<any>({
  api: __.$Api.Creator.applyInfo,
  immediate: true
})

const { loading: apply_loading, execute: apply_execute } = useMyFetch<any>({
  api: __.$Api.Creator.apply
})

const loading = computed(() => conf_loading.value || info_loading.value)

const auth_info = computed(() => {
  return apply_info.value?.original_auth || apply_info.value || {}
})

const auth_contact = computed(() => {
  return auth_conf.value?.contact || []
})

const auth_tips = computed(() => {
  const text = auth_conf.value?.tips || auth_info.value?.status_text || ''
  return text.replaceAll('\n', '<br/>')
})

const auth_status = computed(() => {
  return Number(auth_info.value?.status || 0)
})

const auth_status_text = computed(() => {
  return auth_info.value?.status_text || ''
})

const can_apply = computed(() => {
  if (auth_status.value === 1) {
    return false
  }
  return Number(auth_info.value?.can_apply ?? 1) === 1
})

const onApply = async () => {
  if (!can_apply.value) {
    return
  }
  await apply_execute()
  get_apply_info()
}
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
