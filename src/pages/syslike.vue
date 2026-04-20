<template>
  <div class="grey-bg container">
    <scroll-list v-model:loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute">
      <div v-for="(item, indx) in listData" :key="indx" class="sys-comment-item-default">
        <div class="top-box">
          <dx-avatar :img="item?.user?.avatar_url" :size="1.3" />
          <div class="info">
            <div class="title">
              {{ item?.user?.nickname }}@
              <span class="subtitle">喜欢了你的视频</span>
            </div>
            <div class="text">
              {{ item?.created_at }}
            </div>
          </div>
        </div>
        <div class="video-box">
          <div class="title">
            {{ item?.mv?.title || '暂无' }}
          </div>
          <div class="video-img">
            <img v-lazyLoad="item?.mv?.cover_thumb_url" />
          </div>
        </div>
      </div>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const { listData, execute, loading, isEmpty, isEnd } = useFetchList({
  api: __.$Api.User.sysnotice,
  immediate: true,
  params: {
    type: 5
  }
})
</script>

<style lang="less" scoped>
@import '@styles/card.less';
</style>
