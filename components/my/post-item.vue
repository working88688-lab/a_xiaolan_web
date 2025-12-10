<template>
  <div class="item-bg">
    <div class="use-info mb-1" @click="navigateToDetail">
      <div class="use-info_left">
        <dx-avatar class="flex-shrink-0" :img="item.user?.avatar_url" :size="1.33" :uid="item.user?.uid"
          :aff="item.user?.aff" />
        <div class="info">
          <div class="flex items-center">
            <span class="text-xl">{{ item.user?.nickname }}</span>
            <div v-if="props.showOriginal && item.user?.post_auth" class="relative ml-0.5 h-[16px] w-[16px]">
              <img src="~/assets/image/community/original.png" alt="" />
            </div>
          </div>
          <div class="flex items-center">
            <slot name="desc">
              <span v-if="showDesc" class="mr-1 !flex items-center text-sm !text-base2">
                <nuxt-icon class="!text-xl" name="location" />
                {{ item.cityname }}
              </span>
            </slot>
            <span class="text-sm">{{ item.created_at }}</span>
          </div>
        </div>
      </div>

      <btn-follow class="fouce-bt" :uid="item?.user?.uid" :attention="item?.user?.is_attention" use-default-style
        symbol="+"></btn-follow>
    </div>
    <div class="item-bg_type text-[#1a1a1a]">
      <div class="flex">
        <div v-if="item.is_best === 1" class="item-bg_type_essence flex-shrink-0">精华</div>
        <div class="text-[#1a1a1a]">{{ item.title }}</div>
      </div>
      <p class="line-clamp-3">
        {{ item.content }}
      </p>
    </div>

    <div class="img-list relative" :style="{ justifyContent: item.medias.length > 2 ? 'space-between' : 'start' }"
      @click="navigateToDetail">
      <template v-for="(img, iIndex) in item.medias" :key="img">
        <div v-if="iIndex < 3" class="img-list_img">
          <img v-lazyLoad="img.type == 1 ? img.media_url_full : img.cover_url_full" />
        </div>
      </template>
      <div v-if="item?.medias.length > 3" class="count-bg">
        <span>+{{ item?.medias.length - 3 }}</span>
      </div>
      <div v-if="is_show_mask()" class="filter-mask"></div>
    </div>

    <comment-action v-bind="action" :is-topic="props.isTopic" :item="props.item" @like="onLike(item)"></comment-action>
  </div>
</template>

<script setup lang="ts">
import type { PostItem } from '@types'

const props = withDefaults(
  defineProps<{
    item?: PostItem
    isTopic?: boolean
    isLink?: boolean
    to?: string
    action?: Record<string, any>
    showDesc?: boolean
    showOriginal?: boolean
  }>(),
  {
    item: () => ({}) as unknown as PostItem,
    isTopic: true,
    isLink: true,
    to: 'post-detail',
    action: undefined,
    showDesc: false,
    showOriginal: false
  }
)
const emit = defineEmits<{
  like: [e: PostItem]
}>()
const onLike = (item: PostItem) => {
  emit('like', item)
}
const __ = useNuxtApp()

const navigateToDetail = () => {
  if (props.isLink) {
    __.$NavigateTo(`/${props.to}?id=${props.item.id}`)
  }
}

const is_show_mask = () => {
  return (
    !props.showOriginal &&
    ((props.item.price > 0 && props.item.is_pay === 0) || (props.item.price === 0 && __.$Store.user.u.is_vip))
  )
}
</script>

<style lang="postcss" scoped>
.item-bg {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 5px;
  background-color: #f6f7f8;
  padding: 12px 12px 0 12px;
  box-sizing: border-box;

  &_type {
    margin-top: 8px;

    &_essence {
      width: 38px;
      height: 18px;
      border-radius: 2px;
      background-image: linear-gradient(to top, #ff7e60, #ff4a4a);
      font-size: 10px;
      color: #fff;
      line-height: 18px;
      text-align: center;
      margin-right: 4px;
    }
  }

  .count-bg {
    min-width: 32px;
    height: 20px;
    padding: 2px 4px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    right: 4px;
    bottom: 4px;
    display: flex;
    align-items: center;

    span {
      line-height: 12px;
      font-size: 12px;
      color: #fff;
      text-align: center;
    }
  }

  .img-list {
    margin-top: 6px;
    display: flex;
    position: relative;

    &_img {
      width: 106px;
      height: 106px;
      margin-left: 6px;
      object-fit: contain;

      img {
        border-radius: 5px;
      }

      &:first-child {
        margin-left: 0;
      }
    }
  }

  .use-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &_left {
      height: 100%;
      display: flex;
      align-items: center;

      .info {
        width: 80%;
        display: flex;
        flex-direction: column;
        margin-left: 8px;

        span {
          display: block;
          max-width: 180px;
          color: #111;
          /*单行超出显示省略号*/
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          &:last-child {
            color: #666;
          }
        }
      }
    }
  }
}

.fouce-bt {
  width: 64px;
  height: 30px;
}
</style>
