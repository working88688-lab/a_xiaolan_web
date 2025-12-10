<template>
  <div :key="topic_id" class="container">
    <div v-show="!loading" class="collection-header">
      <div class="collection-video-info">
        <div class="video-cover">
          <dx-image :src="data.info?.image_url" />
        </div>
        <div class="video-info">
          <p>{{ data.info?.title }}</p>
          <div class="collection-user">
            <div class="avatar"><dx-image :src="data.info?.user?.avatar_url" /></div>
            <div class="nickname">{{ data.info?.user?.nickname }}</div>
          </div>
          <div class="text-base3">
            <span>{{ $Utils.formatNumber(data?.info?.like_count) }}人喜欢 ·</span>
            <span class="time">共{{ data.info?.video_count }}集</span>
          </div>
        </div>
      </div>
      <div class="collection-desp-container">
        <span class="collection-desp">合集详情：</span>
        <span class="collection-desp" v-html="data.info?.desp?.replaceAll('\n', '<br/>')"></span>
      </div>
      <div class="flex gap-1">
        <dx-button :round="false" class="flex-1" @click="toggle">
          <van-icon name="star" size="0.5rem" class="mr-0.5" :color="data.info?.is_like ? '#ffde00' : '#fff'" />
          <template v-if="data.info?.is_like">已收藏</template>
          <template v-else>收藏合集</template>
        </dx-button>

        <van-button
          :loading="buy_loading"
          class="flex-1"
          color="linear-gradient(to left, rgb(254,207,66),  rgb(254,183,27))"
          @click="onBuy"
        >
          <span class="text-[#8c4d10]">购买合集</span>
        </van-button>
      </div>
    </div>
    <div class="scroll-container">
      <scroll-list v-model:loading="loading">
        <stack-link
          v-for="(item, index) in data.list"
          :key="index"
          stack-key="colloect-detail"
          :list="data.list"
          :index="index"
        >
          <div class="search-videoItem">
            <div class="search-videoCover">
              <dx-image :src="item.cover_thumb_url" />
              <span>{{ item.duration_str }}</span>
            </div>
            <div class="search-videoInfo">
              <p class="line-clamp-2 text-base1">第{{ index + 1 }}集 | {{ item.title }}</p>
              <div v-if="item.coins === 0">
                <span>免费</span>
              </div>
              <div v-else>
                <span class="need-coins">{{ item.coins }}金币</span>
              </div>
              <div>
                <span class="time">{{ $Utils.formatNumber(item.like) }}喜欢</span>
              </div>
            </div>
          </div>
        </stack-link>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CollectDetail } from '@types'

const __ = useNuxtApp()
const route = useRoute()
const buy_loading = ref(false)
const topic_id = ref()

const { data, execute, loading } = useMyFetch<CollectDetail>({
  api: __.$Api.User.listmvOfTopic
})

const toggle = async () => {
  await __.$Api.User.toggle_like({
    topic_id: data.value.info.id
  })
  data.value.info.is_like = data.value.info.is_like ? 0 : 1
}

const onBuy = async () => {
  buy_loading.value = true
  try {
    await __.$Api.User.buy_collect({
      topic_id: route.query.id
    })
  } catch (error) {
  } finally {
    buy_loading.value = false
  }
}

const back = () => {
  topic_id.value = ''
  // @ts-ignore
  data.value = {}
}
onActivated(async () => {
  window.addEventListener('popstate', back)
  if (!topic_id.value || (topic_id.value && topic_id.value !== route.query.id)) {
    back()
    topic_id.value = route.query.id
    execute({
      topic_id: topic_id.value
    })
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>

<style lang="postcss" scoped>
.collection-header {
  padding: 0.3rem;
  font-size: 12px;
  color: #333;
  .collection-video-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    .video-cover {
      width: 5rem;
      height: 2.8rem;
      border-radius: 5px;
      overflow: hidden;
      margin-right: 0.2rem;
    }
    .video-info {
      flex: 1;
      p {
        font-size: 0.4rem;
      }
      .collection-user {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0.2rem 0;
        .avatar {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 0.2rem;
        }
      }
    }
  }
  .collection-desp-container {
    margin: 0.2rem 0;
    line-height: 1.5;
    .collection-desp {
      font-size: 0.36rem;
      color: #666;
    }
  }
  .collection-is-like {
    text-align: center;
    font-size: 0.36rem;
    padding: 0.3rem;
    color: white;
    background-color: #428af7;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .islike {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
}
.search-videoItem {
  padding: 0.2rem 0.3rem 0.3rem;
  display: flex;
  .search-videoCover {
    width: 5rem;
    height: 2.6rem;
    position: relative;
    border-radius: 5px;
    margin-right: 0.3rem;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative;
      z-index: 1;
    }
    span {
      position: absolute;
      z-index: 2;
      right: 5px;
      bottom: 5px;
      color: white;
      font-size: 12px;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 2px 5px;
      border-radius: 2px;
    }
  }

  .search-videoInfo {
    display: flex;
    flex: 1;
    flex-direction: column;
    .need-coins {
      color: var(--dx-yellow-color);
    }
    .time {
      font-size: 12px !important;
      max-width: 100% !important;
      width: 100%;
    }
    p {
      font-size: 14px;
      line-height: 1.5;
      text-align: left;
      margin-bottom: 4px;
    }
    .avatar {
      width: 24px !important;
      height: 24px !important;
      border-radius: 50%;
    }
    div {
      display: flex;
      align-items: center;
      color: var(--dx-base2-color);
      font-size: 14px;
      margin-bottom: 0.2rem;

      span:nth-child(1) {
        margin-right: 0.2rem;
        display: inline-block;
        max-width: 2.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
