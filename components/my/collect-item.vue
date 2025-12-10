<template>
  <div v-link="`/collect-detail?id=${props.item.id}`" class="collection-item-default">
    <div class="collection_card_thumb">
      <div v-if="props.item.is_top === 1" class="video_is_top">置顶</div>
      <dx-image :src="props.item.image_url" class="collection_card_thumb_img" />
    </div>
    <div class="info">
      <div class="title line-clamp-2">{{ props.item?.title }}</div>
      <div class="subtitle">{{ props.item?.like_count ?? props.item?.like ?? 0 }}人喜欢</div>
      <div class="subtitle">共{{ props.item?.video_count || 0 }}集</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CollectItem } from '@types'
const props = defineProps<{
  item: CollectItem
}>()
</script>

<style lang="less" scoped>
.collection-item-default {
  padding: 0.2rem 0;
  display: flex;
  align-items: center;
  position: relative;
  .collection_card_thumb {
    position: relative;
  }
  .collection_card_thumb_img {
    width: 5rem;
    height: 3rem;
    border-radius: 0.1rem;
    position: relative;
    z-index: 1;
    position: relative;
    overflow: hidden;
  }

  .info {
    flex: 1;
    padding-left: 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      padding: 0.1rem 0;
      font-size: 16px;
      color: var(--dx-base1-color);
    }

    .subtitle {
      padding-top: 0.1rem;
      font-size: 0.35rem;
      color: var(--dx-base2-color);
    }
  }

  .video_is_top {
    z-index: 9;
    position: absolute;
    left: 0.13rem;
    top: 0.13rem;
    padding: 0.1rem 0.13rem;
    color: white;
    border-radius: 5px;
    background-image: linear-gradient(to left, #6de6fb, #428af7);
    font-size: 12px;
  }
}
</style>
