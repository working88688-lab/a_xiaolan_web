<template>
  <div :key="key" class="container px-2">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :pullup="execute" :is-empty="isEmpty" :is-end="isEnd">
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

const { listData, isEmpty, isEnd, execute, loading, reset } = useFetchList<UserInfo>({
  api: __.$Api.User.myFollowed,
  params: {
    isAll: false
  }
})

const key = ref()
const back = () => {
  reset()
  key.value = ''
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value) {
    key.value = Math.random()
    execute()
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>
