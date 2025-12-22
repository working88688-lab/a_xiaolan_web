<template>
  <dx-container :loading="loading">
    <div class="category-header">
      <van-nav-bar class="my-nav-bar" :border="false">
        <template #title>
          <dx-tabs v-model:active="params.tab" center shrink class="primary-tabs" @click-tab="onTypeChange">
            <van-tab v-for="tab in data.tab" :key="tab.key" :title="tab.name" :name="tab.key"></van-tab>
            <template #right>
              <div v-link="`/search?_index=1`" class="absolute right-1 top-1 h-2 w-2 cursor-pointer">
                <img src="~/assets/image/search.png" />
              </div>
            </template>
          </dx-tabs>
        </template>
      </van-nav-bar>
      <div class="px-1">
        <dx-tabs
          :key="params.tab"
          v-model:active="params.kwy"
          theme="button"
          line-height="0"
          line-width="0"
          shrink
          class="mb-1.5"
        >
          <van-tab v-for="tab in sub_tabs" :key="tab.key" :title="tab.name" :name="tab.key"></van-tab>
        </dx-tabs>
        <dx-tabs v-model:active="params.sort" theme="button" line-height="0" line-width="0" shrink class="mb-1.5">
          <van-tab v-for="tab in mv_original_tab" :key="tab.name" :title="tab.title" :name="tab.name"></van-tab>
        </dx-tabs>
      </div>
    </div>
    <div class="scroll-container">
      <dx-hoc-list
        :api="__.$Api.original.list"
        :params="params"
        :immediate="false"
        :ready="!!params.tab"
        class="grid grid-cols-2 gap-1 px-1"
      >
        <template #item="{ item, index, items }">
          <video-card
            :key="item.id"
            :index="index"
            :list="items"
            :show-type="false"
            :mv-type="2"
            :show-duration="false"
            :item="{ cover_thumb_url: item.cover_full, rating: item.play_count, ...item }"
          ></video-card>
        </template>
      </dx-hoc-list>
    </div>
  </dx-container>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

type ITab = {
  key: string
  name: string
}

type Itabs = {
  sort: ITab[]
  tab: Array<{
    key: string
    name: string
    items: ITab[]
  }>
}

const params = reactive({
  tab: '',
  kwy: '',
  sort: ''
})
const { mv_original_tab } = useGlobalStore()

const sub_tabs = computed(() => {
  return data.value.tab?.find(item => item.key === params.tab)?.items ?? []
})

const { data, loading } = useMyFetch<Itabs>({
  api: __.$Api.original.home,
  immediate: true
})

const onTypeChange = (_val: any) => {
  params.kwy = ''
  params.sort = ''
}
</script>

<style lang="postcss" scoped>
:deep(.van-nav-bar__left) {
  position: static;
  padding: 0 8px;
  margin-bottom: 12px;
}
:deep(.van-nav-bar__title) {
  max-width: 100%;
  text-overflow: initial;
  margin: 0;
  flex: 1;
}
:deep(.van-tabs__nav) {
  background-color: transparent;
}
:deep(.van-nav-bar) {
  background-color: transparent;
}
:deep(.dx-custom-tabs__button) {
  .van-tabs__wrap {
    height: 26px;
    .van-tab__text {
      padding-left: 14px;
      padding-right: 14px;
    }
  }
}
</style>
