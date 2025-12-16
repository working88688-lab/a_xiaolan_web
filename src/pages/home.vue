<!-- 
    desc: 首页
    date: 2024.03.27
-->
<template>
  <div ref="container" class="container">
    <!-- 搜索  start-->
    <search-bar show-publish-button></search-bar>
    <!-- 搜索  end-->
    <!-- 轮播列表 start -->
    <feature-tab></feature-tab>
    <!-- 轮播列表 end -->
  </div>

  <!-- gif广告 start-->
  <ActivityPopup v-for="(item, index) in config.pop_ads_v2" :key="index" :item="item"
    :show="!hasShowHomeNotice && showAd && adsShowIndex === index" class="active-dialog" :close-on-click-overlay="false"
    @close="onActivitylDialogClose" />
  <!-- gif广告 end-->
  <!-- 16宫格 -->
  <activity-popup v-if="config.apps?.length" :item="config.apps" :type="2" :show="show_16_grid_ad" class="active-dialog"
    :close-on-click-overlay="false" @close="on_grid_ad_close" />
  <!-- 官方消息dialog start-->
  <OfficialDialog v-model:show="officialNewsDialogVisiable" class="offical-dialog" title="官方消息" :lock-scroll="false"
    close-on-click-overlay :content="config.maintain_tips" @close="onNavgaToAppCenter"
    @confirm="onOfficailDialogClose" />
  <!-- 官方消息dialog end-->

  <!--  浮动广告 -->
  <!-- <dx-float-ad :items="config.floating_ads"></dx-float-ad> -->
  <!-- 充值广告 -->
  <dx-recharge-ads :config="config.activity || {}"></dx-recharge-ads>
</template>

<script setup lang="ts">
definePageMeta({
  keepalive: true //设置为keepAlive
})
/**
 * 当前实例
 */

const __ = useNuxtApp()
const showAd = ref(true)
const globalStore = useGlobalStore()
const show_16_grid_ad = ref(false)
const { config, hasShowHomeNotice } = storeToRefs(globalStore)
/**
 * 状态声明
 */

const officialNewsDialogVisiable = ref(false)
const adsShowIndex = ref(0)

//事件
const onOfficailDialogClose = () => {
  officialNewsDialogVisiable.value = false
}
const onActivitylDialogClose = () => {
  adsShowIndex.value += 1
  if (adsShowIndex.value === config.value.pop_ads_v2?.length) {
    adsShowIndex.value += 1
    if (config.value.apps?.length) {
      show_16_grid_ad.value = true
    } else if (globalStore.config.maintain_tips) {
      globalStore.updateHomeNoticeStatus()
      setTimeout(() => {
        officialNewsDialogVisiable.value = true
      }, 300)
    }
  }
}
function on_grid_ad_close() {
  show_16_grid_ad.value = false
  if (globalStore.config.maintain_tips) {
    globalStore.updateHomeNoticeStatus()
    setTimeout(() => {
      officialNewsDialogVisiable.value = true
    }, 300)
  }
}
// 更新菜单(底部)
const onNavgaToAppCenter = () => {
  officialNewsDialogVisiable.value = false
  nextTick(() => {
    __.$NavigateTo(`app-center`)
  })
}

// 初始入口
onBeforeMount(async () => {
  // 邀请码
  if (globalStore.affCode) {
    __.$Api.User.invitation({
      aff: globalStore.affCode
    })
  }

  if (!globalStore.config.pop_ads_v2?.length) {
    if (globalStore.config.apps.length) {
      show_16_grid_ad.value = true
    } else if (globalStore.config.maintain_tips) {
      officialNewsDialogVisiable.value = true
    }
  }
})

onDeactivated(() => {
  showAd.value = false
})

onActivated(() => {
  showAd.value = true
})
</script>

<style lang="postcss" scoped>
.container {
  --van-tabs-nav-background: transparent;
}
</style>
