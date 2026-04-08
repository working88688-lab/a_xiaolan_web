<template>
  <div class="container">
    <!-- 顶部：搜索 + 导航tabs（和首页一致） -->
    <search-bar show-publish-button />
    <feature-tab />

    <!-- 中间区域：暗网引导页（铺满、无圆角） -->
    <div class="dw-hero" @click="goRenewal">
      <div class="dw-bg" :style="{ backgroundImage: `url(${dwBg})` }" />

      <div class="dw-content">
        <img class="dw-title" :src="dwTitle" alt="" />

        <div class="dw-desc">
          <div class="dw-desc__main" v-html="safeDescHtml"></div>
          <!-- <div v-if="tipsTitle" class="dw-desc__subTitle">{{ tipsTitle }}</div> -->
          <!-- <div v-if="tipsVip" class="dw-desc__vip">{{ tipsVip }}</div> -->
        </div>

        <img class="dw-card" :src="dwTips" alt="" />
        <img class="dw-btn" :src="dwBtn" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dwBg from '@/assets/image/darkweb/dw-bg.png'
import dwBtn from '@/assets/image/darkweb/dw-btn.png'
import dwTips from '@/assets/image/darkweb/dw-tips.png'
import dwTitle from '@/assets/image/darkweb/dw-title.png'

const { config } = storeToRefs(useGlobalStore())
const __ = useNuxtApp()

const safeDescHtml = computed(() => {
  const html = (config.value?.can_aw_tips ?? '') as string
  // 这里沿用旧字段的富文本展示方式；若后端改为纯文本也能正常展示
  return html
})

const tipsTitle = computed(() => (config.value as any)?.new_can_aw_tips_title as string | undefined)
const tipsVip = computed(() => (config.value as any)?.new_can_aw_tips_vip as string | undefined)

const goRenewal = () => {
  __.$NavigateTo('/renewal')
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  width: 100%;
  overflow: hidden;
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
  width: 100%;
  padding: 18px 14px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
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
</style>
