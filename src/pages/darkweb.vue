<template>
  <div class="container">
    <!-- 顶部：搜索 + 导航tabs（和首页一致） -->
    <search-bar show-publish-button />
    <feature-tab />

    <!-- 已开通：展示暗网内容；未开通：展示引导页 -->
    <div v-if="canEnterDarkweb" class="dw-body">
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
        <van-tab v-for="(item, _index) in tabs" :key="_index" :title="item.name">
          <dx-hoc-list :api="item.api" :params="item.params">
            <template #header="{ data: headerData }">
              <div class="px-1.5">
                <dx-ads :items="headerData?.ads ?? []" :ad-key="item.id" :ad-name="item.name"></dx-ads>
              </div>
              <div class="darkweb_middle">
                <div v-for="(itemM, indexM) in headerData?.middle_data" :key="indexM" @click="navigateToDynamic(itemM)">
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

      <share-dialog v-model:show="share_dialog" :data="shareData"></share-dialog>
    </div>

    <div v-else class="dw-hero" @click="goRenewal">
      <div class="dw-bg" :style="{ backgroundImage: `url(${dwBg})` }" />

      <div class="dw-content">
        <img class="dw-title" :src="dwTitle" alt="" />

        <div class="dw-desc">
          <div class="dw-desc__main" v-html="safeDescHtml"></div>
        </div>

        <img class="dw-card" :src="dwTips" alt="" />
        <img class="dw-icon" :src="dwIcon" alt="" />

        <div class="dw-desc__tip" v-html="new_can_aw_tips_vip"></div>
        <img class="dw-btn" :src="dwBtn" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import dwBg from '@/assets/image/darkweb/dw-bg.png'
import dwBtn from '@/assets/image/darkweb/dw-btn.png'
import dwTips from '@/assets/image/darkweb/dw-tips.png'
import dwTitle from '@/assets/image/darkweb/dw-title.png'
import dwIcon from '@/assets/image/darkweb/dw-icon.png'
import type { TabItem } from '@types'

const { config } = storeToRefs(useGlobalStore())
const globalStore = useGlobalStore()
const __ = useNuxtApp()

const canEnterDarkweb = computed(() => config.value?.can_aw === 1)

const safeDescHtml = computed(() => {
  console.error('config.value: ', config.value)
  const html = (config.value?.new_can_aw_tips_title ?? '') as string
  // 这里沿用旧字段的富文本展示方式；若后端改为纯文本也能正常展示
  return html
})

const new_can_aw_tips_vip = computed(() => {
  console.error('config.value: ', config.value)
  const html = (config.value?.new_can_aw_tips_vip ?? '') as string
  // 这里沿用旧字段的富文本展示方式；若后端改为纯文本也能正常展示
  return html
})

// iOS/外部支付场景：回到页面时，权益可能仍是旧缓存；这里做一次节流同步
let lastSynchAt = 0
const maybeSynch = async () => {
  const now = Date.now()
  if (now - lastSynchAt < 5000) return
  lastSynchAt = now
  try {
    await globalStore.synch()
  } catch {}
}

onMounted(() => {
  maybeSynch()
})
onActivated(() => {
  maybeSynch()
})

const { activeTab, duration, updateDuration, updateActiveTab } = useDefaultActiveTab()
const { data, execute } = useMyFetch<TabItem[]>({
  api: __.$Api.Darkweb.index_aw,
  immediate: false,
  success() {
    updateActiveTab(tabs.value)
    updateDuration()
  }
})

const tabs = computed(() => (Array.isArray(data.value) ? data.value : []))

watch(
  canEnterDarkweb,
  val => {
    if (val) {
      execute()
    }
  },
  { immediate: true }
)

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

const goRenewal = () => {
  __.$NavigateTo('/renewal')
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  /* 占满布局主区高度，避免 min-height:100vh 撑高后带着搜索/tab 整体滚 */
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 暗网页只需要顶部 tab 行，不需要 feature-tab 的内容区；同时避免高度塌陷导致“看不到 tabs” */
.container :deep(.tab-container) {
  flex: none;
  overflow: visible;
}

.container :deep(.tab-container .van-tabs__content) {
  display: none;
}

.container :deep(.tab-container .van-tabs__wrap) {
  position: relative;
  z-index: 5;
}

.dw-hero {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 预留底部 tabbar 安全区 */
  padding-bottom: env(safe-area-inset-bottom);
}

.dw-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.dw-content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 18px 14px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.dw-title {
  margin-top: 6px;
  width: 92%;
  max-width: 380px;
  height: auto;
  display: block;
}

.dw-desc {
  margin-top: 14px;
  width: 92%;
  max-width: 380px;
  padding: 0;
  text-align: center;
  color: #fff;

  &__main {
    font-size: 13px;
    line-height: 1.65;
    word-break: break-word;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  &__subTitle {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  }

  &__vip {
    margin-top: 10px;
    color: #ff3b30;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  }
}

.dw-card {
  margin-top: 16px;
  width: 92%;
  max-width: 380px;
  height: auto;
  display: block;
}

.dw-btn {
  margin-top: 18px;
  width: 70%;
  max-width: 260px;
  height: auto;
  display: block;
}

.dw-body {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.dw-icon {
  margin-top: 40px;
  width: 135px;
  height: auto;
  display: block;
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

.dw-desc__tip {
  margin-top: 10px;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.5px;
}
</style>
