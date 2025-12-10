<!-- 
    desc: 头部导航
    date: 2023.03.20
-->
<script setup>
/**
 * 当前实例
 */
const __ = useNuxtApp()
const _router = useRouter()

//
const isDesktop = computed(() => __.$Store.global.isDesktop)

// 初始入口
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

//
onActivated(() => {
  mounted.value = true
})

//
_router.beforeEach((to, from) => {
  if (to.meta.top && to.fullPath === from.fullPath) {
    mounted.value = true
  } else {
    mounted.value = false
  }
})

//
_router.afterEach((to, from) => {})
</script>

<template>
  <!-- 导航 start -->
  <div v-if="mounted && !isDesktop">
    <Teleport to=".xblue-header">
      <slot></slot>
    </Teleport>
  </div>
  <!-- 导航 end -->
</template>

<style lang="less">
.xblue-header {
  & > div:not(:last-child) {
    display: none;
  }
}
</style>
