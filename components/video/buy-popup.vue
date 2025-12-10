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
      <h6 class="mb-1.5 text-2xl font-medium text-[#1a1a1a]">本内容需购买解锁</h6>
      <p v-if="videoInfo?.user?.nickname" class="mx-2 text-normal">
        该视频为[{{ videoInfo?.user?.nickname }}]上传的金币视频
      </p>
      <div class="buy_price">
        <div class="h-2 w-2 flex-shrink-0">
          <img src="~/assets/image/player/coin.png" />
        </div>
        <span>{{ videoInfo?.coins }}金币</span>
      </div>
      <p v-if="videoInfo?.discount && videoInfo.discount >= 10" class="vip_p">会员可享折扣优惠</p>
      <p v-if="videoInfo?.origin_coins && videoInfo?.discount < 10" class="vip_p vip_p_o line-through">
        原价{{ videoInfo?.origin_coins }}金币
      </p>
      <div>
        <dx-button class="btn_item" type="warning" @click="onSubmit">支付{{ videoInfo?.coins }}金币永久观看</dx-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'
const props = defineProps<{
  videoInfo?: VideoItem
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
.btn_item {
  width: 185px;
}

.buy_price {
  padding: 0.64rem 0;
  display: flex;
  align-items: center;

  span {
    color: #f28e0d;
    font-size: 25px;
    margin-left: 6px;
  }
}
</style>
