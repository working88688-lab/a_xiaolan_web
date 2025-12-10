<template>
  <stack-link :data="props.item" :track="props.track" :replace="props.replace" :list="props.list" :index="props.index"
    :disabled="props.item.isAd" :mv-type="props.mvType">
    <div class="video-item-default">
      <div class="img-box">
        <ad-link v-if="props.item.isAd" :data="props.item" ad-type="interstitial">
          <slot name="item" :item="item">
            <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded">
              <dx-image fit="fill" :src="props.item.img_url" :alt="item.title" />
            </div>
          </slot>
        </ad-link>

        <dx-image v-else :src="props.item?.cover_thumb_url" />

        <template v-if="!props.item.isAd">
          <div class="img-bottom linear-bg">
            <div v-if="showPlayCount" class="img-bottom-item truncate">
              {{
                typeof props.item?.rating == 'string'
                  ? props.item?.rating
                  : $Utils.formatNumber(props.item?.rating) || 0
              }}次播放
            </div>
            <div v-if="showDuration" class="img-bottom-item truncaten ml-auto">
              {{ props.item?.duration_str || '0:00' }}
            </div>
          </div>

          <dx-pay-type v-if="showType && props.mvType === 1" :coins="props.item.coins"
            class="absolute right-0.5 top-0.5"></dx-pay-type>
        </template>
      </div>
      <!-- :class="{
          truncate: lines,
          'line-clamp-2': !lines
        }" -->
      <div v-if="props.showTitle" class="title truncate">
        {{ props.item?.title }}
      </div>
    </div>
  </stack-link>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'

const props = withDefaults(
  defineProps<{
    item: VideoItem
    list?: VideoItem[]
    index?: number
    lines?: boolean
    showDuration?: boolean
    showType?: boolean
    showPlayCount?: boolean
    replace?: boolean
    showTitle?: boolean
    mvType?: 1 | 2 | 3 | 4 // 普通视频，片库，动漫,短视频
    track?: boolean
  }>(),
  {
    showDuration: true,
    showType: true,
    showPlayCount: true,
    replace: false,
    showTitle: true,
    mvType: 1
  }
)
</script>

<style lang="less" scoped>
.video-item-default {
  cursor: pointer;

  .img-box {
    height: 2.75rem;
    border-radius: 0.1rem;
    position: relative;
    z-index: 1;
    position: relative;
    overflow: hidden;

    .img-bottom {
      width: 100%;
      padding: 0.1rem 0.2rem;
      font-size: 0.3rem;
      color: #fff;
      // background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      z-index: 2;
      box-sizing: border-box;

      .img-bottom-item {
        display: flex;
        align-items: center;

        img {
          width: auto;
          height: 0.35rem;
          margin-right: 0.1rem;
        }
      }
    }
  }

  .title {
    padding-top: 0.1rem;
    font-size: 0.35rem;
    color: #000;
  }
}
</style>
