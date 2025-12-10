<template>
  <van-field class="dx-form-input" name="uploader" label-align="top">
    <template v-if="showLabel" #label>
      <span>上传视频</span>
      <span class="label-tips">最大可上传2024MB</span>
    </template>
    <template v-if="loading" #input>
      <div key="1" class="my-uploader black">
        <div class="upload-status">
          <span>上传中... {{ progressValue + '%' }}</span>
        </div>
      </div>
    </template>
    <template v-else-if="!loading && videoFileUrl" #input>
      <div key="2" class="my-uploader black">
        <video class="my-video" muted :autoplay="false" :controls="false" playsInline :src="videoFileUrl" />
        <div class="close" @click.capture="onDeleteVideo">
          <img class="icon-close" src="~/assets/image/comics/close.png" />
        </div>
      </div>
    </template>
    <template v-else #input>
      <div class="cursor-pointer" @click="onBeforeUpload">
        <div class="my-uploader">+上传视频</div>

        <input ref="upload" class="hidden" type="file" accept="video/mp4" @change="onVideoUpload" />
      </div>
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
const videoFileUrl = computed(() => {
  return videos.value?.[0]?.url ?? ''
})
const videos = defineModel<UploaderFileListItem[]>({
  default: []
})
const { value: loading, open: showLoading, close: hideLoading } = useBoolean()
const progressValue = ref('0.00')

const onDeleteVideo = () => {
  videos.value = []
  upload_url.value = ''
}
const uploadRef = useTemplateRef('upload')
function onBeforeUpload() {
  uploadRef.value!.value = ''
  uploadRef.value?.click()
}

const onVideoUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]

  if (file.size > 2 * 1024 * 1024 * 1024) {
    __.$Toast('上传文件需小于2GB')
    return false
  }

  try {
    showLoading()
    const res = (await __.$Api.uploadVideo(file, (e: number) => {
      progressValue.value = (e * 100).toFixed(2)
    })) as unknown as string

    videos.value = [{ url: res }]
  } catch (error) {
    console.log('error: ', error)
    if (error?.code === 'ERR_CANCELED') {
      console.log('请求被取消')
    } else {
      __.$Toast(error?.message ?? '上传失败，请重试')
    }
  } finally {
    progressValue.value = '0'
    hideLoading()
  }
}
const requestStore = useRequestStore()
onBeforeUnmount(() => {
  requestStore.stopBigVideoUpload()
})
</script>

<style lang="postcss">
@import '~/assets/styles/form-item.css';
</style>
