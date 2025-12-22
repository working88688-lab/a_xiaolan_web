<template>
  <van-swipe
    class="my-swipe-vertical"
    :stop-propagation="false"
    :touchable="false"
    autoplay="2500"
    :show-indicators="false"
    vertical
  >
    <van-swipe-item v-for="(banner, index) in props.data" :key="index" @click="onNavigateToTablent(banner, index)">
      <div class="tanlent swiper-no-swiping">
        <div class="tanlent_left">
          <div class="icon">
            <dx-image :src="banner.icon" no-bg />
          </div>
          <span>{{ banner.name }}</span>
        </div>
        <div class="tanlent_right">
          <div v-for="(item, iindex) in banner.item" :key="iindex" class="tanlent_right_avatar">
            <dx-image :src="item" class="tanlent_right_avatar_img" />
          </div>
          <img class="tanlent_right_avatar_icon" src="~/assets/image/discover/icon_see_more_more.png" />
        </div>
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<script setup lang="ts">
import type { BannerItem } from '@types'

const props = defineProps<{
  data?: BannerItem[]
  page?: string
  useIndex?: boolean
}>()

const _page = props.page || 'tablent'
const router = useRouter()
const onNavigateToTablent = (item: BannerItem, index: number) => {
  // if (props.useIndex) {
  router.push(`/${_page}?index=${index}`)
  // } else {
  //   __.$NavigateTo(`/${_page}?type=${item.type}`)
  // }
}
</script>

<style lang="less" scoped>
.my-swipe-vertical {
  height: 40px;
  overflow: hidden;
}
.no-hammers {
  width: 24px;
  height: 24px;
}
.tanlent {
  padding: 0 0.32rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tanlent_left {
    color: #000;
    .icon {
      margin-right: 0.26rem;
      display: inline-block;
      width: 0.64rem;
      height: 0.64rem;
      background-color: transparent;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      font-family: PingFangSC;
    }
  }
  .tanlent_right {
    display: flex;
    align-items: center;
    .tanlent_right_avatar_icon {
      width: 8px;
      height: 16px;
    }
    .tanlent_right_avatar {
      background-color: transparent;
      margin-right: 0.24rem;
      display: inline-block;
      vertical-align: middle;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      overflow: hidden;
    }
    .tanlent_right_avatar:nth-child(1) {
      border: 1px solid #ffe11a;
    }
    .tanlent_right_avatar:nth-child(2) {
      border: 1px solid #abb5bd;
    }
    .tanlent_right_avatar:nth-child(3) {
      border: 1px solid #dea56f;
    }
  }
}
</style>
