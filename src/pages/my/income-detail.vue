<template>
  <div class="container">
    <dx-hoc-list
      v-if="is_video_type"
      :api="__.$Api.Video.videoIncomeList"
      :params="{
        vid: route.query.id
      }"
      class="px-1"
      :show-end="false"
      :refresh="false"
      :pullup="false"
      :list-props="{
        emptyTip: '暂无明细'
      }"
    >
      <template #header>
        <div class="mb-2 flex items-center">
          <video-item-cover
            class="flex-1"
            :views="cache_data.rating"
            :poster="cache_data.cover_thumb_url"
            :height="2.75"
            :duration="cache_data.duration_str"
          ></video-item-cover>
          <div class="ml-1 flex flex-1 flex-col gap-1">
            <div>{{ cache_data.title }}</div>
            <div class="text-myellow">总收益：{{ cache_data.coins }}金币</div>
          </div>
        </div>
      </template>
      <template #item="{ item }">
        <div class="mb-1 flex">
          <div class="flex items-center">
            <dx-avatar :size="1.2" :img="item.with_user.avatar_url"></dx-avatar>
            <div class="ml-0.5 text-sm text-base2">
              <div>{{ item.with_user.nickname }}</div>
              <div>{{ item.add_time_str }}</div>
            </div>
          </div>
          <span class="ml-auto text-sm text-myellow">+{{ item.totalcoin }}男票</span>
        </div>
      </template>
    </dx-hoc-list>
    <dx-hoc-list
      v-else
      :api="__.$Api.User.unlockList"
      :params="{
        id: route.query.id
      }"
      class="px-1"
      :show-end="false"
      :refresh="false"
      :pullup="false"
      :list-props="{
        emptyTip: '暂无明细'
      }"
    >
      <template #header>
        <div class="mb-2 flex items-center">
          <video-item-cover class="flex-1" :poster="cache_data.medias[0]?.cover_url_full" :height="2.75">
            <template #views>
              <span>{{ cache_data.reward_num }}次购买</span>
            </template>
            <template #duration>
              <span>{{ cache_data.favorite_num }}次收藏</span>
            </template>
          </video-item-cover>
          <div class="ml-1 flex flex-1 flex-col gap-1">
            <div>{{ cache_data.title }}</div>
            <div class="text-myellow">总收益：{{ cache_data.reward_amount }}金币</div>
          </div>
        </div>
      </template>
      <template #item="{ item }">
        <div class="mb-1 flex">
          <div class="flex items-center">
            <dx-avatar :size="1.2" :img="item.thumb_url_full"></dx-avatar>
            <div class="ml-0.5 text-sm text-base2">
              <div>{{ item.aff_nickname }}</div>
              <div>{{ item.created_at }}</div>
            </div>
          </div>
          <span class="ml-auto text-sm text-myellow">+{{ item.amount }}男票</span>
        </div>
      </template>
    </dx-hoc-list>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const __ = useNuxtApp()

const cache_data = computed(() => {
  return __.$Store.dynamic.cache as any
})

const is_video_type = computed(() => {
  return route.query.type === '1'
})
</script>

<style scoped></style>
