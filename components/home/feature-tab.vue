<!-- 
    desc: 首页列表
    date: 2024.03.27
-->
<template>
  <div class="tab-container">
    <dx-tabs v-model:active="activeTab" :duration="duration" class="dx-tabs primary-tabs first-no-padding">
      <van-tab v-for="(tab, index) in tabState.tabs" :key="index" :title="tab.name">
        <template v-if="Math.abs(activeTab - index) <= 5">
          <discover-tab v-if="tab.type === 2" :tab="tab"></discover-tab>
          <vip-tab-item v-else-if="tab.type === 1" :tab="tab" @share="openShareDialog"></vip-tab-item>
          <dx-webview v-else-if="tab.type === 3" :key="tab.h5_url" :url="tab.h5_url"></dx-webview>
          <feature-tab-item v-else :tab="tab" @share="openShareDialog"></feature-tab-item>
        </template>
      </van-tab>
    </dx-tabs>

    <div class="category-container">
      <div class="linear-bg"></div>
      <img v-link="`/category`" class="category" role="button" src="~/assets/image/home/categoryIcon.png" alt="" />
    </div>
  </div>

  <!-- 分享弹框 -->
  <share-dialog v-model:show="shareDialogVisiable" :data="shareData"></share-dialog>
</template>

<script setup lang="ts">
import type { TabItem } from '@types'

/**
 * 当前实例
 */
const __ = useNuxtApp()

const { activeTab, duration, updateDuration, updateActiveTab } = useDefaultActiveTab({
  defaultActive: 1
})

const shareData = ref()
const shareDialogVisiable = ref(false)
const tabState = reactive({
  tabs: [] as unknown as TabItem[]
})

const openShareDialog = (_data: any) => {
  shareDialogVisiable.value = true
  shareData.value = { ..._data }
}

// 数据tabs获取
const getTabs = async () => {
  try {
    const { data } = await __.$Api.Home.tab()

    tabState.tabs = data
    updateActiveTab(data)
  } catch (error) {
  } finally {
    updateDuration()
  }
}

onBeforeMount(getTabs)
</script>

<style lang="postcss" scoped>
.linear-bg {
  position: absolute;
  left: -22px;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to left, white 30%, rgba(255, 255, 255, 0) 100%);
}

.category-container {
  padding: 4px;
  position: absolute;
  right: 6px;
  top: 5px;
  background: #fff;

  .category {
    width: 22px;
    height: 22px;
    z-index: 1;
    position: relative;
  }
}

.tab-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.my-swipe {
  width: 100%;
  height: 100%;
}

.primary-tabs> :deep(.van-tabs__wrap) {
  padding-right: 30px;
}

.my-swipe.my-top-swipe {
  height: 132px;
}

.primary-tabs> :deep(.van-tabs__nav--line) {
  height: initial;
}

.primary-tabs :deep(.van-tab) {
  line-height: 44px;
}

.tab-container {
  position: relative;
}
</style>
