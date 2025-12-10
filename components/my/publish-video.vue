<template>
  <div v-bind="$attrs" @click="open">
    <slot></slot>
  </div>
  <van-popup
    v-model:show="show"
    close-on-click-overlay
    close-on-popstate
    position="right"
    :style="{
      width: '100%',
      height: '100%'
    }"
    :lock-scroll="false"
    @close="onClose"
  >
    <div class="container">
      <dx-navbar :border="false" title="发布视频" left-arrow @click-left="close"></dx-navbar>
      <div class="scroll-container is-scroll">
        <dx-form :model="state">
          <div class="flex">
            <dx-form-item>
              <dx-video-choose
                v-model="state.video"
                v-model:url="video_local_url"
                :show-label="false"
              ></dx-video-choose>
            </dx-form-item>
            <dx-form-item>
              <dx-video-cover :url="video_local_url" :show-label="false"></dx-video-cover>
            </dx-form-item>
          </div>
        </dx-form>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
const video_local_url = ref('')
const state = reactive({
  video: []
})

const emit = defineEmits<{
  submit: [e: string]
}>()

const { value: show, open, close } = useBoolean()

useDectivted(close)

const onClose = () => {
  video_local_url.value = ''
  state.video = []
}
</script>

<style scoped></style>
