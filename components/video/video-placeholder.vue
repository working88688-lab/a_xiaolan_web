<script setup lang="ts">
import type { VideoItem } from '@types'

const props = defineProps<{
  coins: number
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <div class="video-placeholder text-white">
    <!-- 金币 -->
    <template v-if="props.coins > 0">
      <div class="mb-2">温馨提示</div>
      <div class="mb-2 text-sm">支付{{ props.coins }}金币解锁完整视频</div>
      <div class="dx-grid-2">
        <dx-button to="/coin-recharge" color="#fd6409" class="!mr-2 w-[120px] !border-0">立即充值</dx-button>
        <dx-button linear class="w-[120px]" @click="onConfirm">立即购买</dx-button>
      </div>
    </template>

    <!-- vip -->
    <template v-else>
      <div class="mb-2">温馨提示</div>

      <div class="text-sm">开通VIP无限畅看！</div>
      <div class="mb-2 text-sm">邀好友再送3天VIP！</div>
      <div>
        <dx-button to="/renewal" linear class="!mr-2 w-[120px]">开通会员</dx-button>
        <dx-button to="/invite" color="#fd6409" class="w-[120px] !border-0">分享得会员</dx-button>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.video-placeholder {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 300px;
}
</style>
