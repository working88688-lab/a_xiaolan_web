<template>
  <van-field class="dx-form-input" name="uploader" label-align="top">
    <template v-if="showLabel" #label>
      <span>上传视频</span>
      <span class="label-tips">最大可上传100MB</span>
    </template>
    <template v-if="loading" #input>
      <div key="1" class="my-uploader black">
        <div class="upload-status">
          <span>上传中... {{ progressValue + '%' }}</span>
        </div>
      </div>
    </template>
    <template v-else-if="!loading && videos.length" #input>
      <div key="2" class="my-uploader black">
        <video class="my-video" muted autoplay :controls="false" playsInline :src="videoFileUrl" />
        <div class="close" @click.capture="onDeleteVideo">
          <img class="icon-close" src="~/assets/image/comics/close.png" />
        </div>
      </div>
    </template>
    <template v-else #input>
      <van-uploader
        key="3"
        v-model="videos"
        :before-read="onBeforeVideoUpload"
        :max-count="1"
        :multiple="false"
        accept="video/*"
        :after-read="onVideoUpload"
      >
        <div class="my-uploader">+上传视频</div>
      </van-uploader>
    </template>
  </van-field>
</template>

<script setup lang="ts">
import type { UploaderFileListItem } from 'vant'

const props = withDefaults(
  defineProps<{
    showLabel?: boolean
  }>(),
  {
    showLabel: true
  }
)

const __ = useNuxtApp()

const upload_url = defineModel<string>('url')
const videoFileUrl = ref()
const videos = defineModel<UploaderFileListItem[]>({
  default: []
})
const { value: loading, open: showLoading, close: hideLoading } = useBoolean()

const progressValue = ref('0.00')

const onDeleteVideo = () => {
  videos.value = []
  upload_url.value = ''
}

const onBeforeVideoUpload = (file: any) => {
  const VideoFileMaxSize = 1024 * 1024 * 100
  if (file.size > VideoFileMaxSize) {
    __.$Toast('文件太大')
    return false
  }
  return true
}

const onVideoUpload = async (_file: any) => {
  try {
    const file = _file.file
    const convertFile = new File([file], file.name, { type: 'video/mp4' })
    videoFileUrl.value = URL.createObjectURL(convertFile)

    upload_url.value = videoFileUrl.value
  } catch (error) {
    console.log('error: ', error)
    videos.value = []
    URL.revokeObjectURL(videoFileUrl.value)
  } finally {
    progressValue.value = '0'
  }
}
</script>

<style lang="postcss">
@import '~/assets/styles/form-item.css';
</style>
