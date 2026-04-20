<script setup lang="ts">
import { get } from 'lodash-es'

const stackStore = useStackStore()

const { api, index, stacks: items, params, fieldPath } = storeToRefs(stackStore)

let loadMore = () => {}
let isEnd = false
let page = 1
const { key } = useKeepAlive({
  reset() {
    console.log(key.value)
    isEnd = false
    stackStore.updateStacks([])
    stackStore.update_api('')
    stackStore.updateIndex(0)
    playIndex.value = 0
    page = 1
  },
  active() {
    console.log(items.value)
    if (api.value) {
      page = params.value.page
      const nuxtApp = useNuxtApp()
      const loadApi = nuxtApp.$Api.createApi({
        url: api.value
      })
      loadMore = async () => {
        if (!isEnd) {
          try {
            const res = (await loadApi({
              ...params.value,
              page
            })) as any
            page++
            console.log('fieldPath.value: ', fieldPath.value)
            const data = get(res, fieldPath.value, [])
            console.log('data: ', data)
            if (data.length) {
              stackStore.addStacks(data)
            } else {
              isEnd = true
            }

            return data
          } catch (error) {
            return Promise.reject(error)
          }
        }
      }
    } else {
      loadMore = () => {}
    }
  }
})

const hideTabs = ref(false)
provide('seekingHandler', (e: 'seeking' | 'auto') => [(hideTabs.value = e === 'seeking')])
const refreshing = ref(false)
async function refresh() {
  try {
    refreshing.value = true
    page = 1
    const data = await loadMore()

    stackStore.updateStacks(data)
  } catch (error) {
  } finally {
    refreshing.value = false
  }
}
const playIndex = ref(0)
</script>

<template>
  <div v-if="key" class="container bg-black">
    <van-pull-refresh v-model="refreshing" :disabled="!api || playIndex !== 0" class="h-full" @refresh="refresh">
      <tiktok-player v-model:play-index="playIndex" :api :index :items active @load="loadMore" />
    </van-pull-refresh>

    <nuxt-icon
      v-show="!hideTabs"
      class="!absolute left-0 top-0 z-10 p-1.5 text-4xl text-white"
      name="arrow-left"
      @click="$router.back"
    />
  </div>
</template>

<style scoped></style>
