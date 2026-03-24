<template>
  <div class="container">
    <dx-tabs
      v-model:active="activeTab"
      shrink
      :duration="duration"
      swipeable
      class="dx-tabs primary-tabs"
      lazy-render
      line-width="30"
      animated
    >
      <van-tab v-for="(item, _index) in data" :key="_index" :title="item.name">
        <dx-hoc-list :api="item.api" :params="item.params">
          <template #header="{ data }">
            <div class="px-1.5">
              <dx-ads :items="data?.ads ?? []" :ad-key="item.id" :ad-name="item.name"></dx-ads>
            </div>
            <div class="darkweb_middle">
              <div v-for="(itemM, indexM) in data?.middle_data" :key="indexM" @click="navigateToDynamic(itemM)">
                <dx-image class="darkweb_middle_img" :src="itemM?.cover_full" no-bg />
              </div>
            </div>
          </template>
          <template #item="{ item: _item, items, index }">
            <feature-item
              :key="index"
              :index="index"
              :list="items"
              :stack-key="`dark-web_${index}`"
              :data="_item"
              @share="openShareDialog"
            ></feature-item>
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
    <div v-show="config.can_aw === 0" v-link="`/renewal`" class="darkweb-mask cursor-pointer">
      <div class="darkweb-mask_tips" v-html="config.can_aw_tips"></div>
    </div>
    <!-- 分享弹框 -->
    <share-dialog v-model:show="share_dialog" :data="shareData"></share-dialog>
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from '@types'

const { activeTab, duration, updateDuration, updateActiveTab } = useDefaultActiveTab()
const __ = useNuxtApp()
const { config } = storeToRefs(useGlobalStore())
const { data } = useMyFetch<TabItem[]>({
  api: __.$Api.Darkweb.darkWebInfo,
  immediate: true,
  success() {
    updateActiveTab(data.value)
    updateDuration()
  }
})
const shareData = ref()
const share_dialog = ref(false)
const openShareDialog = (_data: any) => {
  share_dialog.value = true
  shareData.value = _data
}

const navigateToDynamic = (item: TabItem) => {
  __.$Store.dynamic.setTab(item)
  __.$NavigateTo('/dark-card')
}
</script>
<style lang="less">
.darkweb-mask::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.darkweb-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  &_tips {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    font-size: 14px;

    font {
      margin-top: 0.5rem;
      padding: 0.2rem 0.3rem;
      font-size: 0.35rem;
      background-color: #4b8af7;
      color: #fff;
      border-radius: 5px;
    }
  }
}
</style>
<style lang="less" scoped>
.container {
  position: relative;
}

.dx-tabs > :deep(.van-tabs__wrap .van-tabs__nav) {
  justify-content: center;
}

.dx-tabs > :deep(.van-tabs__wrap .van-tabs__line) {
  background: linear-gradient(to left, #6de6fb, #428af7);
}

.darkweb_middle {
  margin-top: 4px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.darkweb_middle_img {
  width: 110px !important;
  height: 55px !important;
  margin-left: 12px;
  margin-bottom: 12px;
}
</style>
