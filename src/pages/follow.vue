<template>
  <div :key="key" class="container px-2">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :pullup="fetchData" :is-empty="isEmpty" :is-end="isEnd">
        <div class="user-my-fans-list">
          <user-item
            v-for="item in listData"
            :key="item?.uid"
            class="cursor-pointer"
            :item="item"
            @follow-change="onFollowChange"
          ></user-item>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from '@types'
const __ = useNuxtApp()
const followDebug = import.meta.env.DEV && import.meta.client

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

const fetchData = async () => {
  const res = await execute()
  if (followDebug) {
    // eslint-disable-next-line no-console
    console.log('[follow] myFollowed 接口响应', res)
    // eslint-disable-next-line no-console
    console.log('[follow] listData 长度', listData.value.length)
    // eslint-disable-next-line no-console
    console.table(
      listData.value.slice(0, 30).map((it: any) => ({
        uid: it?.uid,
        nickname: it?.nickname,
        is_attention: it?.is_attention,
        is_followed: it?.is_followed
      }))
    )
  }
  return res
}

/** 取关后从「我的关注」移除一行，避免整表 reset 闪烁；关注态仅补丁即可 */
const onFollowChange = (uid?: number, next?: 0 | 1) => {
  if (uid == null || next === undefined) return
  const idx = listData.value.findIndex(r => r.uid === uid)
  if (idx === -1) return
  if (next === 0) {
    listData.value.splice(idx, 1)
    return
  }
  const row = listData.value[idx]
  listData.value.splice(idx, 1, {
    ...row,
    is_attention: next,
    is_followed: next
  })
}

onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value) key.value = Math.random()
  // 每次回到关注页都刷新，确保关注/取消关注后的列表实时更新
  reset()
  fetchData()
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>
