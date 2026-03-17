<script setup lang="ts">
import type { CommentItem } from '@types'

const props = defineProps<{
  id?: string | number
  isSub?: boolean
  item: CommentItem
  moreApi?: string
  likeApi?: string
}>()

const emit = defineEmits<{
  comment: [e: CommentItem]
  loadMore: [e: { id: number; items: CommentItem[] }]
}>()

const __ = useNuxtApp()

const show_sub_comment = ref(true)

const getMore = __.$Api.createApi({
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
    <dx-avatar class="mr-1 flex-shrink-0" :size="0.96" :item="{ ...item.user, thumb: item.user?.thumb_url }" />
    <div class="flex-1">
      <div class="flex items-start">
        <div>
          <div class="mb-0.5 text-normal text-[#919191]">
            {{ item?.user?.nickname }}
          </div>
          <p class="text-mgary mb-0.5 text-base">
            {{ item.comment }}
          </p>
        </div>
      </div>
      <div class="flex items-center text-sm text-[#919191]">
        <div class="mr-1 text-mini">
          {{ item.created_at || item.createdAt }}
        </div>
        <span v-if="!isSub" @click="onComment">回复</span>
        <slot name="right" :comment="props.item" />
      </div>

      <ai-comment-item
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
      </ai-comment-item>
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
