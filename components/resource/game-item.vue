<script setup lang="ts">
import type { Game } from '@types'

const props = defineProps<{
  item: Game
}>()
</script>

<template>
  <nuxt-link :to="`/game/detail?id=${item.id}&title=${item.name}`">
    <dx-cover class="aspect-h-9 aspect-w-16" :poster="item.thumb">
      <span v-if="item.is_hot === 1" class="dx-coin-tag absolute right-0.5 top-0.5 text-tiny">热门</span>

      <div class="linear-bg absolute bottom-0 flex w-full items-center justify-between p-0.5 text-sm text-white">
        <span>{{ $Utils.formatNumber(item.like_count) }}点赞</span>

        <span>{{ $Utils.formatNumber(item.buy_fake) }}解锁</span>
      </div>
    </dx-cover>
    <div class="my-0.5 truncate">
      {{ item.name }}
    </div>
    <div class="mb-0.5 text-sm text-base3">
      {{ item.tags.split(',').join('/') }}
    </div>
  </nuxt-link>
</template>

<style lang="postcss" scoped>
.dx-coin-tag {
  color: var(--dx-tag-active-color);
  background: linear-gradient(to right, #ff7756, #ff2ba1);
  border-radius: 4px;
  padding: 2px 8px;
  color: #fff;
}
</style>
