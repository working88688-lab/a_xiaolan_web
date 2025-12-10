<!-- 
    desc: 首页
    date: 2024.03.27
-->
<template>
  <scroll-list>
    <!-- 轮播开始 start -->
    <dx-swipe :list="localState.banner" :stop-propagation="false" class="my-swipe"></dx-swipe>
    <!-- 轮播开始 end -->

    <!-- list start -->
    <div class="user-app-list" style="pointer-events: auto">
      <div class="user-app-list-title">
        <img src="/images/appcenter/icon_star_circle.png" />
        大家都在玩
      </div>
      <div v-for="item in localState.list" :key="item.id" class="user-app-list-item">
        <div class="user-app-list-item-head">
          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              background: transparent;
            "
          >
            <img v-lazyLoad="item.img_url" style="object-fit: cover; width: 100%; height: 100%; opacity: 1" />
          </div>
        </div>
        <div class="user-app-list-item-info">
          <p class="user-app-list-item-title">{{ item.title }}</p>
          <p class="user-app-list-item-subtitle">{{ item.clicked }}次下载</p>
          <div class="user-app-list-item-star">
            <img src="/images/appcenter/icon_star_yellow.png" />
            <img src="/images/appcenter/icon_star_yellow.png" />
            <img src="/images/appcenter/icon_star_yellow.png" />
            <img src="/images/appcenter/icon_star_yellow.png" />
            <img src="/images/appcenter/icon_star_yellow.png" />
          </div>
          <p class="user-app-list-item-descript">{{ item.description }}</p>
        </div>
        <div class="user-app-list-item-active">
          <div class="user-app-list-item-btn">
            <a target="_blank" :href="item.link_url" @click="onAppClick(item.id)">下载</a>
          </div>
        </div>
      </div>
    </div>
    <!-- list end -->
  </scroll-list>
</template>

<script setup lang="ts">
import type { BannerItem } from '@types'
// 类型

type ListItem = {
  id: number
  img_url: string
  title: string
  description: string
  clicked: number
  link_url: string
}
type localState = {
  banner: BannerItem[]
  list: ListItem[]
}

/**
 * 当前实例
 */
const __ = useNuxtApp()

/**
 * 状态声明
 */
const localState = reactive<localState>({
  banner: [],
  list: []
})
const getData = async () => {
  const { data } = await __.$Api.Home.appcenter()
  localState.banner = [...data.banner]
  localState.list = [...data.apps]
}

const onAppClick = (id: number) => {
  __.$Api.Home.appclick({
    id
  })
}
onBeforeMount(() => {
  getData()
})
</script>

<style lang="less" scoped>
.my-swipe {
  height: 132px;
}
.user-app-list {
  .user-app-list-title {
    padding: 1.2rem 0.45rem 0.2rem 0.45rem;
    font-size: 0.5rem;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;

    img {
      width: 0.5rem;
      height: auto;
      margin-right: 0.25rem;
    }
  }

  .user-app-list-item {
    padding: 0.45rem;
    display: flex;

    .user-app-list-item-head {
      width: 68px;
      height: 68px;

      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .user-app-list-item-info {
      flex: 1;
      padding: 0 8px;
      overflow: hidden;

      .user-app-list-item-title {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        color: #1a1a1a;
      }

      .user-app-list-item-subtitle {
        width: 100%;
        font-size: 12px;
        color: #777;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .user-app-list-item-star {
        padding: 4px 0;
        display: flex;
        align-items: center;

        img {
          width: 12px;
          margin-right: 4px;
        }
      }

      .user-app-list-item-descript {
        width: 100%;
        font-size: 12px;
        color: #999;
      }
    }

    .user-app-list-item-active {
      display: flex;
      align-items: center;

      .user-app-list-item-btn {
        padding: 4px 18px;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        font-size: 12px;
        color: #fff;
        background-image: linear-gradient(to right, #f19346, #ed685d);
        border-radius: 1rem;
        a {
          color: #fff;
        }
      }
    }
  }
}
</style>
