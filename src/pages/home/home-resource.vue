<script setup lang="tsx">
function normalizeApiPath(api?: string) {
  const p = (api ?? '').trim()
  if (!p) return ''
  return p.startsWith('/') ? p : `/${p}`
}

const { data, loading } = useMyFetch<{
  sj_conf: {
    list: Array<{
      name: string
      title?: string
      api?: string
      type: string | number
    }>
  }
}>({
  api: '/api/system/nav_conf',
  immediate: true
})

const { key, activeTab } = useKeepAlive({})

watchEffect(() => {
  if (data.value?.sj_conf) {
    // 打印请求返回的导航配置
    console.log('data.sj_conf:', data.value.sj_conf)
  }
})
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
        <template v-if="String(tab.type) === 'hy' || Number(tab.type) === 15">
          <game-tab></game-tab>
        </template>
        <graphic-image-item
          v-else
          :api="normalizeApiPath(tab.api)"
          :title="tab.title || tab.name"
          type="images"
        ></graphic-image-item>
      </van-tab>
    </dx-tabs>
  </div>
</template>
