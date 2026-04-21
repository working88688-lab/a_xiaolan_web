<template>
  <div class="dx-input-video-wrapper">
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
          <div class="video-preview-hit" role="button" tabindex="0" @click="onPreviewVideo">
            <video
              class="my-video"
              muted
              :autoplay="false"
              :controls="false"
              playsinline
              webkit-playsinline
              :src="videoFileUrl"
            />
          </div>
          <div class="close" @click.capture="onDeleteVideo">
            <img class="icon-close" src="~/assets/image/comics/close.png" />
          </div>
        </div>
      </template>
      <template v-else #input>
        <div class="cursor-pointer" @click="onBeforeUpload">
          <div class="my-uploader">
            <div class="upload-inner">
              <svg
                class="upload-icon"
                width="70"
                height="60"
                viewBox="0 0 70 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_67_5632)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.2998 3.00099C30.1998 0.60099 34.3998 -0.29901 38.8998 0.000989888C43.0998 0.60099 46.9998 2.70099 49.9998 5.70099C52.6998 8.40099 54.4998 12.001 55.0998 15.901C58.0998 16.801 60.4998 18.601 62.2998 21.301C64.3998 24.001 65.2998 27.601 64.6998 31.201C64.3998 34.501 62.5998 37.801 60.1998 40.201C57.4998 42.601 54.1998 43.801 50.8998 43.801C49.3998 43.801 48.1998 42.601 48.1998 41.101C48.1998 39.601 49.3998 38.401 50.8998 38.401C52.9998 38.401 55.0998 37.501 56.5998 36.001C58.0998 34.501 59.2998 32.701 59.5998 30.301C59.8998 28.201 59.2998 26.101 58.0998 24.301C56.8998 22.501 55.0998 21.301 52.9998 20.701C52.9998 20.701 52.9998 20.701 52.6998 20.701C52.0998 20.401 51.4998 20.101 50.8998 19.501C50.5998 19.201 50.2998 18.601 49.9998 18.001C49.6998 15.001 48.4998 12.001 46.0998 9.90099C43.9998 7.20099 41.2998 5.70099 37.9998 5.40099C34.9998 5.10099 31.6998 5.70099 28.9998 7.50099C26.5998 9.00099 24.7998 11.701 23.5998 14.401V14.701C23.2998 15.601 22.6998 15.901 22.0998 16.201C21.4998 16.801 20.8998 16.801 20.2998 16.801C18.7998 17.101 17.5998 17.401 16.3998 18.001C15.1998 18.601 13.9998 19.501 13.0998 20.401C10.9998 22.801 10.0998 25.501 10.3998 28.201C10.6998 30.901 11.8998 33.601 13.9998 35.701C15.1998 36.601 15.1998 38.401 14.2998 39.601C13.3998 40.801 11.5998 40.801 10.3998 39.901C7.39977 36.901 5.29977 33.001 4.99977 28.801C4.69977 24.601 6.19977 20.401 8.89977 17.101C10.3998 15.601 11.8998 14.101 13.9998 13.201C15.4998 12.301 17.2998 12.001 19.0998 11.701C20.5998 8.10099 22.9998 5.10099 26.2998 3.00099Z"
                    fill="#6C6C6C"
                  />
                  <path
                    d="M36.0187 24.7122C36.0187 23.8122 35.4187 22.6122 34.5187 22.3122C33.6187 21.7122 32.4187 22.0122 31.5187 22.9122L23.7187 29.8122C23.1187 30.7122 22.8187 31.9122 23.1187 32.8122C23.4187 34.0122 24.3187 34.6122 25.5187 34.6122H30.6187V47.2122C30.6187 48.7122 31.8187 49.9122 33.3187 49.9122C34.8187 49.9122 36.0187 48.7122 36.0187 47.2122V24.7122Z"
                    fill="#6C6C6C"
                  />
                  <path
                    d="M31.0028 24.7122C31.0028 23.8122 31.6028 22.6122 32.5028 22.3122C33.4028 21.7122 34.6028 22.0122 35.5028 22.9122L43.3028 29.8122C43.9028 30.7122 44.2028 31.9122 43.9028 32.8122C43.6028 34.0122 42.7028 34.6122 41.5028 34.6122H36.4028V47.2122C36.4028 48.7122 35.2028 49.9122 33.7028 49.9122C32.2028 49.9122 31.0028 48.7122 31.0028 47.2122V24.7122Z"
                    fill="#6C6C6C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_67_5632">
                    <rect width="60" height="60" fill="white" transform="translate(5)" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <input ref="upload" class="hidden" type="file" accept="video/mp4" @change="onVideoUpload" />
        </div>
      </template>
    </van-field>

    <!-- 视频预览弹层 -->
    <van-popup
      v-model:show="showPreview"
      teleport="body"
      class="video-preview-popup"
      position="center"
      :close-on-click-overlay="true"
    >
      <div class="video-preview-wrapper">
        <video v-if="videoFileUrl" class="video-preview" controls playsinline webkit-playsinline :src="videoFileUrl" />
      </div>
    </van-popup>
  </div>
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
const { value: showPreview, open: openPreview, close: closePreview } = useBoolean()

const onDeleteVideo = () => {
  videos.value = []
  upload_url.value = ''
  closePreview()
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

const onPreviewVideo = () => {
  if (!videoFileUrl.value) return
  openPreview()
}
</script>

<style lang="postcss">
@import '~/assets/styles/form-item.css';

.video-preview-popup {
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-preview-wrapper {
  width: 100%;
  padding: 0 16px;
}

.video-preview {
  width: 100%;
  max-height: 80vh;
}

.my-uploader {
  border: 1px dashed #7a7a7a;
  background-color: #f0f0f0;

  .upload-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .upload-icon {
    width: 35px;
    height: 30px;
  }
}

.video-preview-hit {
  width: 100%;
  height: 100%;
}

.my-video {
  pointer-events: none;
}
</style>
