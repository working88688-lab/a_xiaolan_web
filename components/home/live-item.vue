<script setup lang="ts">
import type { LiveItem } from '@types'

import offIcon from '~/assets/image-icon/off.png'
import onIcon from '~/assets/image-icon/on.png'

const props = defineProps<{
  item: LiveItem
}>()
</script>

<template>
  <nuxt-link class="block text-white" :to="`/player/live?id=${props.item.id}`">
    <dx-cover class="aspect-h-1 aspect-w-1" :poster="props.item.show === 'off' ? props.item.thumb : props.item.cover">
      <dx-pay-type :coins="props.item.type === 2 ? 1 : 0" class="absolute left-0.5 top-0.5"></dx-pay-type>
      <div class="absolute right-0.5 top-0.5 flex">
        <div class="view-count flex items-center px-1 py-[2px] text-tiny">
          <img class="mr-[2px] !size-1" src="~/assets/image-icon/view.png" alt="icon" />
          {{ $Utils.formatNumber(props.item.view_count) }}观众
        </div>
      </div>

      <div class="linear-bg absolute bottom-0 left-0 right-0 flex items-center whitespace-nowrap px-1 py-1">
        <span class="mr-1 max-w-[122px] truncate">
          {{ props.item.username }}
        </span>
        <img
          class="ml-auto mr-0.5 !size-1.5 flex-shrink-0"
          :src="props.item.show === 'off' ? offIcon : onIcon"
          alt="icon"
        />
        <span class="text-mini">
          {{ props.item.show === 'off' ? '已下线' : '直播中' }}
        </span>
      </div>
    </dx-cover>
  </nuxt-link>
</template>

<style lang="postcss" scoped>
.view-count {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50px;
}
</style>
