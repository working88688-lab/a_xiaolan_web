<template>
  <div>
    <van-field class="dx-form-input" name="uploader" label-align="top" @click="on_before_upload">
      <template v-if="showLabel" #label>
        <span>上传图片</span>
        <span class="label-tips">最多{{ limit }}张，每张不超过1M</span>
      </template>
      <template #input>
        <div v-if="images.length < limit" class="my-uploader">+添加封面</div>
        <van-uploader
          ref="upload_ref"
          v-model="images"
          style="display: none"
          :preview-full-image="false"
          :after-read="onImageUpload"
          accept="image/*"
          :max-count="limit"
        >
          <span></span>
        </van-uploader>
      </template>
    </van-field>
    <van-popup
      v-model:show="show"
      close-on-popstate
      close-on-click-overlay
      position="right"
      :style="{
        width: '100%',
        height: '100%'
      }"
      teleport="body"
      @open="_captureFrame"
      @close="onClose"
    >
      <div class="container bg-black">
        <dx-navbar
          class="black-header"
          :border="false"
          title="选择封面"
          right-text="确定"
          left-arrow
          @click-left="close"
        ></dx-navbar>
        <div v-if="frams.length" class="scroll-container flex flex-col p-1">
          <div class="flex-center flex-1">
            <div :key="frams[select_frame_index]?.url" class="max-w-20">
              <img :src="frams[select_frame_index]?.url" alt="" />
            </div>
          </div>
          <div class="h-10 flex-shrink-0">
            <scroll-x-view>
              <div class="relative flex items-center">
                <div v-for="(item, index) in frams" :key="item.url" class="h-10 w-10" @click="select_frame(index)">
                  <img :src="item.url" alt="" />
                </div>
              </div>
            </scroll-x-view>
          </div>
        </div>
        <div v-else class="text-white">正在生成封面，就稍等...</div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import type { UploaderFileListItem, UploaderInstance } from 'vant'

import { closeDialog } from 'vant'

import { captureFrame } from '@utils/player/utils/captureFrame'

const props = withDefaults(
  defineProps<{
    limit?: number
    showLabel?: boolean
    url?: string
  }>(),
  {
    limit: 9,
    showLabel: true,
    url: ''
  }
)

const __ = useNuxtApp()
const upload_ref = ref<UploaderInstance>()

const images = defineModel<UploaderFileListItem[]>({
  default: []
})

const onImageUpload = async (_file: any) => {
  try {
    _file.status = 'uploading'
    const file = await __.$ImageCompression.compressor(_file.file)

    const res = (await __.$Api.uploadImage({ file, useCompress: false })) as unknown as string
    _file.url = res
    _file.status = 'done'
  } catch (error) {
    _file.status = 'failed'
    return Promise.reject(error)
  }
}

const on_before_upload = () => {
  if (props.url) {
    __.$Alert({
      title: '提示',
      message: '请选择设置封面的方式',
      showCancelButton: true,
      confirmButtonText: '从相册中选取',
      cancelButtonText: '从视频中选择',
      cancelButtonColor: '#999',
      className: 'video-cover-tips'
    })
      .then(() => {
        closeDialog()
        // upload_ref.value?.chooseFile()
        setTimeout(() => {
          upload_ref.value?.chooseFile()
        }, 1000)
      })
      .catch(open)
  } else {
    upload_ref.value?.chooseFile()
  }
}

const { value: show, open, close } = useBoolean()
useDectivted(close)

// 获取视频帧
const select_frame_index = ref(0)
const select_frame = (index: number) => {
  select_frame_index.value = index
}
const frams = ref<Array<{ url: string; blob: Blob | null }>>([])
const _captureFrame = async () => {
  //   frams.value = await captureFrame(props.url, [10, 25, 30])
  frams.value = await captureFrame(props.url, [5, 10, 15])
}

const onClose = () => {
  frams.value = []
  images.value = []
}
</script>

<style lang="postcss">
@import '~/assets/styles/form-item.css';
.video-cover-tips {
  .van-dialog__footer {
    gap: 12px;
  }
  button {
    border-radius: 50px !important;
    font-size: 12px;
  }
}
</style>
<style lang="postcss" scoped>
.black-header {
  --van-nav-bar-text-color: #fff;
  --van-nav-bar-background: #000;
  --van-nav-bar-icon-color: #fff;
  --van-nav-bar-title-text-color: #fff;
}
</style>
