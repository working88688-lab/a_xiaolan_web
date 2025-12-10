<script setup lang="ts">
const __ = useNuxtApp()
const { key, activeTab } = useKeepAlive({})

const tabs = [
  {
    title: '我的求片',
    api: __.$Api.User.myFindList
  },
  {
    title: '我的喜欢',
    api: __.$Api.User.myLook
  },
  {
    title: '我的推荐',
    api: __.$Api.User.myReply
  }
]
</script>
<template>
  <div :key="key" class="container">
    <dx-tabs v-model:active="activeTab" class="dx-tabs primary-tabs">
      <van-tab v-for="tab in tabs" :key="tab.title" :title="tab.title">
        <dx-hoc-list v-if="key" class="grid grid-cols-1 gap-1 px-1" :api="tab.api">
          <template #item="{ item }">
            <file-card :key="item.id" is-self :data="item"></file-card>
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>
