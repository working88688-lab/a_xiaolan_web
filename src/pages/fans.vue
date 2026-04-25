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
const route = useRoute()
const userStore = useUserStore()
const fansDebug = import.meta.env.DEV && import.meta.client

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

const fetchData = async () => {
  const res = await execute({
    uid: get_uid()
  })
  if (fansDebug) {
    // eslint-disable-next-line no-console
    console.log('[fans] fansList 接口响应', res)
    // eslint-disable-next-line no-console
    console.log('[fans] listData 长度', listData.value.length)
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

/** 本地补丁更新关注字段，避免 fans 接口返回滞后时 watchEffect 把按钮打回旧状态 */
const onFollowChange = (uid?: number, next?: 0 | 1) => {
  if (uid == null || next === undefined) return
  const idx = listData.value.findIndex(r => r.uid === uid)
  if (idx === -1) return
  const row = listData.value[idx]
  listData.value.splice(idx, 1, {
    ...row,
    is_attention: next,
    is_followed: next
  })
}

onActivated(() => {
  window.addEventListener('popstate', back)
  const uid = get_uid()
  if (!key.value || key.value !== uid) key.value = uid
  // 每次回到粉丝页都刷新，确保关注关系变化后列表及时更新
  reset()
  fetchData()
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>
