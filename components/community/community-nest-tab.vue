<template>
  <dx-tabs
    v-model:active="active"
    title-active-color="#fff"
    title-inactive-color="rgba(255, 255, 255, 0.5)"
    swipeable
    lazy-render
    shrink
    type="card"
    class="dx-tabs"
    @rendered="onRender"
  >
    <van-tab v-for="(tab, index) in props?.item?.list" :key="index" :title="tab.name" :name="tab.type">
      <community-tab-item
        :active="active === item.type"
        :type="item.type"
        :is-render="displayList[tab.type]"
        :item="tab"
      ></community-tab-item>
    </van-tab>
  </dx-tabs>
</template>

<script setup lang="ts">
const props = defineProps<{
  item?: any
}>()
console.log('sssssss:',props.item)


const active = ref('day')
const displayList = ref<{
  [key: string]: boolean
}>({})
const onRender = (type: string) => {
  displayList.value[type] = true
}
</script>

<style lang="less" scoped>
:deep(.van-tabs__nav) {
  justify-content: center;
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 50px;
}
:deep(.van-tabs__wrap) {
  text-align: center;
}
:deep(.van-tabs__nav--card) {
  margin: 0;
  border: 0;
  background: rgba(255, 255, 255, 0.2);
  .van-tab--card {
    border: 0;
  }
  .van-tab {
    width: 80px;
    border-radius: 50px;
  }
  .van-tab__text {
    font-size: 12px !important;
  }
}
:deep(.van-tab--active) {
  background: linear-gradient(115deg, #cb4aed 40%, rgba(93, 62, 249, 0.5), rgba(13, 133, 245, 0.7));
}
.dx-tabs {
  display: flex;
  flex-direction: column;
}
.dx-tabs :deep(.van-tabs__content) {
  flex: 1;
}
.dx-tabs :deep(.van-tabs__wrap) {
  margin: 12px 0;
}
</style>
