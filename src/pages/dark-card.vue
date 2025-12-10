<template>
  <div :key="key" class="container">
    <scroll-list
      v-model:loading="loading"
      :is-end="isEnd"
      :is-empty="isEmpty"
      :pullup="execute"
      :pull-down-refresh="refreshData"
    >
      <div class="grid grid-cols-2 gap-1 px-1">
        <video-card
          v-for="(item, index) in listData"
          :key="item.id"
          :list="listData"
          :index="index"
          :item="item"
        ></video-card>
      </div>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'

const key = ref()
const __ = useNuxtApp()
const getCurrentTabData = () => {
  return __.$Api.dynamic({ url: __.$Store.dynamic.tab.api, method: 'post' })
}

const { listData, execute, loading, isEnd, isEmpty, reset, refresh } = useDynamicFetchList<VideoItem>({
  api: getCurrentTabData,
  params: () => {
    return {
      ...(__.$Store.dynamic.tab.params ?? {})
    }
  }
})

const fetchData = () => {
  return execute({
    ...(__.$Store.dynamic.tab.params ?? {})
  })
}

const refreshData = () => {
  return refresh({
    ...(__.$Store.dynamic.tab.params ?? {})
  })
}

const { setNavbarTitle } = useNavbarTitle()

const back = () => {
  reset()
  key.value = ''
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value) {
    key.value = Math.random()

    setNavbarTitle(__.$Store.dynamic.tab.name)
    fetchData()
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>

<style scoped></style>
