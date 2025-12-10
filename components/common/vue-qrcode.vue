<!-- 
    desc: 二维码组件
    date: 2024.03.28
    https://www.npmjs.com/package/qrcode
-->
<template>
  <canvas
    ref="qrcodeRef"
    :class="{
      'qrcode-canvas': props.full
    }"
    style="width: 100%; height: 100%"
    width="100"
    height="100"
  ></canvas>
</template>

<script setup lang="ts">
import type { QRCodeRenderersOptions } from 'qrcode'
import QRCode from 'qrcode'

const props = defineProps<{
  value?: string
  options?: QRCodeRenderersOptions
  full?: boolean
}>()
// 状态声明
const qrcodeRef = ref()
watchEffect(() => {
  if (props.value) {
    QRCode.toCanvas(qrcodeRef.value, props.value, {
      errorCorrectionLevel: 'H',
      width: 100,
      ...(props.options || {})
    })
  }
})
</script>

<style lang="less" scoped>
.qrcode-canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
