<script setup lang="ts">
import type { TabItem, RankItem } from '@types'
const props = defineProps<{
  item: RankItem
  tab: TabItem
  index: number
}>()

const __ = useNuxtApp()
const renderNum = () => {
  if (props.tab.type === 'liked') {
    return `点赞数：${__.$Utils.formatNumber(props.item.likes_count)}`
  } else if (props.tab.type === 'recommend' || props.tab.type === 'upload') {
    return `作品数：${__.$Utils.formatNumber(props.item.videos_count)}`
  } else {
    return `收益数：${__.$Utils.formatNumber(props.item.votes)}`
  }
}
</script>
<template>
  <div class="flex">
    <div class="flex flex-1 items-center overflow-hidden">
      <div class="mx-0.5 h-[20px] min-w-[20px] flex-shrink-0 text-center">
        <span class="text-white">{{ index + 4 }}</span>
      </div>
      <div class="flex flex-1 overflow-hidden" @click="$router.push(`/userdetail?id=${item?.uid}`)">
        <dx-avatar class="flex-shrink-0" :size="1.2" :img="item?.avatar_url" :uid="item?.uid"></dx-avatar>
        <div class="ml-1 flex-1 overflow-hidden text-white">
          <div class="truncate text-base">{{ item?.nickname }}</div>
          <div class="text-sm text-[#ffffffb3]">{{ renderNum() }}</div>
        </div>
      </div>
    </div>
    <div class="ml-0.5 flex-shrink-0">
      <btn-follow :attention="item?.is_attention" :uid="item?.uid">
        <template #default="{ text, follow }">
          <div
            :class="{
              'is-active': follow
            }"
            class="btn-follow"
          >
            <van-icon v-show="!follow" name="plus"></van-icon>
            {{ text }}
          </div>
        </template>
      </btn-follow>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.btn-follow {
  width: 1.5rem;
  height: 0.7rem;
  border: 1px solid #cb4aed;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.32rem;
  justify-content: center;
  border-radius: 50px;

  &.is-active {
    background: linear-gradient(to right, #b030da, #050188);
  }
}
</style>
