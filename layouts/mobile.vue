<!-- 
    desc: 通用布局
    date: 2023.03.20
-->
<template>
  <!-- 通用布局 start -->
  <div id="xblue-container" :style="pageTheme" class="van-safe-area-top">
    <!-- 头部导航 start -->
    <div v-if="top" class="xblue-header">
      <xblue-mobile-topbar></xblue-mobile-topbar>
    </div>
    <!-- 头部导航 end -->

    <!-- 缓存页面 start -->
    <div class="xblue-main" :class="{ header: top, footer: bottom, 'header-footer': top && bottom }">
      <div class="main-container">
        <slot />
      </div>
      <dx-open-app v-if="!showOpenApp" v-show="bottom" />
    </div>
    <!-- 缓存页面 end -->

    <!-- 底部导航 start -->
    <div class="main-footer">
      <xblue-mobile-tabbar v-show="bottom" class="van-safe-area-bottom"></xblue-mobile-tabbar>
    </div>
    <!-- 底部导航 end -->

    <!-- 购买提示弹框 -->
    <dx-buy-popup v-model:show="show_buy" v-bind="payConfig" @pay:success="payConfig.onPay" />
    <dx-share-popup v-model:show="show_share" :type="payConfig.vip_type || payConfig.type" show-cancel />
  </div>
</template>

<script lang="ts" setup>
const _route = useRoute()

const showOpenApp = import.meta.env.DEV

const top = computed(() => {
  return Reflect.has(_route?.meta ?? {}, 'title')
})
const bottom = computed(() => _route?.meta?.bottom ?? false)

const pageTheme = computed(() => {
  return _route?.meta?.theme?.page ?? {}
})
const payConfig = ref({
  type: 'mv'
} as any)

const { on_buy, show_buy, show_share } = useBuy()
useEmitterListener('pay', _config => {
  payConfig.value = {
    ..._config
  }
  on_buy(_config._type === 2)
})
</script>

<style lang="less" scoped>
#xblue-container {
  display: flex;
  flex-direction: column;
  background-color: var(--dx-container-color);
  width: 100%;
  height: 100%;
  z-index: 1;
  max-width: var(--device-width);
  background-image: url(@/assets/image/banner.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: contain;

  .xblue-header {
    background-color: var(--default-background-color);
  }

  .xblue-main {
    width: 100%;
    overflow: auto;
    height: 100%;
    flex: 1;
    position: relative;

    .main-container {
      width: 100%;
      height: 100%;
    }

    .main-footer {
      background-color: var(--auxiliary-background-color);
    }
  }
}

// 底部导航 start
.van-tabbar-item__icon img {
  width: 2.55rem;
  height: 2.55rem;
}

// 底部导航 end
</style>
