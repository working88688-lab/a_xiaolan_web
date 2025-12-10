<template>
  <div ref="list" class="container">
    <div class="mb-1 px-1.5">
      <dx-ads :items="data?.ads ?? []" ad-key="film" ad-name="求片"></dx-ads>
    </div>
    <dx-tabs v-model:active="active" title-active-color="#548aef" title-inactive-color="#666" line-height="0"
      line-width="0" swipeable lazy-render shrink theme="button" class="dx-tabs">
      <van-tab v-for="(item, index) in data?.tab" :key="item.name" :title="item.name">
        <film-tab-item :disabled-refresh="scrollTop > 0" :type="item.id" :item="item"></film-tab-item>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<script setup lang="ts">
import type { BannerItem, TabItem } from '@types'

const active = ref(0)
const __ = useNuxtApp()
const { data } = useMyFetch<{
  tab: TabItem[]
  ads: BannerItem[]
}>({
  api: __.$Api.Community.qiupian,
  immediate: true
})

const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)
</script>

<style lang="less" scoped>
:deep(.van-tabs__wrap) {
  margin-bottom: 12px;
}
</style>
