<script setup lang="ts">
import type { RankItem, TabItem } from '@types'
import { useNuxtApp } from 'nuxt/app'

import ranking1 from '~/assets/image/rank/top1.png'
import ranking2 from '~/assets/image/rank/top2.png'
import ranking3 from '~/assets/image/rank/top3.png'

const props = defineProps<{
  tabs: Array<{
    id: number
    name: string
    param: string
  }>
  tab: TabItem
  scrollTop: number
}>()
const activeTab = ref(0)

const icons = [ranking1, ranking2, ranking3]
const __ = useNuxtApp()

const renderNum = (tab: TabItem, item: RankItem) => {
  if (tab.type === 'liked') {
    return `点赞数：${__.$Utils.formatNumber(item?.likes_count)}`
  } else if (tab.type === 'recommend' || tab.type === 'upload') {
    return `作品数：${__.$Utils.formatNumber(item?.videos_count)}`
  } else {
    return `收益数：${__.$Utils.formatNumber(item?.votes)}`
  }
}
</script>
<template>
  <dx-tabs
    v-model:active="activeTab"
    title-active-color="#fff"
    title-inactive-color="rgba(255, 255, 255, 0.5)"
    swipeable
    lazy-render
    shrink
    type="card"
    class="dx-tabs"
  >
    <van-tab v-for="subTab in tabs" :key="subTab.id" :title="subTab.name">
      <dx-hoc-list
        class="dx-grid-1 pb-2"
        :api="props.tab.api"
        :list-props="{
          usePageSize: false,
          disabledRefresh: !!(props.scrollTop && props.scrollTop > 0)
        }"
        :loading-when-refresh="false"
        :params="{ type: subTab.param }"
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
    </van-tab>
  </dx-tabs>
</template>

<style lang="postcss" scoped>
:deep(.van-tabs__line) {
  background: linear-gradient(130deg, #cb4aed 35%, #5d3ef9) !important;
}
:deep(.van-tabs__nav) {
  background: transparent;
}

:deep(.van-tabs__nav--card) {
  margin: 0;
  border: 0;
  background: rgba(255, 255, 255, 0.2);
  .van-tab--card {
    border: 0;
  }
  .van-tab {
    width: 80px;
    border-radius: 50px;
  }
  .van-tab__text {
    font-size: 12px !important;
  }
}
:deep(.van-tab--active) {
  background: linear-gradient(115deg, #cb4aed 40%, rgba(93, 62, 249, 0.5), rgba(13, 133, 245, 0.7));
}

:deep(.van-tabs__nav) {
  justify-content: center;
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 50px;
}
:deep(.van-tabs__wrap) {
  text-align: center;
}
</style>
