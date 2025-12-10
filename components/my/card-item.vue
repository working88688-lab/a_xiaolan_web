<template>
  <div class="user-ticket-item" @click="handle">
    <div class="info">
      <div class="title">免费观影券</div>
      <div class="subtitle">{{ item?.expired_str }}到期</div>
    </div>
    <div :class="['active', markClass]" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: number
  item: any
}>()

const __ = useNuxtApp()
const markClass = computed(() => {
  let markClass = 'to-use'
  switch (props.type) {
    case 1:
      markClass = 'used'
      break
    case 2:
      markClass = 'timeout'
      break
    default:
      markClass = 'to-use'
      break
  }
  return markClass
})

const handle = () => {
  if (!props.type) {
    __.$Toast('请在观看视频中使用观影券')
  }
}
</script>

<style lang="less" scoped>
.user-ticket-item {
  height: 2.35rem;
  margin: 0.4rem;
  background: center/cover no-repeat url('~/assets/image/my/bg_ticket.png');
  display: flex;
  align-items: center;

  .info {
    flex: 1;
    padding: 0.5rem;

    .title {
      font-size: 0.5rem;
      color: #000;
    }

    .subtitle {
      margin-top: 0.3rem;
      font-size: 0.3rem;
      color: #666;
    }
  }

  .active {
    width: 1.75rem;
    height: 0.75rem;
    margin: 0 0.4rem;

    &.to-use {
      background: center/cover no-repeat url('~/assets/image/my/icon_to_use.png');
    }

    &.used {
      background: center/cover no-repeat url('~/assets/image/my/icon_used.png');
    }

    &.timeout {
      background: center/cover no-repeat url('~/assets/image/my/icon_timeout.png');
    }
  }
}
</style>
