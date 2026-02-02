<script setup lang="ts">
const __ = useNuxtApp()

const { key, activeTab } = useKeepAlive({})
</script>
<template>
  <div :key="key" class="container">
    <dx-tabs v-model:active="activeTab" class="dx-tabs first-no-padding primary-tabs" lazy-render animated swipeable>
      <van-tab title="视频">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" api="api/chargeVideo/maiguo"
          :params="{ show_type: 0 }">
          <template #item="{ item, items, index }">
            <video-card :key="item.id" :list="items" :index="index" :item="item"></video-card>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="短视频">
        <dx-hoc-list v-if="key" class="dx-grid-3" api="api/chargevideo/maiguo" :params="{ show_type: 1 }">
          <template #item="{ item, items, index, page }">
            <video-tiktok-item :key="item.id" show-title :list="items" :index="index" :item="item"
              field-path="data.list" api="api/chargevideo/maiguo" :params="{
                page: page.page,
                show_type: 1
              }" />
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="片库">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.original.my_buy">
          <template #item="{ item, items, index }">
            <video-card :list="items" :index="index" :mv-type="2" :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, ...item, rating: item.play_count }"></video-card>
          </template>
        </dx-hoc-list>
      </van-tab>

      <van-tab title="合集">
        <dx-hoc-list v-if="key" class="dx-grid-1" :api="__.$Api.collect.my_buy">
          <template #item="{ item }">
            <collect-list-item :key="item.id" :item="item"></collect-list-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="动漫">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" api="api/cartoon/my_buy">
          <template #item="{ item, items, index }">
            <video-card :list="items" :index="index" :mv-type="3" :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, ...item, rating: item.play_count }"></video-card>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="漫画">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.buyedManhua">
          <template #item="{ item, items, index }">
            <comics-item :key="item.id" :item="item"></comics-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="男色">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.buyedImgage">
          <template #item="{ item, items, index }">
            <comics-item :key="item.id" page="images" :item="item"></comics-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="小说">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.buyedStory">
          <template #item="{ item, items, index }">
            <comics-item :key="item.id" page="story" :item="item"></comics-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="帖子">
        <dx-hoc-list v-if="key" fields="post" class="grid grid-cols-1 gap-1 px-1" :api="__.$Api.User.buyedPost">
          <template #item="{ item, items, index }">
            <post-item :key="item.id" show-original :item="item"></post-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="黄游">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" api="/api/porngame/list_buy">
          <template #item="{ item }">
            <game-item :key="item.id" :item="item"></game-item>
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>
