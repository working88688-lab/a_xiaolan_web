<script setup lang="tsx">
const __ = useNuxtApp()

const { key } = useKeepAlive({})
</script>

<template>
  <div :key="key" class="container">
    <dx-hoc-list v-if="key" class="px-1.5" :api="__.$Api.Home.hot_rank">
      <template #header="{ data }">
        <dx-ads :items="data?.banner ?? []"></dx-ads>
        <div v-if="data?.rank" class="my-1">
          <van-cell value="" to="/home/rank" is-link :border="false">
            <template #title>
              <div class="flex items-center">
                <dx-image no-bg class="mr-1 !h-[26px] !w-[26px]" :src="data.rank.icon"></dx-image>
                <span class="text-base7">创作达人</span>
              </div>
            </template>
          </van-cell>
          <scroll-x-view v-if="data.rank?.item?.length" class="mt-0.5" @touchmove.stop>
            <div class="relative flex items-center">
              <div
                v-for="(creator, index) in data.rank.item"
                :key="index"
                class="flex-col-center mr-1 w-[46px] overflow-hidden"
              >
                <dx-avatar
                  :size="1.2"
                  :uid="creator.uid"
                  :aff="creator.aff"
                  :is-creater="!!creator.auth_status"
                  :img="creator.avatar_url"
                  class="avatar-img"
                />
                <div class="w-full truncate text-mini">{{ creator.nickname }}</div>
              </div>
            </div>
          </scroll-x-view>
        </div>
      </template>

      <template #list="{ items }">
        <div class="px-1.5 pb-1">
          <div v-for="item in items" :key="item.uid">
            <van-cell
              :to="`/tag?_type=user&title=${item.nickname}&uid=${item.uid}`"
              :border="false"
              value="查看更多"
              is-link
            >
              <template #title>
                <div class="flex items-center">
                  <dx-avatar class="mr-1 flex-shrink-0" :img="item.avatar_url"></dx-avatar>
                  <span class="whitespace-nowrap font-medium text-base7">{{ item.nickname }}</span>
                  <img class="ml-0.5 h-auto !w-5" src="~/assets/image-icon/original.png" alt="" />
                </div>
              </template>
            </van-cell>

            <div v-if="item.mv_list?.length" @touchmove.stop>
              <scroll-x-view>
                <div class="flex items-center">
                  <div></div>
                  <video-card
                    v-for="(_item, index) in item.mv_list"
                    :key="_item.id"
                    class="img-container mr-1"
                    :list="item.mv_list"
                    :index="index"
                    :item="_item"
                    lines
                  ></video-card>
                </div>
              </scroll-x-view>
            </div>

            <dx-empty v-else description="暂无数据" :image-size="['5rem', '2.5rem']"></dx-empty>
          </div>
        </div>
      </template>
    </dx-hoc-list>
  </div>
</template>

<style lang="postcss" scoped>
:deep(.van-cell) {
  align-items: center;
  padding-left: 0;
  padding-right: 0;
}

.img-container {
  /* height: 162px; */
  width: 290px;
  :deep(.video-item-default) {
    height: 100%;
  }

  :deep(.img-box) {
    height: 164px;
  }
}
</style>
