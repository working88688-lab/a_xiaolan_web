<template>
  <div class="container relative">
    <dx-tabs v-model:active="activeTab" shrink center swipeable class="main-tabs dx-tabs primary-tabs" line-width="30"
      animated>
      <van-tab title="关注" name="follow">
        <follow-tab :data="data"></follow-tab>
      </van-tab>
      <van-tab title="原创" name="recomment">
        <recomment-tab :loading="loading" :data="data" :topics="data.topic" @swipe="onSwipe"></recomment-tab>
      </van-tab>

      <van-tab title="求片" name="film">
        <film-tab></film-tab>
      </van-tab>
    </dx-tabs>
    <nuxt-link :to="`/search?_index=${search_index}`" class="search-button">
      <nuxt-icon name="search" filled class="icon-search !text-[20px] !text-[#141414]"></nuxt-icon>
    </nuxt-link>
    <div class="float-btn">
      <publish-popup>
        <img src="~/assets/image/community/addFeedButton.svg" alt="" />
      </publish-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BannerItem, ForumItem, TabItem } from '@types'

const activeTab = ref('recomment')
const graphic = ref(0)
const __ = useNuxtApp()
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
</script>
<style lang="postcss">
.float-btn {
  position: absolute;
  width: 56px;
  height: 56px;
  right: 16px;
  bottom: 100px;
  cursor: pointer;
}
</style>
<style lang="postcss" scoped>
.search-button {
  flex-shrink: 0;
  position: absolute;
  right: 0;
  padding: 10px 10px 10px 10px;
}
</style>
