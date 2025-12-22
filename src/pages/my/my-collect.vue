<script setup lang="ts">
const __ = useNuxtApp()

const { key, activeTab } = useKeepAlive({})
</script>
<template>
  <div :key="key" class="container">
    <dx-tabs v-model:active="activeTab" class="dx-tabs first-no-padding primary-tabs" lazy-render animated swipeable>
      <van-tab title="视频">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.mycVides">
          <template #item="{ item, items, index }">
            <video-card :key="item.id" :list="items" :index="index" :item="item"></video-card>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="片库">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.original.like_list">
          <template #item="{ item, items, index }">
            <video-card
              :list="items"
              :index="index"
              :mv-type="2"
              :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, ...item, rating: item.play_count }"
            ></video-card>
          </template>
        </dx-hoc-list>
      </van-tab>

      <van-tab title="合集">
        <dx-hoc-list v-if="key" class="dx-grid-1" :api="__.$Api.collect.my_like">
          <template #item="{ item, index }">
            <collect-list-item :key="item.id" :item="item"></collect-list-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="动漫">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" api="api/cartoon/like_list">
          <template #item="{ item, items, index }">
            <video-card
              :list="items"
              :index="index"
              :mv-type="3"
              :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, ...item, rating: item.play_count }"
            ></video-card>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="漫画">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.mycManhua">
          <template #item="{ item }">
            <comics-item :key="item.id" :item="item"></comics-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="美男">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.mycImage">
          <template #item="{ item }">
            <comics-item :key="item.id" page="images" :item="item"></comics-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="小说">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" :api="__.$Api.User.mycStory">
          <template #item="{ item }">
            <comics-item :key="item.id" page="story" :item="item"></comics-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="帖子">
        <dx-hoc-list v-if="key" fields="post" class="grid grid-cols-1 gap-1 px-1" :api="__.$Api.User.mycPost">
          <template #item="{ item }">
            <post-item :key="item.id" show-original :item="item"></post-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="黄游">
        <dx-hoc-list v-if="key" class="grid grid-cols-2 gap-1 px-1" api="/api/porngame/list_favorite">
          <template #item="{ item }">
            <game-item :key="item.id" :item="item"></game-item>
          </template>
        </dx-hoc-list>
      </van-tab>
      <van-tab title="直播">
        <dx-hoc-list class="dx-grid-2" api="api/live/list_favorite">
          <template #item="{ item }">
            <live-item :key="item.id" :item="item" />
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>
