<script setup lang="tsx">
// const props = defineProps<{}>()
const __ = useNuxtApp()
const route = useRoute()

const add_ref = useTemplateRef('add')
const { u: user } = storeToRefs(useUserStore())

const { reply, commentValue, refresh_comments } = useComment()

const _refresh = () => {
  refresh_comments()
  add_ref.value?.refresh()
}
const re_factory_item = (item: any) => {
  return item.is_self
    ? {
        ...item,
        reply_content: '',
        createAt: item.formate_date
      }
    : {
        ...item,
        content: '',
        reply_content: item.content,
        replyAt: item.formate_date
      }
}
</script>

<template>
  <div class="container">
    <dx-navbar>
      <template #left>
        <div class="flex">
          <nuxt-icon class="mr-2 text-4xl" name="arrow-left"></nuxt-icon>
          {{ route.query.name }}
        </div>
      </template>

      <template #right>
        <add-chat-num ref="add"></add-chat-num>
      </template>
    </dx-navbar>
    <van-notice-bar color="#1989fa" wrapable :scrollable="false" background="#ecf9ff" class="mb-0.5 !text-sm">
      请勿发送广告等违规消息，谨防私下交易上当受骗。违规用户将被永久禁言处理。
    </van-notice-bar>
    <div class="scroll-container">
      <dx-hoc-list
        ref="listRef"
        :pullup="false"
        :api="__.$Api.User.friendMessage"
        :list-props="{
          emptyTip: '暂无聊天记录'
        }"
        :fetch-props="{
          useShallowRef: true
        }"
        :show-end="false"
        :params="{ uid: route.query.uid }"
      >
        <template #item="{ item }">
          <chat-record-item
            :key="item.id"
            :item="re_factory_item(item)"
            v-bind="re_factory_item(item)"
          ></chat-record-item>
        </template>
      </dx-hoc-list>
    </div>
    <dx-comment-input
      ref="commentRef"
      v-model="commentValue"
      v-model:reply="reply"
      class="bg-white"
      placeholder="说点好听的吧～"
      :api="__.$Api.User.chat"
      :params="{ uid: route.query.uid, chat_token: user.chat_token }"
      @success="_refresh"
    ></dx-comment-input>
  </div>
</template>

<style lang="postcss" scoped></style>
