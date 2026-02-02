<template>
  <div class="container">
    <dx-hoc-list api="api/proxy/userInviteList" class="dx-grid-1">
      <template #item="{ item }">
        <div class="item flex items-center bg-white px-1 py-2">
          <div class="m-0 mr-1 truncate font-medium">{{ item.nickname || '' }}</div>
          <div class="ml-auto flex-shrink-0 text-sm text-base3">{{ item.regdate_str || '' }}</div>
        </div>
      </template>
    </dx-hoc-list>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const { listData, loading, execute, isEmpty, isEnd } = useFetchList<any>({
  api: __.$Api.User.userInviteList,
  immediate: true
})
</script>

<style lang="postcss" scoped>
.item {
  box-shadow: 0px 2px 11.9px 0px #00000012;
  border-radius: 10px;
}
</style>
