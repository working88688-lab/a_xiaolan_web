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
    <div class="publish-popup-panel">
      <div class="publish-popup-header">
        <h6 class="publish-popup-title">发布视频</h6>

      </div>
      <div class="publish-popup-body">
        <div class="publish-popup-grid">
          <div v-link="`/post/publish-post`" class="publish-item flex-col-center cursor-pointer" @click="close">
            <div class="publish-item-icon">
              <img src="~/assets/image/community/post.png" alt="" />
            </div>
            <span>帖子</span>
          </div>
          <div
            v-link="`/post/publish-post?type=film`"
            class="publish-item flex-col-center cursor-pointer"
            @click="close"
          >
            <div class="publish-item-icon">
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
const props = defineProps<{
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
.publish-popup-panel {
  width: 100%;
  padding: 16px 20px 20px;
  background-color: #ffffff;
  box-sizing: border-box;
}

.publish-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.publish-popup-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #151515;
}

.publish-popup-auth {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 13px;
  color: #158bfe;
}

.publish-popup-body {
  width: 100%;
}

.publish-popup-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.publish-item {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: #f5f6f7;
  box-sizing: border-box;
  font-size: 14px;
  color: #151515;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.publish-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #dddddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  margin-right: 8px;
}

.publish-item-icon img {
  width: 24px;
  height: 24px;
}
</style>
