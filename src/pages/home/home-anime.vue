<script setup lang="tsx">
const tabsMap = {
  mh: {
    api: '/api/manhua/index',
    type: 'comics',
    title: '漫画'
  },
  xs: {
    api: '/api/story/index',
    type: 'story',
    title: '小说'
  }
}

const { data, loading } = useMyFetch<{
  nm_conf: {
    list: Array<{
      name: string
      type: 'mh' | 'xs' | 'dm'
    }>
  }
}>({
  api: '/api/system/nav_conf',
  immediate: true
})

const { key, activeTab } = useKeepAlive({})
</script>

<template>
  <div :key="key" class="container">
    <dx-tabs v-if="key" v-model:active="activeTab" line-width="0" line-height="0" center class="dx-tabs">
      <template #bottom>
        <dx-spin v-if="loading"></dx-spin>
      </template>
      <template #left>
        <nuxt-icon class="!absolute left-0 top-0 p-1.5 text-4xl" name="arrow-left" @click="$router.back"></nuxt-icon>
      </template>
      <van-tab v-for="tab in data.nm_conf?.list" :key="tab.type" :title="tab.name">
        <template v-if="tab.type === 'dm'">
          <dx-hoc-list api="api/cartoon/construct" :start-refresh-empty-data="false">
            <template #header="{ data }">
              <dx-ads class="px-1" :items="data?.ads" :ad-key="tab.type" :ad-name="tab.name" />
              <div class="mt-2 grid grid-cols-4 gap-1 px-1">
                <dx-link v-for="item in data?.icon" :key="item.key"
                  :to="`/home/cartoon-cate?key=${item.key}&type=${item.type}`" class="flex-col-center">
                  <dx-image class="!h-[37px] !w-[82px]" :src="item.icon"></dx-image>
                  <span>{{ item.name }}</span>
                </dx-link>
              </div>
            </template>
            <template #item="{ item }">
              <div v-if="item.list.length > 0" :key="item.id">
                <van-cell class="!sticky left-0 top-[-2px] z-10" :border="false" :clickable="false" :to="`/tag?_type=anime&${format_url_params({
                  has_sort: 1,
                  api: item.more_api,
                  title: item.title,
                  ...item.api_params
                })}`" is-link>
                  <template #title>
                    <div class="flex items-center whitespace-nowrap">
                      <span class="mr-0.5 text-xl font-semibold">{{ item.title }}</span>
                      <span class="text-mgary text-mini">{{ item.sub_title }}</span>
                    </div>
                  </template>
                </van-cell>
                <div class="dx-grid-2 pb-0.5">
                  <video-card v-for="card in item.list" :key="card.id" :mv-type="3" lines :show-duration="false"
                    :item="{ cover_thumb_url: card.cover_full, rating: card.play_count, ...card }" />
                </div>
              </div>
            </template>
          </dx-hoc-list>
        </template>
        <template v-else>
          <graphic-image-item :key="tab.type" v-bind="tabsMap[tab.type]"></graphic-image-item>
        </template>
      </van-tab>
    </dx-tabs>
  </div>
</template>
