<script setup lang="ts">
const props = defineProps<{
  item: any
}>()
</script>
<template>
  <dx-link :to="`/tag?_type=discover&title=${item.name}&tag=${item.name}&has_sort=1`" class="cover-item relative">
    <dx-image no-bg :src="item.img_url_full"></dx-image>
    <div class="translate-50 absolute left-1/2 top-1/2 z-10 w-full whitespace-nowrap text-center text-white">
      <div class="w-full truncate px-1 text-2xl">{{ item.name }}</div>
      <div class="text-sm">{{ $Utils.formatNumber(item.works_num) }}</div>
    </div>
  </dx-link>
</template>

<style lang="postcss" scoped>
.cover-item {
  width: 110px;
  height: 110px;
  border-radius: 4px;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
