<script setup lang="ts">
const __ = useNuxtApp()
const globalStore = useGlobalStore()
const { isMobile, isSafari, isAndroid, isIos } = useDevice()

const userStore = useUserStore()
const isPwaMode = computed(() => {
  return isPWA()
})

const ua = window.navigator.userAgent.toLowerCase()

function isIosWkWebView() {
  return isIos && !ua.includes('safari') && ua.includes('mobile')
}

function onClick() {
  if (isMobile) {
    if (isAndroid) {
      window.location.href = globalStore.config.pwa_apk
    } else {
      if (isSafari) {
        const affCode = getUrlParams('aff_code')
        window.location.href = `${globalStore.config.pwa_download_url}/index.php?m=index&a=ios_index&aff_code=${affCode}`
        setTimeout(() => {
          window.location.href = `${globalStore.config.pwa_download_url}/js/jump.mobileprovision`
        }, 1600)
      } else {
        __.$Alert('请在safari浏览器打开')
      }
    }
  } else {
    window.open(globalStore.config.pwa_download_url, '__blank')
  }
}
</script>

<template>
  <div v-if="!isPwaMode && !isIosWkWebView()" :class="{
    'is-home': $route.name === 'home'
  }"
    class="dx-open-app absolute left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center rounded-lg bg-primary px-2.5 py-[6px] text-normal text-white shadow-lg"
    @click="onClick">
    <img class="mr-1 !size-2 rounded-sm" src="@assets/image/pwa_logo.png" alt="logo" />
    小蓝app内打开
  </div>
</template>

<style lang="postcss" scoped>
.dx-open-app {
  bottom: 12px;

  &.is-home {
    bottom: calc(var(--recharge-ad-height) + var(--dx-open-app-height) + 12px);
  }

  transition: all 0.2s;
}
</style>
