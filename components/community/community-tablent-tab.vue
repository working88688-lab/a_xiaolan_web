<template>
  <!-- <div class="tablent-tab"> -->
  <dx-tabs
    v-model:active="active"
    title-active-color="#fff"
    line-width="24px"
    line-height="4px"
    title-inactive-color="rgba(255, 255, 255, 0.7)"
    class="nest-tabs"
  >
    <van-tab v-for="(item, index) in props.tabs" :key="item.type" :title="item.name" :name="index">
      <community-nest-tab :item="item"></community-nest-tab>
    </van-tab>
  </dx-tabs>
  <!-- </div> -->
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs?: any[]
}>()
const route = useRoute()

const active = ref(Number(route.query.index))

onBeforeMount(() => {
  const { index } = route.query
  active.value = Number(index)
})
</script>

<style lang="less" scoped>
:deep(.van-tabs__line) {
  background: linear-gradient(130deg, #cb4aed 35%, #5d3ef9) !important;
}
:deep(.van-tabs__nav) {
  background: transparent;
}
.tablent-tab {
  height: 100%;
  overflow: hidden;
}
.nest-tabs {
  display: flex;
  flex-direction: column;
}
.nest-tabs :deep(.van-tabs__content) {
  flex: 1;
}
</style>
