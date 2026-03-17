<script setup lang="ts">
const __ = useNuxtApp()
const { data, loading } = useMyFetch<any>({
  api: __.$Api.dynamic({ url: '/api/porngame/construct' }),
  immediate: true
})
const activeTab = ref(0)
</script>

<template>
  <dx-tabs v-model:active="activeTab" class="dx-tabs" shrink line-width="22px" gap="4px" line-height="2px">
    <van-tab v-for="tab in data.cates" :key="tab.id" :title="tab.title">
      <dx-resource-list
        :api="tab.more_api"
        :tabs="data.flags.map((item: any) => ({ name: item.key, title: item.name }))"
        :params="{ ...tab.api_params, size: 12 }"
        :show-top-banner="false"
      >
        <template #config>
          <dx-ads :items="data.ads" ad-key="game" ad-name="黄游"></dx-ads>
        </template>
        <template #list="{ items }">
          <div class="dx-grid-2">
            <game-item v-for="item in items" :key="item.id" :item="item" />
          </div>
        </template>
      </dx-resource-list>
    </van-tab>
  </dx-tabs>
</template>

<style scoped></style>
