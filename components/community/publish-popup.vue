<template>
  <div v-bind="$attrs" @click="open">
    <slot></slot>
  </div>
  <van-popup
    v-model:show="show_popup"
    close-on-click-overlay
    position="bottom"
    teleport="body"
    close-on-popstate
    @click-overlay="onClose"
  >
    <div class="flex-col-center py-2.5">
      <div class="flex w-full justify-between px-2">
        <h6 class="mb-1.5 text-2xl font-medium text-[#1a1a1a]">发布类型</h6>
      </div>
      <div class="flex-col-center w-full px-6 text-base">
        <van-button v-if="!is_original" class="btn_item !mb-2.5" color="#e3f0ff" block @click="on_post_auth">
          <span class="text-[#158bfe]">{{ is_original ? '发布原创' : '申请原创认证' }}</span>
        </van-button>
        <div class="grid w-full grid-cols-2 justify-center gap-1">
          <div v-link="`/post/publish-post`" class="flex-col-center cursor-pointer" @click="close">
            <div class="mb-0.5 h-[36px] w-[36px]">
              <img src="~/assets/image/community/post.png" alt="" />
            </div>
            <span>帖子</span>
          </div>
          <div v-link="`/post/publish-post?type=film`" class="flex-col-center cursor-pointer" @click="close">
            <div class="mb-0.5 h-[36px] w-[36px]">
              <img src="~/assets/image/community/qiupian.png" alt="" />
            </div>
            <span>求片</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import type { CollectInfo } from '@types'
defineProps<{
  videoInfo?: CollectInfo
}>()

const emit = defineEmits<{
  'update:show': [e: boolean]
  submit: []
}>()

const __ = useNuxtApp()

const { value: show_popup, open, close } = useBoolean()
const onClose = () => {
  emit('update:show', false)
}

const is_original = computed(() => {
  return __.$Store.user.u.post_auth === 1
})

const on_post_auth = () => {
  close()
  if (__.$Store.user.u.post_auth) {
    return __.$NavigateTo('/post/publish-post')
  }

  __.$NavigateTo('/post/auth')
}

useDectivted(onClose)
</script>

<style lang="postcss" scoped>
.btn_item {
  width: 260px;
}

.buy_price {
  padding: 12px 0;
  display: flex;
  align-items: center;

  span {
    color: #f28e0d;
    font-size: 25px;
    margin-left: 6px;
  }
}
</style>
