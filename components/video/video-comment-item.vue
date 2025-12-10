<template>
  <div class="video-comment-item flex">
    <div class="video-comment-avatar"><dx-image :src="item.user.thumb" /></div>
    <div class="video-comment-content">
      <div class="video-comment-info">
        <div class="comment-info-text">
          <div>{{ item.user.nickname }}</div>
          <div class="time">{{ item.createdAt }}</div>
          <div class="text" @click.stop="onReply(item)">{{ item[props.commentKey] }}</div>
        </div>

        <dx-btn-like
          :id="item.id"
          align="column"
          :like="item.hasLike"
          :api="api"
          :likes="item.likes"
          icon="good-job-o"
          active-icon="good-job"
          :use-toast="false"
        >
          <template #default="{ likes }">
            {{ $Utils.formatNumber(likes, 'en') }}
          </template>
        </dx-btn-like>
      </div>
      <div v-for="(comment, _index) in item.child" :key="comment.id" class="video-comment-item flex">
        <div class="video-comment-avatar" @click.stop="onReply(comment)"><dx-image :src="comment.user.thumb" /></div>
        <div class="video-comment-content">
          <div class="video-comment-info" @click.stop="onReply(comment)">
            <div class="comment-info-text">
              <div>{{ comment.user.nickname }}</div>
              <div class="time">{{ comment.createdAt }}</div>
              <div class="text" @click.stop="onReply(comment)">{{ comment[props.commentKey] }}</div>
            </div>

            <dx-btn-like
              :id="comment.id"
              align="column"
              :like="comment.hasLike"
              :api="__.$Api.Video.likingComments"
              :likes="comment.likes"
              :use-toast="false"
              icon="good-job-o"
              active-icon="good-job"
            >
              <template #default="{ likes }">
                {{ $Utils.formatNumber(likes, 'en') }}
              </template>
            </dx-btn-like>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiLike, CommentItem } from '@types'

const props = withDefaults(
  defineProps<{
    item: CommentItem
    api: ApiLike | string
    commentKey?: string
  }>(),
  {
    commentKey: 'comment'
  }
)

const emit = defineEmits<{
  reply: [e: CommentItem]
}>()

const onReply = (item: CommentItem) => {
  emit('reply', item)
}
const __ = useNuxtApp()
</script>

<style lang="postcss" scoped>
.video-comment-item {
  .video-comment-avatar {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.3rem;
  }
  .video-comment-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 0.35rem;
    color: #777;
    .video-comment-info {
      display: flex;
      align-items: flex-start;
      .comment-info-text {
        flex: 1;
        .time {
          font-size: 0.32rem;
          padding-top: 0.1rem;
          padding-bottom: 0.2rem;
        }
        .text {
          color: #333;
          font-weight: 500;
          padding-bottom: 0.3rem;
        }
      }
    }
  }
}
</style>
