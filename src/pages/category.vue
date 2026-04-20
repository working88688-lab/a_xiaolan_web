<template>
  <div :key="key" class="container">
    <dx-spin v-if="initing"></dx-spin>
    <template v-else>
      <div class="category-header">
        <dx-tabs v-model:active="activeTab" shrink class="sticky-title mb-1" theme="button" @change="onTabIdChange">
          <van-tab v-for="tab in data" :key="tab.tab_id" :title="tab.tab_name"></van-tab>
        </dx-tabs>
        <dx-tabs
          v-model:active="secondActiveTab"
          line-height="0"
          line-width="0"
          shrink
          theme="button"
          class="sticky-title mb-1"
          @change="onCommonChange"
        >
          <!-- <template #left>
            <span class="van-tab mr-1.5 flex-shrink-0 bg-white !pr-0.5 font-medium text-[#111111]">类型</span>
          </template> -->
          <van-tab v-for="(item, index) in secondTabs" :key="index" :title="item"></van-tab>
        </dx-tabs>
        <dx-tabs
          v-model:active="typeTab"
          class="mb-1"
          line-height="0"
          line-width="0"
          shrink
          theme="button"
          @change="onCommonChange"
        >
          <!-- <template #left>
            <span class="mr-1.5 flex-shrink-0 bg-white !pr-0.5 font-medium text-[#111111]">规格</span>
          </template> -->
          <van-tab v-for="(item, index) in typeList" :key="index" :title="item.name"></van-tab>
        </dx-tabs>
        <dx-tabs
          v-model:active="sort"
          class="mb-1"
          line-height="0"
          line-width="0"
          shrink
          theme="button"
          @change="onSort"
        >
          <!-- <template #left>
            <span class="mr-1.5 flex-shrink-0 !pr-0.5 font-medium text-[#111111]">排序</span>
          </template> -->
          <van-tab title="最新" name="newest"></van-tab>
          <van-tab title="最热" name="hottest"></van-tab>
        </dx-tabs>
      </div>
      <div class="scroll-container">
        <scroll-list
          v-model:loading="loading"
          :pullup="_fetch"
          :pull-down-refresh="_refresh"
          :is-empty="isEmpty"
          :is-end="isEnd"
        >
          <div class="grid grid-cols-2 gap-1 px-1">
            <video-card
              v-for="(item, index) in listData"
              :key="item.id"
              :list="listData"
              :index="index"
              :item="item"
            ></video-card>
          </div>
        </scroll-list>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NewTabItem, VideoItem } from '@types'
const __ = useNuxtApp()

const key = ref()
const activeTab = ref(0)
const secondActiveTab = ref(0)
const typeTab = ref(0)

const sort = ref<'newest' | 'hottest'>('newest')
const typeList = [
  { name: '全部', type: 0 },
  { name: 'VIP', type: 1 },
  { name: '金币', type: 2 }
]
const {
  data,
  execute: generateTabs,
  loading: initing
} = useMyFetch<NewTabItem[]>({
  api: 'api/tab/categoryNew'
})
const secondTabs = computed(() => {
  return data.value?.[activeTab.value]?.tags_ary ?? []
})

const getParams = () => {
  return {
    tag: secondTabs.value[secondActiveTab.value],
    tab_id: data.value[activeTab.value].tab_id,
    sort: sort.value,
    type: typeList[typeTab.value].type
  }
}

const _fetch = () => {
  return execute(getParams())
}

const _refresh = () => {
  return refresh(getParams())
}
const { listData, loading, execute, refresh, isEmpty, isEnd, reset } = useFetchList<VideoItem>({
  api: __.$Api.Home.getNewCategory,
  params: {
    size: 16
  },
  adConfig: {
    key: 'list_ads'
  }
})

const onSort = (type: 'newest' | 'hottest') => {
  console.log('type: ', type)
  _refresh()
}

const onTabIdChange = () => {
  secondActiveTab.value = 0
  typeTab.value = 0
  sort.value = 'newest'
  _refresh()
}
const onCommonChange = () => {
  _refresh()
}

const back = () => {
  key.value = ''
  activeTab.value = 0
  secondActiveTab.value = 0
  typeTab.value = 0
  sort.value = 'newest'
  reset()
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value) {
    key.value = Math.random()
    generateTabs().then(_fetch)
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__left) {
  position: static;
  padding: 0 8px;
  margin-bottom: 12px;
}

:deep(.van-nav-bar__title) {
  max-width: 100%;
  text-overflow: initial;
  margin: 0;
}

:deep(.van-tabs__nav) {
  background-color: transparent;
}

:deep(.van-nav-bar) {
  background-color: transparent;
}

.catagory-tab {
  :deep(.van-tabs__nav) {
    padding-left: 0px;
  }
}

:deep(.dx-custom-tabs__button) {
  .van-tabs__wrap {
    height: 26px;

    .van-tab__text {
      padding-left: 20px;
      padding-right: 20px;
    }

    .van-tab--active {
      font-weight: normal !important;
    }
  }
}
</style>
