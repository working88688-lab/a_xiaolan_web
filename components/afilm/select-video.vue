<template>
  <div class="search-videoItem" @click="onSelectCard">
    <div v-if="props.type === 'delete'" class="delete_btn flex-shrink-0" @click.stop="onDelete">
      <img src="~/assets/image/film/icon_replay_fv_delete.png" />
    </div>
    <div v-if="props.type === 'select'" class="select_btn flex-shrink-0">
      <img :src="props.isSelect ? selectIcon : unselectIcon" />
    </div>
    <div class="search-videoCover">
      <dx-image :src="props.data.cover_thumb_url" />
      <span class="duration">{{ props.data.duration_str }}</span>
      <dx-pay-type :coins="props.data.coins" class="absolute right-0.5 top-0.5 z-10"></dx-pay-type>
    </div>
    <div class="search-videoInfo">
      <p class="line-clamp-2">{{ props.data.title }}</p>
      <div class="whitespace-nowrap">
        <span>{{ props.data?.user?.nickname }}</span>
        <span>{{ $Utils.formatNumber(props.data.rating) }}播放</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'

import selectIcon from '~/assets/image/film/icon_select.png'
import unselectIcon from '~/assets/image/film/icon_unselect.png'

const props = defineProps<{
  type: 'delete' | 'select'
  isSelect?: boolean
  data: VideoItem
  index?: number
}>()

const emit = defineEmits<{
  delete: [e: VideoItem['id']]
  select: [e?: VideoItem['id']]
}>()

const __ = useNuxtApp()
const onDelete = () => {
  emit('delete', props.data.id)
}

const onSelectCard = () => {
  if (props.type === 'select') {
    return emit('select', props.data.id)
  }
  __.$Store.stack.updateStacks([props.data])
  __.$NavigateTo(`/player?id=${props.data.id}&index=${props.index}`)
}
</script>

<style lang="less" scoped>
.search-videoItem {
  align-items: center;
  position: relative;

  .select_btn {
    img {
      width: 0.4rem;
      margin-right: 0.32rem;
    }
  }

  .delete_btn {
    position: absolute;
    right: 0.32rem;
    bottom: 0.12rem;

    img {
      width: 0.453rem;
    }
  }
}

.search-videoItem {
  padding: 0.2rem 0.3rem 0.3rem;
  display: flex;
  .search-videoCover {
    width: 4.4rem;
    height: 2.6rem;
    position: relative;
    border-radius: 5px;
    overflow: auto;
    margin-right: 0.3rem;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: relative;
      z-index: 1;
    }
    .duration {
      position: absolute;
      z-index: 2;
      right: 5px;
      bottom: 5px;
      color: white;
      font-size: 0.3rem;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 2px 5px;
      border-radius: 2px;
    }
  }

  .search-videoInfo {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-top: 0.2rem;
    .need-coins {
      color: var(--dx-yellow-color);
    }
    .time {
      font-size: 0.32rem !important;
      max-width: 100% !important;
      width: 100%;
    }
    p {
      color: var(--dx-base1-color);
      font-size: 12px;
      line-height: 1.5;
      margin-bottom: 4px;
    }
    .avatar {
      width: 0.5rem !important;
      height: 0.5rem !important;
      border-radius: 50%;
      margin-bottom: -0.3rem;
    }
    div {
      display: flex;
      align-items: center;
      color: var(--dx-base2-color);
      font-size: 0.35rem;
      margin-bottom: 0.2rem;

      span:nth-child(1) {
        margin-right: 0.2rem;
        display: inline-block;
        max-width: 2.4rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
