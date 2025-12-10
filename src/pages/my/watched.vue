<script setup lang="ts">
import VideoItem from '~/components/my/video-card.vue'
import PostItem from '~/components/my/post-item.vue'
import GameItem from '~/components/resource/game-item.vue'
import ComicsItem from '~/components/my/comics-item.vue'

const { key, activeTab } = useKeepAlive({})

interface TabProps {
  title: string
  tableName: Tables
  component: any
  className: string
  props?: Record<string, unknown>
  extraProps?: <P extends Record<string, unknown>>(p: P) => P
}

const globalStore = useGlobalStore()
function getImageDomain() {
  return new URL(globalStore.config.activity_thumb || globalStore.config.index_ads_thumb || '').origin
}

const imageDomain = getImageDomain()

const tabs: TabProps[] = [
  {
    title: '视频',
    tableName: 'video',
    component: VideoItem,
    className: 'dx-grid-2',
    extraProps: (props: any) => {
      return {
        ...props.item,
        cover_thumb_url: imageDomain + new URL(props.item.cover_thumb_url as string).pathname
      }
    }
  },
  {
    title: '片库',
    tableName: 'original',
    component: VideoItem,
    className: 'dx-grid-2',
    props: {
      showDuration: false
    },
    extraProps: (props: any) => {
      return {
        ...props.item,
        rating: props.item.play_count,
        cover_thumb_url: imageDomain + new URL(props.item.cover_full as string).pathname
      }
    }
  },
  {
    title: '合集',
    tableName: 'collect',
    component: VideoItem,
    className: 'dx-grid-2',
    extraProps: (props: any) => {
      return {
        ...props.item,
        cover_thumb_url: imageDomain + new URL(props.item.cover_thumb_url as string).pathname
      }
    }
  },
  {
    title: '帖子',
    tableName: 'post',
    component: PostItem,
    className: 'grid grid-cols-1',
    props: {
      showOriginal: true
    },
    extraProps: (props: any) => {
      return {
        ...props.item,
        medias: props.item.medias.map(item => {
          return item.type == 1
            ? {
                ...item,
                media_url_full: imageDomain + new URL(item.media_url_full as string).pathname
              }
            : {
                ...item,
                cover_url_full: imageDomain + new URL(item.cover_url_full as string).pathname
              }
        })
      }
    }
  },
  {
    title: '动漫',
    tableName: 'cartoon',
    component: VideoItem,
    className: 'dx-grid-2',
    props: {
      showDuration: false
    },
    extraProps: (props: any) => {
      return {
        ...props.item,
        rating: props.item.play_count,
        cover_thumb_url: imageDomain + new URL(props.item.cover_full as string).pathname
      }
    }
  },
  {
    title: '漫画',
    tableName: 'comic',
    component: ComicsItem,
    className: 'dx-grid-2',
    extraProps: (props: any) => {
      return {
        ...props.item,
        thumb_full: imageDomain + new URL(props.item.thumb_full as string).pathname
      }
    }
  },
  {
    title: '男色',
    tableName: 'image',
    component: ComicsItem,
    className: 'dx-grid-2',
    props: {
      page: 'images'
    },
    extraProps: (props: any) => {
      return {
        ...props.item,
        thumb_full: imageDomain + new URL(props.item.thumb_full as string).pathname
      }
    }
  },

  {
    title: '小说',
    tableName: 'novel',
    component: ComicsItem,
    className: 'dx-grid-2',
    props: {
      page: 'story'
    },
    extraProps: (props: any) => {
      return {
        ...props.item,
        thumb_full: imageDomain + new URL(props.item.thumb_full as string).pathname
      }
    }
  },
  {
    title: '黄游',
    tableName: 'game',
    component: GameItem,
    className: 'dx-grid-2',
    extraProps: (props: any) => {
      return {
        ...props.item,
        thumb: imageDomain + new URL(props.item.thumb as string).pathname
      }
    }
  }
] as const
</script>

<template>
  <div v-if="key" :key="key" class="container">
    <dx-tabs v-model:active="activeTab" class="first-no-padding dx-tabs" line-width="20px" shrink>
      <van-tab v-for="tab in tabs" :key="tab.title" :title="tab.title">
        <dx-record-list :table-name="tab.tableName">
          <template #list="{ items }">
            <div :class="tab.className">
              <component
                :is="tab.component"
                v-for="(item, index) in items"
                :key="item.id"
                :item="
                  tab.extraProps?.({
                    item,
                    index,
                    items
                  }) || {}
                "
                v-bind="{
                  ...(tab.props || {})
                }"
              />
            </div>
          </template>
        </dx-record-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>
