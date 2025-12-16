<!-- 
    desc: 底部菜单
    date: 2024.03.30
-->
<script setup>
// 当前实例
const _this = this
const _route = useRoute()
const __ = useNuxtApp()

// 参数变量
const { navtar } = useAppConfig()

// 属性计算
const indexNavs = computed(() => navtar.menu)

// 设置默认(底部)
const tabactive = ref('home')
watch(
  () => _route.path,
  path => {
    const defalut = indexNavs.value.find(e => path === e.router)
    tabactive.value = defalut?.value ?? ''
  },
  { deep: true, immediate: true }
)

// 更新菜单(底部)
const onTabChange = e => {
  // navigateTo(`${e.router}`);
  __.$Replace(`${e.router}`)
}

const icon_version = '?v=2.0'
</script>

<template>
  <van-tabbar v-model="tabactive" :border="false" placeholder :fixed="false" z-index="2000">
    <van-tabbar-item v-for="(e, index) in indexNavs" :key="index" :index="`${index}`" :name="e.value"
      @click="() => onTabChange(e)">
      <span>{{ e.title }}</span>
      <template #icon="props">
        <img :key="e.value" :src="tabactive === e.value ? e.iconselect + icon_version : e.icon + icon_version" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="postcss">
.van-tabbar {
  .van-tabbar-item {
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
