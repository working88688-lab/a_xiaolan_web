<template>
  <div class="graphic-information-common" @click="__.$NavigateTo(`/${_page}?id=${item.id}`)">
    <div class="thumb">
      <dx-image :src="props.item?.thumb_full" />
    </div>
    <div class="max-w-full truncate">{{ props.item.title }}</div>
  </div>
</template>

<script setup lang="ts">
import type { BaseCard } from '@types'
const props = defineProps<{
  item: BaseCard
  page?: string
  size?: number
}>()

const __ = useNuxtApp()
const _page = props.page || 'comics'

const _size = (props.size || 5.9) + 'rem'
</script>

<style lang="postcss" scoped>
.graphic-information-common {
  .thumb {
    width: 100%;
    height: v-bind(_size);
    border-radius: 5px;
    margin-bottom: 0.2rem;
    overflow: hidden;
  }
}
</style>
