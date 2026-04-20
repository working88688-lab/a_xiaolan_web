<template>
  <div class="container">
    <dx-navbar
      class="my-nav-bar !text-white"
      :border="false"
      title="客服中心"
      left-arrow
      @click-left="$router.back"
    ></dx-navbar>
    <div class="scroll-container">
      <dx-spin v-show="loading" size="0.6rem" class="my-2 text-center" />
      <iframe class="h-full w-full" :src="serviceSrc" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const serviceSrc = ref('')
const loading = ref(false)
const customer = __.$Api.dynamic({
  url: 'api/users/customer_conf'
})

onMounted(() => {
  loading.value = true
  customer()
    .then(res => {
      serviceSrc.value = res.data.url
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
})
</script>

<style lang="postcss" scoped>
.my-nav-bar {
  --van-nav-bar-background: #000;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}
</style>
