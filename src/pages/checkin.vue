<script setup lang="ts">
definePageMeta({
  keepalive: true
})
</script>

<template>
  <div class="checkin-page">
    <div class="checkin-title">签到</div>
    <div class="checkin-desc">占位页面（后续接真实签到逻辑）</div>
  </div>
</template>

<style scoped>
.checkin-page {
  min-height: 100vh;
  padding: 16px;
  background: #ffffff;
}

.checkin-title {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
}

.checkin-desc {
  font-size: 14px;
  color: #6c6c6c;
}
</style>
