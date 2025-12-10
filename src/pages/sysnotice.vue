<template>
  <div class="container">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute">
        <div v-for="item in listData" :key="item.id" class="sys-notice-item-default">
          <img class="icon" src="~/assets/image/my/icon_sys_notice.png" />
          <div class="info">{{ item?.description || '暂无' }}</div>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const { listData, execute, loading, isEmpty, isEnd } = useFetchList({
  api: __.$Api.User.sysnotice,
  immediate: true
})
</script>

<style lang="less" scoped>
.sys-notice-item-default {
  padding: 0.4rem;
  display: flex;
  align-items: flex-start;

  .icon {
    width: 1rem;
    height: 1rem;
    margin: 0.125rem 0.25rem 0 0;
  }

  .info {
    flex: 1;
    padding: 0.4rem;
    background: #fff;
    border-radius: 0.2rem;
  }
}
</style>
