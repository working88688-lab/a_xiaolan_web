<script setup lang="ts">
import type { ForumData } from '@types'

const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)

const __ = useNuxtApp()
const route = useRoute()

const { setNavbarTitle } = useNavbarTitle()
const { data, loading, execute } = useMyFetch<ForumData>({
  api: __.$Api.Community.topic_detail,
  success() {
    setNavbarTitle(data.value.name)
  }
})

const { post_tab } = storeToRefs(useGlobalStore())

const onFollow = (_val: number) => {
  data.value.follow_num += _val
}

const MAX_DISTANCE = 100

const opacity_percent = computed(() => {
  return Math.min(1, scrollTop.value / MAX_DISTANCE)
})
const nav_style = computed(() => {
  return {
    backgroundColor: `rgba( 255, 255, 255, ${opacity_percent.value})`,
    '--van-nav-bar-title-text-color': `rgba(0, 0 , 0, ${opacity_percent.value})`,
    zIndex: 9
  }
})
const banner_bg = ref('')
const { cryptoImage } = useCrypto()

const bannerStyle = computed(() => {
  return banner_bg.value
    ? {
        backgroundImage: `url(${banner_bg.value})`
      }
    : undefined
})

const { key, activeTab } = useKeepAlive({
  active() {
    execute({
      topic_id: route.query.id
    }).then(() => {
      cryptoImage(data.value.thumb_full).then(_val => {
        banner_bg.value = _val
      })
    })
  },
  effect() {
    setNavbarTitle(data.value.name)
  }
})
</script>
<template>
  <div :key="key" class="container">
    <dx-navbar :title="data.name" fixed :style="nav_style"></dx-navbar>
    <scroll-list ref="list" :loading="loading" :is-ready="!loading" class="list">
      <div class="forum-details-layout" :style="bannerStyle">
        <div class="relative z-[1]">
          <div class="forum-top">
            <div class="forum-top_left">
              <div class="thumb-cover">
                <dx-image :src="data.thumb_full" />
              </div>
              <div class="forum-top_left_content">
                <p>{{ data.intro }}</p>
                <div class="forum-top_left_content_info">
                  <span>{{ $Utils.formatNumber(data.post_num) }}帖子</span>
                  <span>{{ $Utils.formatNumber(data.follow_num) }}人加入</span>
                </div>
              </div>
            </div>
            <btn-follow
              class="fouce-bt"
              :params="{
                topic_id: data.id
              }"
              :api="__.$Api.Community.follow"
              :attention="data.is_follow"
              use-default-style
              symbol="+"
              @success="onFollow"
            ></btn-follow>
          </div>
          <div class="mt-1 line-clamp-3 text-sm">
            简介：
            <span class="text-[#333333]">{{ data.intro }}</span>
          </div>
        </div>
      </div>

      <div class="forum-container">
        <dx-tabs v-model:active="activeTab" shrink class="dx-tabs h-full" theme="button">
          <van-tab v-for="tab in post_tab" :key="tab.name" v-bind="tab">
            <dx-hoc-list
              v-if="key"
              fields="post"
              :api="__.$Api.Community.list_post_by_topic_id"
              :params="{ cate: tab.name, topic_id: route.query.id }"
              :list-props="{ disabledRefresh: scrollTop > 0 }"
            >
              <template #item="{ item }">
                <post-item :key="item.id" show-original :is-topic="false" :item="item"></post-item>
              </template>
            </dx-hoc-list>
          </van-tab>
        </dx-tabs>
      </div>
    </scroll-list>
  </div>
</template>

<style lang="postcss" scoped>
@import '@styles/topic.css';
.forum-details-layout {
  padding-top: calc(var(--van-nav-bar-height) + 12px);
  position: relative;
  background-size: cover;
  &::before {
    background-color: rgba(255, 255, 255, 0.9);
    bottom: 0;
    content: '';
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: auto;
  }
}
.forum-container {
  height: calc(100vh - var(--van-nav-bar-height));
}
</style>
