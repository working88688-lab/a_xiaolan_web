<template>
  <div class="container">
    <scroll-list v-model:loading="loading" :pullup="execute" :is-empty="isEmpty" :is-end="isEnd">
      <div class="user-coins-detail-list">
        <div v-for="item in listData" :key="item.id" class="coins-detail-item-default">
          <div class="info-box">
            <div class="title">{{ item?.desc }}</div>
            <div class="subtitle">{{ item?.add_time_str }}</div>
          </div>
          <div class="number">{{ item?.type === 'income' ? '+' : '-' }}{{ item?.totalcoin }}</div>
        </div>
      </div>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const { listData, loading, execute, isEmpty, isEnd } = useFetchList({
  api: __.$Api.User.consume_log,
  immediate: true,
  params: {
    isAll: false
  }
})
</script>

<style lang="less" scoped>
.user-coins-detail-list {
  padding: 0 16px;
}
.coins-detail-item-default {
  padding: 0.4rem 0;
  border-bottom: 1px solid rgb(245, 245, 245);
  display: flex;
  align-items: center;

  .info-box {
    flex: 1;

    .title {
      font-size: 0.4rem;
      color: #000;
    }

    .subtitle {
      margin-top: 0.25rem;
      font-size: 0.35;
      color: rgb(102, 102, 102);
    }
  }

  .number {
    padding: 0 0.25rem;
    font-size: 0.6rem;
    color: rgb(66, 138, 247);
  }
}
</style>
