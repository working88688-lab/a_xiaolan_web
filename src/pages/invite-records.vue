<template>
  <div class="container">
    <div class="user-common-list-header">
      <div class="user-common-list-item">昵称</div>
      <div class="user-common-list-item">状态</div>
      <div class="user-common-list-item">金额</div>
    </div>
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute">
        <template v-for="(item, index) in listData" :key="index">
          <div class="user-common-list">
            <div class="user-common-list-item">{{ item.nickname || '' }}</div>
            <div class="user-common-list-item">{{ item.is_reg ? '注册成功' : '未注册' }}</div>
            <div class="user-common-list-item">{{ item.regdate_str || '' }}</div>
          </div>
        </template>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const { listData, loading, execute, isEmpty, isEnd } = useFetchList<any>({
  api: __.$Api.User.userInviteList,
  immediate: true
})
</script>

<style lang="less" scoped>
@import '@styles/list.less';
</style>
