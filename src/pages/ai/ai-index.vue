<script setup lang="ts">
import aiBanner1 from '~/assets/image/ai-1.png'
import aiBanner2 from '~/assets/image/ai-2.png'
import aiBanner3 from '~/assets/image/ai-3.png'

definePageMeta({
  keepalive: true
})

const aiFacePath = '/ai/face'
const aiUndressPath = '/ai/undress'
const aiMagicPath = '/ai/magic'
</script>

<template>
  <div class="ai-index-page">
    <dx-container class="!block">
      <template #default>
        <div class="ai-index-content">
          <!-- 顶部广告区域：完全复用 /home/resource 的实现方式 -->
          <div class="ai-index-ads">
            <dx-hoc-list api="/api/image/index" fields="data" :pullup="false">
              <template #header="{ data }">
                <dx-resource-ads class="px-1.5" ad-key="images" ad-name="男色" :items="data?.ads ?? []" />
              </template>
            </dx-hoc-list>
          </div>

          <!-- 底部三张功能横图 -->
          <div class="ai-index-banners">
            <nuxt-link :to="aiFacePath" class="ai-index-banner">
              <img :src="aiBanner1" alt="AI换脸" class="ai-index-banner-img" />
            </nuxt-link>
            <nuxt-link :to="aiUndressPath" class="ai-index-banner">
              <img :src="aiBanner2" alt="AI去衣" class="ai-index-banner-img" />
            </nuxt-link>
            <nuxt-link :to="aiMagicPath" class="ai-index-banner">
              <img :src="aiBanner3" alt="AI魔法" class="ai-index-banner-img" />
            </nuxt-link>
          </div>
        </div>
      </template>
    </dx-container>
  </div>
</template>

<style scoped lang="postcss">
.ai-index-page {
  min-height: 100vh;
  background-color: #f5f5f7;
}

.ai-index-content {
  padding: 12px 12px 24px;
}

.ai-index-ads {
  margin-bottom: 12px;
}

.ai-index-banners {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-index-banner {
  overflow: hidden;
  border-radius: 8px;
}

.ai-index-banner-img {
  display: block;
  width: 100%;
  height: auto;
}
</style>
