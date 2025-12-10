<script setup lang="tsx">
const tabsMap = {
  ns: {
    api: '/api/image/index',
    type: 'images',
    title: '男色'
  }
}

const { data, loading } = useMyFetch<{
  sj_conf: {
    list: Array<{
      name: string
      type: 'ns' | 'hy'
    }>
  }
}>({
  api: '/api/system/nav_conf',
  immediate: true
})

const { key, activeTab } = useKeepAlive({})
</script>

<template>
  <div :key="key" class="container">
    <dx-tabs v-if="key" v-model:active="activeTab" line-width="0" line-height="0" center class="dx-tabs">
      <template #bottom>
        <dx-spin v-if="loading"></dx-spin>
      </template>
      <template #left>
        <nuxt-icon class="!absolute left-0 top-0 p-1.5 text-4xl" name="arrow-left" @click="$router.back"></nuxt-icon>
      </template>
      <van-tab v-for="tab in data.sj_conf?.list" :key="tab.type" :title="tab.name">
        <template v-if="tab.type === 'hy'">
          <game-tab></game-tab>
        </template>
        <graphic-image-item v-else v-bind="tabsMap[tab.type]"></graphic-image-item>
      </van-tab>
    </dx-tabs>
  </div>
</template>
