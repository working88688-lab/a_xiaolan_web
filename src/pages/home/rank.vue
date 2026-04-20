<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

import type { TabItem, AdItem } from '@types'

const scrollTop = ref(0)
const element = useTemplateRef<HTMLDivElement>('element')
useEventListener(element, 'scroll', (e: Event) => {
  scrollTop.value = (e.target as HTMLDivElement).scrollTop
})

const { data } = useMyFetch<{
  list: TabItem[]
  time_conf: Array<{
    id: number
    name: string
    param: string
  }>
  ads: AdItem[]
}>({
  api: 'api/tabnew/rankConf',
  immediate: true
})

const { key, activeTab } = useKeepAlive({
  reset() {
    scrollTop.value = 0
  }
})
</script>
<template>
  <div class="container">
    <div :key="key" ref="element" class="scroll-container is-scroll">
      <dx-tabs
        v-model:active="activeTab"
        class="rank-tabs dx-tabs h-full"
        line-width="24px"
        line-height="4px"
        title-active-color="#fff"
        title-inactive-color="rgba(255, 255, 255, 0.7)"
        gap="0.4rem"
        center
      >
        <template #left>
          <nuxt-icon
            class="absolute left-1 top-1 text-4xl text-white"
            name="arrow-left"
            @click="$router.back"
          ></nuxt-icon>
        </template>
        <van-tab v-for="tab in data.list" :key="tab.id" class="h-full" :title="tab.name">
          <dx-ads
            v-if="data.ads?.length"
            :items="data.ads"
            :ad-key="tab.id"
            :ad-name="tab.name"
            class="mb-1 px-1"
          ></dx-ads>
          <dx-hoc-list
            v-if="tab.type === 'recommend'"
            :api="tab.api"
            :list-props="{
              usePageSize: false,
              disabledRefresh: !!(scrollTop && scrollTop > 0)
            }"
            :loading-when-refresh="false"
            :params="{ type: tab.params }"
          >
            <template #list="{ items }">
              <div class="top mb-2 grid grid-cols-3 gap-0.5 px-1 text-center text-white">
                <rank-tab-top-item
                  v-for="(item, index) in sortTopItem(items.slice(0, 3))"
                  :key="item.uid"
                  :item
                  :tab
                  :index
                ></rank-tab-top-item>
              </div>
              <div class="grid grid-cols-1 gap-1 px-1">
                <rank-tab-item
                  v-for="(item, index) in items.slice(3, items.length)"
                  :key="item.uid"
                  :item
                  :tab
                  :index
                  class="flex"
                ></rank-tab-item>
              </div>
            </template>
          </dx-hoc-list>
          <rank-tab v-else class="h-full" :scroll-top :tabs="data.time_conf" :tab="tab"></rank-tab>
        </van-tab>
      </dx-tabs>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
:deep(.van-nav-bar__title),
.transparent {
  color: #fff;
}

:deep(.van-tabs__nav) {
  background: transparent;
}

.container {
  background-image: linear-gradient(#cb4aed, #3d28a8, #332094);
}

:deep(.pull-up),
:deep(.pull-down),
:deep(.loading-text),
:deep(.scroller),
:deep(.loading-container) {
  color: #fff !important;
  --van-loading-text-color: #fff;
  --van-loading-spinner-color: #fff;
}

:deep(.van-tabs__line) {
  background: linear-gradient(130deg, #cb4aed 35%, #5d3ef9) !important;
}

.rank-tabs {
  & > :deep(.van-tabs__content) {
    height: 100%;

    .van-tab__panel {
      height: 100%;
    }
  }
}

:deep(.ad-title) {
  color: #fff !important;
}
</style>
