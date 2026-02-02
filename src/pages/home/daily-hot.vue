<template>
  <div :key="key" class="container">
    <dx-navbar class="my-nav-bar" :border="false" title="今日热点" left-arrow @click-right="showCalendar = true"
      @click-left="__.$Back">
      <template #right>
        <vue-calendar v-model="params.date"></vue-calendar>
      </template>
    </dx-navbar>
    <div class="scroll-container">
      <dx-hoc-list v-if="key" refresh-result class="dx-grid-2 pb-1.5" :api="__.$Api.Discover.daily_video"
        :params="params" :show-end="false">
        <template #banner="{ data }">
          <div class="daily_mv_title sticky top-0 bg-white">
            <img src="~/assets/image/discover/day_hot_bgi.png" />
            {{ data?.info?.title }}
          </div>
        </template>
        <template #item="{ item, items, index }">
          <stack-link :key="index" :list="items" :index="index">
            <div class="daily_mv_list_item">
              <div class="daily_mv_item_img relative">
                <dx-image :src="item.cover_thumb_url" />
                <dx-pay-type :coins="item.coins" class="absolute right-0.5 top-0.5"></dx-pay-type>
              </div>

              <div class="daily_mv_item_text mt-0.5 line-clamp-2">{{ item.title }}</div>
            </div>
          </stack-link>
        </template>
      </dx-hoc-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

function init_time() {
  return __.$Utils.formatDate(new Date(), 'yyyy-MM-dd')
}

const params = reactive({
  date: init_time(),
  size: 30
})

const showCalendar = ref(false)

const { key } = useKeepAlive({
  reset() {
    params.date = init_time()
  }
})
</script>

<style lang="postcss" scoped>
.daily_mv_title {
  display: flex;
  height: 0.96rem;
  justify-content: center;
  align-items: center;
  z-index: 9;
  color: #428af7;
  font-size: 0.42rem;
  font-weight: 500;

  img {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 3.4rem;
    height: 0.96rem;
  }
}

.daily_mv_item_text {
  font-size: 0.35rem;
  line-height: 1.3;
}

.daily_mv_item_img {
  height: 107px;
}
</style>
