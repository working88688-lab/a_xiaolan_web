<template>
  <div class="sj_time">
    <p
      v-if="props.starTime > props.endTime"
      :style="{
        fontSize: '0.32rem'
      }"
    >
      此次求片已经结束
    </p>
    <div v-else class="flex_row">
      <div class="fans_text" style="color: #c0bdcc">倒计时:</div>
      <div class="flex_row countdown" v-html="timeStr"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  starTime: number
  endTime: number
  coin: number
}>()
let timer: any
const timeStr = ref()
onMounted(() => {
  if (props.starTime < props.endTime) {
    timer = setInterval(() => {
      const ctime = new Date().getTime()
      const specialTime = props.endTime * 1000 - ctime
      if (specialTime <= 0) {
        clearInterval(timer)
      }
      const day = Math.floor(specialTime / 1000 / 60 / 60 / 24)
      const hour = Math.floor((specialTime / 1000 / 60 / 60) % 24)
      const minute = Math.floor((specialTime / 1000 / 60) % 60)
      const second = Math.floor((specialTime / 1000) % 60)
      const tStr = `<span>${day < 10 ? '0' + day : day}</span>天<span>${
        hour < 10 ? '0' + hour : hour
      }</span>小时<span>${minute < 10 ? '0' + minute : minute}</span>分<span>${
        second < 10 ? '0' + second : second
      }</span>秒`
      timeStr.value = tStr
    }, 1000)
  }
})
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="less">
.countdown {
  span {
    display: inline-block;
    color: #ff3e3e;
    margin: 0 0.06rem;
  }
}
</style>
