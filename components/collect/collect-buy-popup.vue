<template>
  <van-popup
    close-on-click-overlay
    :style="{
      width: '80%'
    }"
    :lock-scroll="false"
    round
    teleport="body"
    v-bind="$attrs"
    @click-overlay="onClose"
  >
    <div class="flex-col-center py-2.5">
      <h6 class="mb-1.5 text-2xl font-medium text-[#1a1a1a]">购买合集</h6>
      <p class="text-normal">一键打包可享受金币折扣</p>
      <div class="buy_price">
        <div class="h-2 w-2 flex-shrink-0">
          <img src="~/assets/image/player/coin.png" />
        </div>
        <span>{{ videoInfo?.coins }}金币</span>
      </div>
      <p class="mb-3 text-xl text-[#1a1a1a] line-through">原价共{{ videoInfo?.origin_coins }}金币</p>
      <dx-button class="!fit-content" block type="warning" @click="onSubmit">
        支付{{ videoInfo?.coins }}金币永久观看
      </dx-button>
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

const onClose = () => {
  emit('update:show', false)
}

const onSubmit = () => {
  onClose()
  emit('submit')
}

useDectivted(onClose)
</script>

<style lang="postcss" scoped>
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
