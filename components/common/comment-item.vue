<template>
  <div>
    <div class="comment-layout">
      <div class="flex justify-between">
        <div class="userinfo">
          <dx-avatar :img="data.user.avatar_url"></dx-avatar>
          <div class="mb10">
            <div class="user-name">{{ data.user.nickname }}</div>
            <div class="user-name">{{ data.created_at }}</div>
          </div>
          <!-- <div v-if="data.user.uid == user.uid" class="landlord">本人</div> -->
        </div>
        <dx-btn-like
          :id="props.data.id"
          class="cursor-pointer"
          align="row"
          :like="props.data.is_like === 1"
          :api="__.$Api.Community.like_comment"
          :likes="props.data.like_num"
          icon="good-job-o"
          active-icon="good-job"
          :params="{
            id: props.id,
            comment_id: data.id
          }"
          :use-toast="false"
        ></dx-btn-like>
      </div>
      <span class="txt">{{ data.comment }}</span>
    </div>

    <div
      v-for="(item, index) in data.comments"
      :key="index"
      class="comment-layout ml30"
      :style="{ marginLeft: 30 }"
      @click.stop
    >
      <div class="flex justify-between">
        <div class="userinfo">
          <dx-avatar :img="item.user.avatar_url"></dx-avatar>
          <div class="mb10">
            <div class="user-name">{{ item.user.nickname }}</div>
            <div class="user-name">{{ item.created_at }}</div>
          </div>
          <!-- <div v-if="data.user.uid == user.uid" class="landlord">本人</div> -->
        </div>
        <dx-btn-like
          :id="props.data.id"
          align="row"
          :like="props.data.is_like === 1"
          :api="__.$Api.Community.like_comment"
          :likes="props.data.like_num"
          icon="good-job-o"
          active-icon="good-job"
          :params="{
            id: props.id,
            comment_id: data.id
          }"
          :use-toast="false"
        ></dx-btn-like>
      </div>
      <span class="txt">{{ item.comment }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentItem } from '@types'

const props = defineProps<{
  id: number | string
  data: CommentItem
}>()

const __ = useNuxtApp()
const { u: user } = storeToRefs(useUserStore())
</script>

<style lang="postcss" scoped>
@import '@styles/post-comment';
</style>
