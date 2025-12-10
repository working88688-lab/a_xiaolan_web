<template>
  <scroll-list
    v-model:loading="loading"
    :pullup="props.type === 3 ? undefined : fetchData"
    :pull-down-refresh="refreshData"
    :is-empty="isEmpty"
    :is-end="props.type === 3 ? false : isEnd"
  >
    <div class="dx-list">
      <template v-if="props.type === 3">
        <king-card v-for="(_item, index) in listData" :key="_item.id" :index="index" :data="_item"></king-card>
      </template>
      <template v-else>
        <file-card v-for="_item in listData" :key="_item.id" :data="_item"></file-card>
      </template>
    </div>
  </scroll-list>
</template>

<script setup lang="ts">
import type { ApiLike, PostItem } from '@types'
const props = defineProps<{
  item: any
  active?: boolean
  type?: number
}>()

const __ = useNuxtApp()
const getCurrentTabData = (url: string) => {
  return __.$Api.dynamic({ url, method: 'post' })
}

const { listData, execute, isEmpty, loading, isEnd, refresh } = useFetchList<PostItem>({
  api: getCurrentTabData(props.item.api) as unknown as ApiLike,
  params: {
    ...(props.item?.params ?? {})
  },
  startRefreshEmptyData: true,
  immediate: true
})

const fetchData = () => {
  return execute({
    ...(props.item?.params ?? {})
  })
}

const refreshData = () => {
  return refresh({
    ...(props.item?.params ?? {})
  })
}
</script>

<style scoped></style>
