<script setup lang="tsx">
const __ = useNuxtApp()

const route = useRoute()
const { key } = useKeepAlive({})
useNavbarTitle()
</script>

<template>
  <div :key="key" class="container">
    <dx-hoc-list
      v-if="key"
      class="dx-grid-1"
      :api="__.$Api.Home.construct_list"
      :params="{
        nag_id: route.query.nag_id
      }"
    >
      <template #item="{ item }">
        <cate-item :key="item.id" :item></cate-item>
      </template>
    </dx-hoc-list>
  </div>
</template>

<style lang="postcss" scoped></style>
