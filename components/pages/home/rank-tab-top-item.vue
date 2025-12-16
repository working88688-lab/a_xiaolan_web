<script setup lang="ts">
import type { TabItem, RankItem } from '@types'

import ranking1 from '~/assets/image/rank/top1.png'
import ranking2 from '~/assets/image/rank/top2.png'
import ranking3 from '~/assets/image/rank/top3.png'

const props = defineProps<{
  item: RankItem
  tab: TabItem
  index: number
}>()

const icons = [ranking2, ranking1, ranking3]
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
  <div class="top1 flex flex-col items-center justify-end">
    <dx-avatar
      class="tablent_tab_date_list_item_center_img"
      :size="1.4"
      :img="item.avatar_url"
      :uid="item.uid"
    ></dx-avatar>

    <span class="my-0.5 w-full truncate">{{ item.nickname }}</span>
    <span class="mb-1 text-sm text-[#e4e4e4]">{{ renderNum() }}</span>
    <btn-follow :attention="item?.is_attention" :uid="item?.uid" class="mb-1">
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
    <img class="top-icon" :src="icons[index]" alt="" />
  </div>
</template>

<style lang="postcss" scoped>
.top-icon {
  max-width: 100%;
  width: unset;
  height: auto;
}

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
