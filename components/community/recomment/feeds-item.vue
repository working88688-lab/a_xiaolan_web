<template>
  <scroll-list
    v-model:loading="loading"
    :pullup="fetchData"
    :is-empty="isEmpty"
    :pull-down-refresh="_refresh"
    :is-end="isEnd"
    :disabled-refresh="props.disabledRefresh"
  >
    <div class="scroll-container">
      <post-item v-for="_item in listData" :key="_item.id" show-original :item="_item"></post-item>
    </div>
  </scroll-list>
</template>

<script setup lang="ts">
import type { PostItem, TabItem } from '@types'
const props = defineProps<{
  item: TabItem
  active?: boolean
  disabledRefresh?: boolean
}>()

const __ = useNuxtApp()

const { listData, execute, isEmpty, loading, isEnd, refresh } = useFetchList<PostItem>({
  api: __.$Api.dynamic({ url: props.item.api, method: 'post' }),
  params: {
    ...(props.item?.params ?? {})
  },
  fields: 'post',
  startRefreshEmptyData: true,
  immediate: true
})

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
    const { data } = cacheData
    listData.value = listData.value.map(item => {
      return item.id === data.id
        ? {
            ...item,
            ...data
          }
        : item
    })
  }
})

const fetchData = () => {
  return execute({
    ...(props.item?.params ?? {})
  })
}

const _refresh = () => {
  return refresh({
    ...(props.item?.params ?? {})
  })
}
</script>
