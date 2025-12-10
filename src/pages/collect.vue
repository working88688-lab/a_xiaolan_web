<script setup lang="ts">
import type { BannerItem } from '@types'
const __ = useNuxtApp()

const tabs = [
  {
    title: '最新',
    params: {
      sort: 'new'
    }
  },
  {
    title: '最热',
    params: {
      sort: 'hot'
    }
  },
  {
    title: '点赞',
    params: {
      sort: 'like'
    }
  }
]

const ads = ref<BannerItem[]>([])
function onSuccess(res: any) {
  if (res?.data?.ads) {
    ads.value = [...res.data.ads]
  }
}
const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)
const { key, activeTab } = useKeepAlive({})
</script>
<template>
  <div ref="list" class="container">
    <div class="mb-0.5 px-1.5">
      <dx-ads :items="ads"></dx-ads>
    </div>
    <dx-tabs :key="key" v-model:active="activeTab" shrink class="dx-tabs first-no-padding primary-tabs">
      <van-tab v-for="tab in tabs" :key="tab.title" :title="tab.title">
        <dx-hoc-list
          v-if="key"
          :list-props="{ disabledRefresh: scrollTop > 0 }"
          :params="tab.params"
          class="dx-grid-1"
          :api="__.$Api.collect.list"
          :success="onSuccess"
        >
          <template #item="{ item, index }">
            <collect-list-item
              :key="index"
              class="px-[12px] py-[20px]"
              :item="item"
              :index="index + 1"
            ></collect-list-item>
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  background-color: #f6f7f8;
}
</style>
