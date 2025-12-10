<template>
  <van-field class="dx-form-input" name="uploader" label-align="top">
    <template v-if="showLabel" #label>
      <span>上传图片</span>
      <span class="label-tips">最多{{ limit }}张，每张不超过5M</span>
    </template>
    <template #input>
      <van-uploader
        v-model="images"
        :preview-full-image="false"
        :after-read="onImageUpload"
        accept="image/*"
        :max-count="limit"
      >
        <div v-if="images.length < limit" class="my-uploader">+{{ props.tip }}</div>
      </van-uploader>
    </template>
  </van-field>
</template>

<script setup lang="ts">
import type { UploaderFileListItem } from 'vant'
const props = withDefaults(
  defineProps<{
    limit?: number
    showLabel?: boolean
    tip?: string
  }>(),
  {
    limit: 9,
    showLabel: true,
    tip: '上传图片'
  }
)

const __ = useNuxtApp()

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
</script>

<style lang="postcss">
@import '~/assets/styles/form-item.css';
</style>
