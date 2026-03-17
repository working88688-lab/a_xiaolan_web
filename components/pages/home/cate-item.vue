<script setup lang="tsx">
import type { Cate } from '@types'
const props = defineProps<{
  item: Cate
}>()
const __ = useNuxtApp()
</script>

<template>
  <div
    class="grid grid-cols-2 gap-1"
    @click="
      $router.push(
        `/tag?_type=home&${format_url_params({
          construct_id: item.id,
          title: item.title,
          has_sort: 1
        })}`
      )
    "
  >
    <dx-cover class="aspect-h-9 aspect-w-16" :poster="item.bg_thumb"></dx-cover>
    <div>
      <div class="text-default">{{ item.title }}</div>
      <div class="text-sm text-[#808080]">{{ $Utils.formatNumber(item.work_num) }}作品</div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
