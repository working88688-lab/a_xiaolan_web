<template>
  <scroll-list
    v-model:loading="loading"
    :pullup="execute"
    :pull-down-refresh="refresh"
    :is-empty="isEmpty"
    :is-end="isEnd"
  >
    <div class="list-container">
      <feature-item
        v-for="(item, lIndex) in listData"
        :key="item.id"
        :index="lIndex"
        :data="item"
        :list="listData"
        @share="openShareDialog"
      ></feature-item>
    </div>
  </scroll-list>
</template>

<script setup lang="ts">
import type { ApiLike, TabItem, VideoItem } from '@types'

const props = defineProps<{
  tab: TabItem
}>()

const emit = defineEmits<{
  share: [e: VideoItem]
}>()

const __ = useNuxtApp()

const getCurrentTabData = (url: string) => {
  return __.$Api.dynamic({ url, method: 'post' })
}

const params = {
  ...props.tab?.params
}
const { listData, execute, loading, refresh, isEmpty, isEnd } = useFetchList<VideoItem>({
  api: getCurrentTabData(props.tab.api) as unknown as ApiLike,
  params,
  immediate: true,
  startRefreshEmptyData: false,
  usePageSize: false
})

const openShareDialog = (_data: any) => {
  emit('share', _data)
}

useSyncCacheData(cacheData => {
  if (cacheData.module === 'user') {
    const { data } = cacheData
    listData.value = listData.value.map(item => {
      return item.user.uid === data.uid
        ? {
            ...item,
            user: {
              ...item.user,
              ...data
            }
          }
        : item
    })
  }
  if (cacheData.module === 'like') {
    const { data: _data } = cacheData
    listData.value = listData.value.map(item => {
      return item.id === _data.id
        ? {
            ...item,
            is_like: _data.is_follow,
            like: _data.like_num
          }
        : item
    })
  }
})
</script>

<style lang="postcss" scoped></style>
