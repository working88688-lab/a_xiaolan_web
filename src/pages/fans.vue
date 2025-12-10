<template>
  <div :key="key" class="container px-2">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :pullup="fetchData" :is-empty="isEmpty" :is-end="isEnd">
        <div class="user-my-fans-list">
          <user-item v-for="item in listData" :key="item?.uid" class="cursor-pointer" :item="item"></user-item>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from '@types'

const __ = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()

const { listData, isEmpty, isEnd, execute, loading, reset } = useFetchList<UserInfo>({
  api: __.$Api.User.fansList,
  params: {
    isAll: false
  }
})

const key = ref()
const back = () => {
  reset()
  key.value = ''
}

const get_uid = () => {
  return route.query.uid || userStore.u.uid
}

const fetchData = () => {
  return execute({
    uid: get_uid()
  })
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value || (key.value && key.value !== get_uid())) {
    back()
    key.value = get_uid()
    fetchData()
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>
