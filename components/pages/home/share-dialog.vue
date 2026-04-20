<!-- 
    desc: 分享弹框
    date: 2024.03.28
-->
<template>
  <van-popup v-bind="$attrs" class="active-dialog" teleport="body">
    <div class="pinduoduo-vd-shareLayer-body">
      <div class="new-share-layer-body">
        <div class="center flex-row">
          <div class="new-logo-custom"><img src="~/assets/image/logo.png" /></div>
          <div class="flex1">{{ props.data?.title }}</div>
        </div>
        <div class="new-share-cover">
          <img :key="props.data?.cover_thumb_url" v-lazyLoad="props.data?.cover_thumb_url" alt="" />
        </div>
        <div class="center flex-row">
          <div class="new-qrcode-custom flex1">
            <vue-qrcode
              :key="config.share_url"
              :value="config.share_url"
              :options="{ width: 60, scale: 20, margin: 0 }"
            />
          </div>
          <div class="new-share-text">
            <p>扫描二维码</p>
            <p>下载APP立即观看</p>
            <p>若二维码无法打开请输入网址</p>
            <p>{{ config.share_url }}</p>
          </div>
        </div>
      </div>
      <div class="pinduoduo-vd-shareLayer-btn">
        <div class="btn" @click="onCopy">复制链接分享</div>
        <div class="btn" @click="onShare">保存图片分享</div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const props = defineProps<{
  data?: any
}>()

const __ = useNuxtApp()
const globalStore = useGlobalStore()
const { config } = storeToRefs(globalStore)
const { copy } = useClipboard({ source: '', legacy: true })

const onCopy = () => {
  copy(config.value.share_url)
  __.$Toast('复制成功，快去分享吧')
}
const onShare = () => {
  __.$Toast('请自行在本页面截图保存')
}

const emit = defineEmits<{
  close: []
}>()

const onClose = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.pinduoduo-vd-shareLayer-body {
  width: 300px;
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
  z-index: 2;

  .new-share-layer-body {
    width: 300px;
    border-radius: 10px;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 11.25px;
    box-sizing: border-box;

    .new-share-cover {
      width: 100%;
      margin: 11.25px 0;
      border-radius: 5px;
      overflow: hidden;
      height: 155.625px;
    }
  }

  .pinduoduo-vd-shareLayer-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22.5px 11.25px 0;

    div {
      width: 129.375px;
      padding: 10.5px 0;
      border-radius: 3.75px;
      color: white;
      font-size: 15px;
      display: flex;
      justify-content: center;
    }

    .btn:nth-child(1) {
      background-image: linear-gradient(to left, #6de6fb, #428af7);
    }

    .btn:nth-child(2) {
      background-image: linear-gradient(to left, #6de6fb, #428af7);
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-row.center {
  align-items: center;
}

.flex-row .new-logo-custom {
  width: 48px;
  margin-right: 12px;
}

.flex-row .new-logo-custom img {
  width: 100%;
  height: 100%;
}

.flex-row .new-qrcode-custom {
  margin-right: 4px;
}

.flex-row .new-share-text {
  font-size: 12px;
}

.flex-row .new-share-text p {
  color: #333;
  line-height: 1.5;
}

.flex-row .new-share-text p:nth-child(1) {
  font-weight: 500;
}

.flex-row .new-share-text p:nth-child(2) {
  font-weight: 500;
}

.flex-row .new-share-text p:nth-child(3) {
  font-size: 14px;
  color: #777;
}

.flex-row .new-share-text p:nth-child(4) {
  font-size: 10px;
  color: #428af7;
}

.flex-row .flex1 {
  flex: 1;
  font-size: 14px;
  color: #333;
}
</style>
