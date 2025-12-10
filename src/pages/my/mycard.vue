<template>
  <div class="container">
    <dx-tabs
      v-model:active="activeTab"
      class="dx-tabs primary-tabs"
      lazy-render
      animated
      swipeable
      @rendered="onRendered"
    >
      <van-tab title="可用">
        <scroll-list
          v-model:loading="videoLoading"
          position="static"
          :is-empty="videoEmpty"
          :is-end="videoEnd"
          :pullup="videoMore"
        >
          <div class="my-list">
            <card-item v-for="item in videos" :key="item.id" :item="item" :type="0"></card-item>
          </div>
        </scroll-list>
      </van-tab>

      <van-tab title="已使用">
        <scroll-list
          v-model:loading="manhuaLoading"
          position="static"
          :is-empty="manhuaEmpty"
          :is-end="manhuaEnd"
          :pullup="manhuaMore"
        >
          <div class="my-list">
            <card-item v-for="item in manhuas" :key="item.id" :item="item" :type="1"></card-item>
          </div>
        </scroll-list>
      </van-tab>
      <van-tab title="已过期">
        <scroll-list
          v-model:loading="imageLoading"
          position="static"
          :is-empty="imageEmpty"
          :is-end="imageEnd"
          :pullup="imageMore"
        >
          <div class="my-list">
            <card-item v-for="item in images" :key="item.id" :item="item" :type="2"></card-item>
          </div>
        </scroll-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref(0)

const __ = useNuxtApp()
const {
  listData: videos,
  loading: videoLoading,
  isEmpty: videoEmpty,
  isEnd: videoEnd,
  execute: videoMore
} = useFetchList({
  api: __.$Api.User.myMvTicket,
  params: {
    type: 'all'
  }
})

const {
  listData: manhuas,
  loading: manhuaLoading,
  isEmpty: manhuaEmpty,
  isEnd: manhuaEnd,
  execute: manhuaMore
} = useFetchList({
  api: __.$Api.User.myMvTicket,
  params: {
    type: 'used'
  }
})

const {
  listData: images,
  loading: imageLoading,
  isEmpty: imageEmpty,
  isEnd: imageEnd,
  execute: imageMore
} = useFetchList({
  api: __.$Api.User.myMvTicket,
  params: {
    type: 'timeout'
  }
})

const fetchMap = {
  '0': videoMore,
  '1': manhuaMore,
  '2': imageMore
}
const onRendered = (type: keyof typeof fetchMap) => {
  fetchMap[type]?.()
}
</script>

<style lang="less" scoped>
.my-list {
  padding: 0 16px;
}
</style>
