<template>
  <div class="container flex-center">
    <!-- <div class="text-base2">线路检测中，请稍等^_^</div>
    <div class="my-0.5 text-base2">1. 若一直进不去请使用VPN翻墙软件观看！</div>
    <div class="cursor-pointer text-mred">2. 点我直连试试</div> -->
    <a class="mt-1 text-primary" :href="site" target="_blank">
      若进不去点我重新安装：
      <span>{{ site }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
const site = ref(localStorage.getItem('pwa_download_url') || '')
</script>

<style scoped></style>
