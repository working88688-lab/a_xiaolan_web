<template>
  <dx-tabs
    v-model:active="active"
    title-active-color="#548aef"
    title-inactive-color="#666"
    swipeable
    shrink
    sticky
    theme="button"
    class="dx-tabs"
  >
    <van-tab v-for="(item, index) in props?.tabs" :key="item.name" :title="item.name">
      <feeds-item
        :disabled-refresh="props.disabledRefresh"
        class="px-1"
        :active="index === active"
        :item="item"
      ></feeds-item>
    </van-tab>
  </dx-tabs>
</template>

<script setup lang="ts">
import type { TabItem } from '@types'
const active = ref(0)
const props = defineProps<{
  tabs?: TabItem[]
  disabledRefresh: boolean
}>()
</script>
