<script setup lang="ts">
definePageMeta({
  keepalive: true
})

type AiNavItem = {
  id: number
  title: string
  icon: string
  cover?: string
  icon_new?: string
  route: string
  sort_num: number
  status: number
}

const __ = useNuxtApp()
const navItems = ref<AiNavItem[]>([])

function resolveAiPath(route: string) {
  // 后端给的是“路由标识”，这里映射到现有页面路径
  switch (route) {
    case 'ai_face':
      return '/ai/face'
    case 'ai_strip':
      return '/ai/undress'
    case 'ai_magic':
      return '/ai/magic'
    default: {
      if (!route) return '/ai'
      if (route.startsWith('/')) return route
      // 兜底：ai_xxx -> /ai/xxx
      return `/ai/${route.replace(/^ai_/, '')}`
    }
  }
}

function resolveBannerSrc(item: AiNavItem) {
  return item?.cover || item?.icon_new || item?.icon || ''
}

onMounted(async () => {
  try {
    const res: any = await __.$Api.AI.aiNav({})
    console.log('[ai_nav] raw response:', res)

    const list = (res?.data?.list ?? []) as AiNavItem[]
    console.log('[ai_nav] data.list:', list)

    navItems.value = (Array.isArray(list) ? list : [])
      .filter(i => Number(i?.status) === 1)
      .sort((a, b) => Number(b?.sort_num ?? 0) - Number(a?.sort_num ?? 0))
  } catch (e) {
    navItems.value = []
  }
})
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

          <!-- AI 功能入口（由接口返回） -->
          <div class="ai-index-banners">
            <nuxt-link v-for="item in navItems" :key="item.id" :to="resolveAiPath(item.route)" class="ai-index-banner">
              <dx-image no-bg fit="cover" :src="resolveBannerSrc(item)" :alt="item.title" class="ai-index-banner-img" />
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
