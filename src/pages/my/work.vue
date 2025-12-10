<template>
  <div class="container">
    <div class="scroll-container">
      <dx-tabs
        v-model:active="nav_tab"
        center
        shrink
        swipeable
        line-width="0"
        title-active-color="#333"
        line-height="0"
        class="main-tabs dx-tabs first-no-padding primary-tabs"
      >
        <template #left>
          <van-icon name="arrow-left" class="!absolute left-0 p-1 !text-2xl" @click="__.$Back"></van-icon>
        </template>
        <template #right>
          <span v-show="nav_tab === 0" class="!absolute right-0 flex items-center p-1" @click="onTips">
            <nuxt-icon name="upload" class="!text-2xl"></nuxt-icon>
            上传管理
          </span>
        </template>
        <van-tab title="视频">
          <dx-tabs v-model:active="video_tab" class="dx-tabs primary-tabs" animated swipeable>
            <van-tab title="上架中">
              <div key="search" class="sticky top-0 z-10 bg-white">
                <van-search
                  v-model="search_value"
                  class="!text-sm"
                  shape="round"
                  placeholder="输入标题关键字搜索作品"
                ></van-search>
              </div>
              <dx-hoc-list v-if="key" class="px-1" :filter="filter" :api="__.$Api.Video.release">
                <template #item="{ item }">
                  <div class="mb-1 flex items-center">
                    <video-item-cover
                      :key="item.id"
                      class="flex-1"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
                    <div class="ml-1 flex flex-1 flex-col gap-1">
                      <div>{{ item.title }}</div>
                      <div class="text-myellow">{{ item.coins }}金币</div>
                      <div class="text-base2">{{ item.created_str }}</div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="待审核">
              <dx-hoc-list v-if="key" class="px-1" :params="{ status: 0 }" :api="__.$Api.Video.wait">
                <template #item="{ item }">
                  <div class="mb-1 flex items-center">
                    <video-item-cover
                      :key="item.id"
                      class="flex-1"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
                    <div class="ml-1 flex flex-1 flex-col gap-1">
                      <div>{{ item.title }}</div>
                      <div class="text-myellow">{{ item.coins }}金币</div>
                      <div class="text-base2">{{ item.created_str }}</div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="未通过">
              <dx-hoc-list v-if="key" class="px-1" :api="__.$Api.Video.reject">
                <template #item="{ item }">
                  <div class="mb-1 flex items-center">
                    <video-item-cover
                      :key="item.id"
                      class="flex-1"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
                    <div class="ml-1 flex flex-1 flex-col gap-1">
                      <div>{{ item.title }}</div>
                      <div class="text-myellow">{{ item.coins }}金币</div>
                      <div class="text-base2">{{ item.created_str }}</div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="已下架">
              <dx-hoc-list v-if="key" class="px-1" :api="__.$Api.Video.hide">
                <template #item="{ item }">
                  <div class="mb-1 flex items-center">
                    <video-item-cover
                      :key="item.id"
                      class="flex-1"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
                    <div class="ml-1 flex flex-1 flex-col gap-1">
                      <div>{{ item.title }}</div>
                      <div class="text-myellow">{{ item.coins }}金币</div>
                      <div class="text-base2">{{ item.created_str }}</div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
          </dx-tabs>
        </van-tab>
      </dx-tabs>
    </div>
    <div v-show="nav_tab === 0" class="px-3 py-1.5">
      <dx-button block @click="onTips">发布视频</dx-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const nav_tab = ref(0)

const video_tab = ref(0)
const route = useRoute()
const search_value = ref('')

const filter = (item: any) => {
  console.log('item: ', item)
  return item.title.includes(search_value.value)
}

const init_active_tab = () => {
  return Number(route.query._index) || 0
}
const { key, activeTab: active_tab } = useKeepAlive({
  reset: () => {
    active_tab.value = 0
    nav_tab.value = 0
    video_tab.value = 0
  },
  defaultActiveTab: init_active_tab(),

  effect() {
    const index = init_active_tab()
    nav_tab.value = index ? 1 : 0
    active_tab.value = index
  }
})

const onTips = async () => {
  const res = await __.$Alert({
    message: '请下载安卓APP使用发布视频和视频管理！'
  })

  if (res === 'confirm') {
    __.$Utils.onWinOpen(__.$Store.global.config.share_url)
  }
}
</script>

<style lang="postcss" scoped>
.main-tabs > :deep(.van-tabs__wrap) {
  .van-tabs__nav {
    align-items: center;
  }
  .van-tab__text {
    transition: all 0.2s;
  }
  .van-tab--active {
    .van-tab__text {
      font-size: 17px;
    }
  }
}
</style>
