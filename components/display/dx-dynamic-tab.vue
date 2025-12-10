<template>
  <div ref="element" class="h-full">
    <slot name="ads" :ads="data.ads"></slot>
    <dx-tabs
      v-model:active="activeTab"
      class="text-medium dx-tabs first-no-padding"
      line-height="2px"
      line-width="24px"
      gap="8px"
      static
      v-bind="tabsProps"
      :duration="duration"
      stop-propagation
    >
      <template #nav-bottom>
        <dx-spin v-show="loading" size="0.6rem" class="my-2 text-center"></dx-spin>
      </template>
      <van-tab v-for="(tab, _index) in data.list" :key="_index" :title="tab[props.labelKey]">
        <dx-hoc-list
          v-if="tab.type !== 'follow'"
          :api="tab.api"
          :type="props.type"
          :list-props="{
            ...props.listProps,
            disabledRefresh: !!(props.scrollTop && props.scrollTop > 0)
          }"
          :fetch-props="props.fetchProps"
          :loading-when-refresh="false"
          :params="{ ...tab.params, size: 10 }"
        >
          <template #list="{ items }">
            <slot name="list" :items="items" :tab></slot>
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<script setup lang="ts">
import type { TabItem, BannerItem } from '@types'

const props = withDefaults(
  defineProps<{
    api: any
    params?: any
    listTabsConfig?: any
    labelKey?: 'title' | 'name'
    listProps?: any
    type?: string
    tabsProps?: any
    fetchProps?: any
    scrollTop?: number
  }>(),
  {
    labelKey: 'title'
  }
)

const { activeTab, duration, updateActiveTab } = useDefaultActiveTab({
  key: 'current'
})

const { data, loading } = useMyFetch<{ list: TabItem[]; mid_conf: any[]; ads: BannerItem[] }>({
  api: props.api,
  immediate: true,
  params: props.params,
  success() {
    updateActiveTab(data.value.list)
  }
})
</script>
