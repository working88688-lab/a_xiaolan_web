<script setup lang="ts">
import type { CommentItem } from '@types'

const props = withDefaults(
  defineProps<{
    id?: string | number
    isSub?: boolean
    item: CommentItem
    moreApi?: string
    likeApi?: string
    avatarKey?: string
  }>(),
  {
    avatarKey: 'thumb_url'
  }
)

const emit = defineEmits<{
  comment: [e: CommentItem]
  loadMore: [e: { id: number; items: CommentItem[] }]
}>()

const __ = useNuxtApp()

const show_sub_comment = ref(true)

const getMore = __.$Api.dynamic({
  url: props.moreApi,
  axiosConfig: {
    showSuccess: true
  }
})

async function onLoadMore() {
  try {
    const res = (await getMore({
      comment_id: props.item.id
    })) as any
    console.log('res: ', res)

    emit('loadMore', { id: props.item.id, items: res.data.list })
  } catch (error) {
  } finally {
    show_sub_comment.value = false
  }
}

function onComment() {
  emit('comment', props.item)
}
</script>

<template>
  <div class="flex items-start pb-1">
    <dx-avatar class="mr-1 flex-shrink-0" :size="0.96" v-bind="{ ...item.user, img: item.user?.[props.avatarKey] }" />
    <div class="flex-1">
      <div class="flex items-start">
        <div>
          <div class="mb-0.5 text-normal">
            {{ item?.user?.nickname }}
          </div>
          <p class="mb-0.5 text-base text-[#4d4d4d]">
            {{ item.comment }}
          </p>
        </div>
        <slot name="right" :comment="props.item" />
      </div>
      <div class="flex text-sm">
        <div class="text-mini text-[#808080]">
          {{ item.created_at }}
        </div>
        <span v-if="!isSub" class="ml-3 text-primary" @click="onComment">回复</span>
      </div>

      <comment-reply-item
        v-for="sub_item in item.comments"
        :key="sub_item.id"
        class="mt-1"
        is-sub
        :api="props.likeApi"
        :item="sub_item"
      >
        <template #right>
          <slot name="right" :comment="sub_item" />
        </template>
      </comment-reply-item>
      <div
        v-if="item.comments?.length >= 3 && props.moreApi && show_sub_comment"
        class="flex-center text-sm"
        @click="onLoadMore"
      >
        <van-icon class="mr-0.5" name="arrow-down" />
        查看更多
      </div>
    </div>
  </div>
</template>
