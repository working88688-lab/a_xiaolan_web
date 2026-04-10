<template>
  <div class="community-page-root container relative">
    <dx-tabs
      ref="mainTabsRef"
      v-model:active="activeTab"
      shrink
      center
      swipeable
      class="main-tabs dx-tabs primary-tabs"
      line-width="30"
      animated
    >
      <van-tab title="关注" name="follow">
        <follow-tab :data="data"></follow-tab>
      </van-tab>
      <van-tab title="原创" name="recomment">
        <recomment-tab :loading="loading" :data="data" :topics="data.topic" @swipe="onSwipe"></recomment-tab>
      </van-tab>
      <van-tab title="同圈" name="scircle">
        <scircle-tab :loading="loading" :data="data" :topics="data.topic" @swipe="onSwipe"></scircle-tab>
      </van-tab>

      <van-tab title="求片" name="film">
        <film-tab></film-tab>
      </van-tab>
    </dx-tabs>
    <nuxt-link :to="`/search?_index=${search_index}`" class="search-button">
      <nuxt-icon name="search" filled class="icon-search !text-[20px] !text-[#141414]"></nuxt-icon>
    </nuxt-link>

    <community-nav-first-guide
      v-if="showCommunityNavGuide"
      :tabs-ref="mainTabsRef"
      @dismiss="onCommunityNavGuideDismiss"
    />
  </div>
</template>

<script setup lang="ts">
import type { BannerItem, ForumItem, TabItem } from '@types'
import { nextTick, onActivated } from 'vue'

const activeTab = ref('recomment')
const mainTabsRef = ref<{ $el?: HTMLElement } | null>(null)
const showCommunityNavGuide = ref(false)
const graphic = ref(0)
const __ = useNuxtApp()
const route = useRoute()
const { data, loading } = useMyFetch<{
  ads: BannerItem[]
  rank_list: any[]
  topic: ForumItem[]
  tab: TabItem[]
}>({
  api: __.$Api.Community.getHomeData,
  immediate: true
})

// const { listData } = useFetchList<ForumItem>({
//   api: __.$Api.Community.topics,
//   immediate: true
// })

const index_map = {
  recomment: 3,
  dating: 3,
  mh: 5,
  images: 6,
  story: 7
}

const search_index = computed(() => {
  // @ts-ignore
  return index_map[activeTab.value] ?? 0
})

const onSwipe = (index: string) => {
  activeTab.value = index
}

watch(
  () => route.query.tab,
  tab => {
    if (tab === 'scircle' || tab === 'follow' || tab === 'recomment' || tab === 'film') {
      activeTab.value = String(tab)
    }
  },
  { immediate: true }
)

function onCommunityNavGuideDismiss() {
  showCommunityNavGuide.value = false
}

async function maybeShowCommunityNavGuide() {
  if (!import.meta.client) return
  // 需求：进入「同圈」tab 时才展示新手提示
  if (activeTab.value !== 'scircle') return

  // 等 tabs ref 挂载完成，避免 iOS 上首次进来算不到位置
  await nextTick()
  if (!mainTabsRef.value) return
  showCommunityNavGuide.value = true
}

onMounted(() => {
  void maybeShowCommunityNavGuide()
})

onActivated(() => {
  void maybeShowCommunityNavGuide()
})

watch(
  () => activeTab.value,
  () => {
    void maybeShowCommunityNavGuide()
  }
)
</script>
<style lang="postcss" scoped>
.search-button {
  flex-shrink: 0;
  position: absolute;
  right: 0;
  padding: 10px 10px 10px 10px;
}
</style>
