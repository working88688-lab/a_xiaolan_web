<template>
  <div class="comment-content-rezension">
    <div class="comment-content-rezension_left">
      <dx-btn-like align="row" icon="eye-o" :likes="item.view_num"></dx-btn-like>
      <dx-btn-like :id="item.id" class="cursor-pointer" :like="item.is_follow === 1" :likes="item.like_num"
        :api="__.$Api.User.likePost" :use-toast="false" align="row" :disabled="disabled"
        @success="onLike(item)"></dx-btn-like>

      <dx-btn-like align="row" icon-type="nuxt" icon="comment" :likes="item.comment_num"></dx-btn-like>
    </div>

    <div class="comment-content-rezension_topic cursor-pointer truncate" @click.stop="toTopic">
      #{{ item?.topic?.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostItem } from '@types'

const props = withDefaults(
  defineProps<{
    item?: PostItem
    isTopic?: boolean
    to?: string
    type?: number
    disabled?: boolean
  }>(),
  {
    item: () => ({}) as unknown as PostItem,
    isTopic: true,
    to: 'forum-detail',
    type: 1,
    disabled: false
  }
)

const emit = defineEmits<{
  like: [e: PostItem]
}>()

const __ = useNuxtApp()
const onLike = (item: PostItem) => {
  emit('like', item)
}

const toTopic = () => {
  if (props.isTopic) {
    __.$NavigateTo(`/${props.to}?id=${props.item?.topic?.id}`)
  }
}
</script>

<style lang="less" scoped>
.comment-content-rezension {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  &_left {
    display: flex;
    gap: 16px;

    .item {
      display: flex;
      align-items: center;

      img {
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 4px;
      }

      .normal {
        color: #666;
        font-size: 14px;
        white-space: nowrap;
      }

      .like {
        color: #ed6571;
        font-size: 13px;
      }
    }
  }

  &_topic {
    color: #548aef;
    font-size: 13px;
    max-width: 120px;
  }
}
</style>
