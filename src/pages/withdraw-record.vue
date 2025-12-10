<template>
  <div class="container">
    <div class="user-common-list-header">
      <div class="user-common-list-item">时间</div>
      <div class="user-common-list-item">状态</div>
      <div class="user-common-list-item">金额</div>
    </div>
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute">
        <template v-for="(item, index) in listData" :key="index">
          <div class="user-common-list">
            <div class="user-common-list-item">{{ item.created_at_str || '' }}</div>
            <div class="user-common-list-item">{{ item.status_str || '' }}</div>
            <div class="user-common-list-item">{{ item.amount || '' }}</div>
          </div>
        </template>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const { listData, loading, isEnd, isEmpty, execute } = useFetchList({
  api: __.$Api.User.myWithDrawList,
  immediate: true
})
</script>

<style lang="less" scoped>
@import '@styles/list.less';
</style>
