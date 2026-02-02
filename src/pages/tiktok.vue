<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'

import type { UserInfo, VideoItem } from '@types'

const __ = useNuxtApp()
const activeTab = ref(1)

const { mv_find_tab, dy_tab, mv_short_find_tab } = useGlobalStore()

const findTab = ref(mv_find_tab?.[0]?.name)

const hasFollow = dy_tab?.find?.(item => item.type === '1')

const hasDiscover = dy_tab?.find?.(item => item.type === '3')

const loading = ref(false)

const followApi = hasFollow
  ? __.$Api.createApi({
    url: hasFollow.api_list
  })
  : undefined

const params = ref({
  page: 1
})

const follow_users_list = ref<UserInfo[]>([])

const follow_mvs_list = ref<VideoItem[]>([])
const rec_users_list = ref<any[]>([])

const isEnd = ref(false)
const isEmpty = ref(false)

async function refreshList() {
  try {
    if (followApi && hasFollow) {
      isEnd.value = false
      loading.value = true
      params.value.page = 1
      const res = (await followApi({
        ...hasFollow.params_list,
        ...params.value
      })) as any
      params.value.page += 1

      const { follow_users, follow_mvs, rec_users } = res.data

      follow_users_list.value = [...follow_users]

      follow_mvs_list.value = [...follow_mvs]
      rec_users_list.value = [...rec_users]

      if (follow_mvs_list.value.length) {
        isEnd.value = follow_mvs.length === 0
        isEmpty.value = follow_mvs_list.value.length === 0
      } else {
        isEnd.value = rec_users.length === 0
        isEmpty.value = rec_users_list.value.length === 0
      }
    }
  } catch (error) {
    isEnd.value = true
  } finally {
    loading.value = false
  }
}
async function fetchList() {
  try {
    if (followApi && hasFollow) {
      loading.value = true
      const res = (await followApi({
        ...hasFollow.params_list,
        ...params.value
      })) as any
      params.value.page += 1
      const { follow_users, follow_mvs, rec_users } = res.data

      if (follow_users.length && !follow_users_list.value.length) {
        follow_users_list.value = [...follow_users]
      }
      if (follow_mvs.length || follow_mvs_list.value.length) {
        follow_mvs_list.value = [...follow_mvs_list.value, ...follow_mvs]
        isEnd.value = follow_mvs.length === 0
        isEmpty.value = follow_mvs_list.value.length === 0
      } else {
        rec_users_list.value = [...rec_users_list.value, ...rec_users]
        isEnd.value = rec_users.length === 0
        isEmpty.value = rec_users_list.value.length === 0
      }
    }
  } catch (error) {
    isEnd.value = true
  } finally {
    loading.value = false
  }
}

const hideTabs = ref(false)
provide('seekingHandler', (e: 'seeking' | 'auto') => [(hideTabs.value = e === 'seeking')])

const { key } = useKeepAlive({
  active() {
    fetchList()
  },
  reset() {
    activeTab.value = 1
  }
})

const { isPageActive } = usePageActive()
</script>

<template>
  <div :key="key" class="container">
    <dx-tabs v-if="key" v-model:active="activeTab" :class="{
      'is-fixed': activeTab === 1,
      'is-hidden': hideTabs
    }" class="tiktok-tabs" center>
      <template #right>
        <nuxt-link class="search-btn absolute right-2 top-1.5 pl-1.5" to="/search?_index=1">
          <div class="h-[20px] w-[20px]">
            <nuxt-icon filled name="tiktok/search" class="icon-search text-4xl" />
          </div>
        </nuxt-link>
      </template>

      <van-tab v-for="tab in dy_tab" :key="tab.name" :title="tab.name">
        <div v-if="tab.type === '1'" class="h-full pt-[46px]">
          <!--   :pullup="fetchList"  -->
          <scroll-list :loading="loading" :pull-down-refresh="refreshList" :is-end="isEnd" :is-empty="isEmpty">
            <template v-if="follow_mvs_list.length">
              <div class="px-1">
                <dx-scrollview-swiper v-if="follow_users_list.length" :key="follow_users_list.length">
                  <SwiperSlide v-for="item in follow_users_list" :key="item.uid" class="recommend-item">
                    <dx-link :to="`/userdetail?id=${item.uid}`" class="w-full text-center">
                      <div class="mb-0.5 !size-[46px]">
                        <dx-image round :src="item.avatar_url" />
                      </div>
                      <div class="w-full truncate text-sm">
                        {{ item.nickname }}
                      </div>
                    </dx-link>
                  </SwiperSlide>
                </dx-scrollview-swiper>
              </div>

              <div class="dx-grid-2 mt-1">
                <video-tiktok-item v-for="(item, index) in follow_mvs_list" :key="item.id" :list="follow_mvs_list"
                  :api="hasFollow?.api_list" :index="index" show-title field-path="data.follow_mvs" :item="item"
                  :params="{
                    page: params.page,
                    ...(hasFollow?.params_list ?? {})
                  }" />
              </div>
            </template>
            <div v-else class="grid grid-cols-1 gap-1">
              <div v-for="creator in rec_users_list" :key="creator.uid" class="user-list-item mx-1 bg-white px-1 pb-1">
                <user-item :item="creator">
                  <template #desc>
                    <div class="mt-[2px] flex items-center text-sm text-[#919191]">
                      <div class="mr-1">
                        点赞
                        <span class="text-mblue mr-0.5">{{ $Utils.formatNumber(creator.fabulous_count) }}</span>
                      </div>
                      <div class="mr-1">
                        粉丝
                        <span class="text-mblue mr-0.5">{{ $Utils.formatNumber(creator.fans_count) }}</span>
                      </div>
                      <div>
                        关注
                        <span class="text-mblue mr-0.5">{{ $Utils.formatNumber(creator.followed_count) }}</span>
                      </div>
                    </div>
                  </template>
                </user-item>
                <div v-if="creator.person_signnatrue" class="m-0 truncate">简介：{{ creator.person_signnatrue }}</div>

                <dx-scrollview-swiper v-if="creator.mv_list.length" class="mt-1">
                  <SwiperSlide v-for="(video, index) in creator.mv_list" :key="video.id"
                    class="mr-1 !w-[102px] last:mr-0">
                    <video-tiktok-item :key="video.id" show-title :list="creator.mv_list" :item="video"
                      :index="index" />
                  </SwiperSlide>
                </dx-scrollview-swiper>
              </div>
            </div>
          </scroll-list>
        </div>

        <tiktok-tab v-else-if="tab.type === '2'" :api="tab.api_list" :params="tab.params_list"
          :active="activeTab === 1 && isPageActive" />

        <div v-else class="h-full pt-[46px]">
          <dx-tabs v-model:active="findTab" line-width="0" line-height="0" class="first-no-padding h-full">
            <van-tab v-for="sortTab in mv_short_find_tab" :key="sortTab.name" v-bind="sortTab">
              <dx-hoc-list class="dx-grid-3 text-sm" :api="tab.api_list" :params="{
                ...tab.params_list,
                sort: sortTab.name,
                size: 12
              }">
                <template #item="{ item, items, index, page }">
                  <video-tiktok-item :key="item.id" show-title :item="item" :list="items" :api="hasDiscover?.api_list"
                    :index="index" field-path="data.list" :params="{
                      page: page.page,
                      sort: sortTab.name
                    }" />
                </template>
              </dx-hoc-list>
            </van-tab>
          </dx-tabs>
        </div>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  --progress-bar-bottom: 2px;

  .tiktok-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .icon-search {
    color: #141414;
  }

  :deep(.van-tabs__content) {
    /* height: 100%; */
    flex: 1;
  }

  :deep(.van-tab__panel) {
    height: 100%;

    .van-tabs {
      display: flex;
      flex-direction: column;

      .van-tabs__content {
        flex: 1;
      }
    }
  }
}

:deep(.tiktok-tabs) {
  &>.van-tabs__wrap {
    --van-tabs-card-height: 62px;
    position: fixed;

    left: auto;
    width: var(--device-width);
    z-index: 99;
    /* background-color: #000; */
  }
}

.tiktok-tabs.is-fixed {
  &> :deep(.van-tabs__wrap) {
    --van-tab-text-color: rgba(255, 255, 255, 0.7);

    .van-tab--active {
      color: #fff;
    }

    .icon-search {
      color: #fff;
    }
  }
}

.tiktok-tabs.is-hidden {
  &> :deep(.van-tabs__wrap) {
    opacity: 0;
  }
}

:deep(.tiktok-tabs > .van-tabs__wrap .van-tab) {
  padding-left: 16px;
  padding-right: 16px;
  margin: 0 5px;
}

.user-list-item {
  box-shadow: 0px 0px 25.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
}

.recommend-item {
  width: 50px;
  margin-right: 12px;

  &:last-child {
    margin-right: 0px;
  }
}
</style>
