<script setup lang="ts">
const __ = useNuxtApp()
const { data, loading, execute } = useMyFetch<{
  items: any[]
}>({
  api: __.$Api.User.notices,
  immediate: true
})

const navigateTo = (item: any) => {
  const { type } = item
  if (type === 1) {
    __.$NavigateTo('/syscomment')
  }
  if (type === 2) {
    __.$NavigateTo('/fans')
  }
  if (type === 3) {
    __.$NavigateTo('/sysnotice')
  }
  if (type === 5) {
    __.$NavigateTo('/syslike')
  }
}

const route = useRoute()
const list_ref = useTemplateRef('list')
const noticeDebug = import.meta.env.DEV && import.meta.client

function stringOrEmpty(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

function looksLikeImageUrl(s: string): boolean {
  if (!s) return false
  // 兼容后端返回的完整 URL / 根相对路径 / upload 路径
  if (/^(https?:\/\/\S+|\/\S+)$/.test(s)) {
    if (/\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(s)) return true
    if (/\/upload[_/]/i.test(s)) return true
  }
  return false
}

function hasImagePayload(v: unknown): boolean {
  if (Array.isArray(v)) return v.length > 0
  if (v && typeof v === 'object') return Object.keys(v as Record<string, any>).length > 0
  return !!stringOrEmpty(v)
}

function isImageType(v: unknown): boolean {
  if (typeof v === 'number') return v === 2
  if (typeof v === 'string') {
    const t = v.trim().toLowerCase()
    return t === '2' || t === 'image' || t === 'img' || t === 'pic' || t === 'photo'
  }
  return false
}

function getChatPreview(item: any): string {
  // 1) 优先取常见文本字段
  const textCandidates = [
    item?.chat_log,
    item?.content,
    item?.last_content,
    item?.last_message?.content,
    item?.last_msg?.content
  ]
  for (const raw of textCandidates) {
    const s = stringOrEmpty(raw)
    if (!s) continue
    // 历史格式：[图片] <url>
    if (/^\[图片\](\s+\S+)?$/u.test(s)) return '[图片]'
    // 新格式：content 直接存图片 url
    if (looksLikeImageUrl(s)) return '[图片]'
    return s
  }

  // 2) 再看类型字段（部分接口仅给 type，不给文案）
  const typeCandidates = [
    item?.chat_log_type,
    item?.msg_type,
    item?.message_type,
    item?.last_message?.type,
    item?.last_msg?.type
  ]
  if (typeCandidates.some(isImageType)) return '[图片]'

  // 3) 最后兜底看图片载荷字段
  const imageCandidates = [
    item?.images,
    item?.image,
    item?.img,
    item?.thumb,
    item?.pic,
    item?.last_message?.images,
    item?.last_message?.image,
    item?.last_msg?.images,
    item?.last_msg?.image
  ]
  if (imageCandidates.some(hasImagePayload)) return '[图片]'

  return ''
}

function debugChatFriendsResponse(res: any) {
  if (!noticeDebug) return
  const list = Array.isArray(res?.data?.list) ? res.data.list : []
  // eslint-disable-next-line no-console
  console.log('%c[my/notice 私信] /api/message/friends 原始响应', 'color:#1677ff;font-weight:700', res)
  // eslint-disable-next-line no-console
  console.table(
    list.map((it: any) => ({
      uid: it?.friend?.uid,
      nickname: it?.friend?.nickname,
      chat_log: it?.chat_log,
      chat_log_type: it?.chat_log_type,
      msg_type: it?.msg_type,
      message_type: it?.message_type,
      last_message_type: it?.last_message?.type,
      last_message_content: it?.last_message?.content,
      msg_count: it?.msg_count,
      preview: getChatPreview(it) || '暂无新消息'
    }))
  )
}

const beforeClose = async (item: any) => {
  return new Promise(resolve => {
    showConfirmDialog({
      title: '确定删除消息记录吗？'
    })
      .then(() => {
        return __.$Api.User.chat_remove_friend({
          uid: item.friend.uid
        }).then(() => {
          list_ref.value?.refresh_data()
          resolve(true)
        })
      })
      .catch(() => resolve(false))
  })
}

const { key, activeTab } = useKeepAlive({
  active() {
    activeTab.value = Number(route.query._index)
  }
})
</script>
<template>
  <div :key="key" class="container">
    <dx-tabs v-model:active="activeTab" line-width="30px" center gap="8px" class="dx-tabs">
      <template #left>
        <nuxt-icon class="!absolute left-0 top-0 p-1.5 text-4xl" name="arrow-left" @click="$router.back"></nuxt-icon>
      </template>
      <van-tab title="私信">
        <div class="my-1 flex justify-end px-1.5">
          <add-chat-num v-if="key"></add-chat-num>
        </div>
        <div class="scroll-container h-full">
          <dx-hoc-list
            v-if="key"
            ref="list"
            :pullup="false"
            :fetch-props="{ useShallowRef: true }"
            :params="{ size: 10 }"
            :api="__.$Api.User.chat_friends"
            :success="debugChatFriendsResponse"
          >
            <template #item="{ item }">
              <van-swipe-cell :before-close="() => beforeClose(item)" stop-propagation>
                <van-cell :border="false" title="单元格" value="内容">
                  <template #title>
                    <nuxt-link
                      :key="item.id"
                      :to="`/chat/room?uid=${item.friend.uid}&name=${item.friend.nickname}`"
                      class="flex"
                    >
                      <div class="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full">
                        <dx-image :src="item.friend.avatar_url"></dx-image>
                      </div>
                      <div class="ml-1 flex-1">
                        <div class="text-xl">{{ item.friend.nickname }}</div>
                        <div class="flex text-sm">
                          {{ getChatPreview(item) || '暂无新消息' }}
                          <van-badge v-if="item.msg_count > 0" position="" :content="item.msg_count" />
                        </div>
                      </div>
                    </nuxt-link>
                  </template>
                  <template #value>
                    {{ item.chat_log_date }}
                  </template>
                </van-cell>
                <template #right>
                  <van-button square type="danger" text="删除" />
                </template>
              </van-swipe-cell>
            </template>
          </dx-hoc-list>
        </div>
      </van-tab>

      <van-tab title="通知消息">
        <scroll-list v-model:loading="loading" :pull-down-refresh="execute">
          <div class="dx-list">
            <div v-for="(item, index) in data?.items" :key="index" class="msg-item-default" @click="navigateTo(item)">
              <div class="icon">
                <img v-lazyLoad="item.icon" role="icon" />
              </div>
              <div class="info">
                <div class="title">{{ item?.title }}</div>
                <div class="subtitle">{{ item?.content || '暂无消息' }}</div>
              </div>
            </div>
          </div>
        </scroll-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<style lang="postcss" scoped>
.msg-item-default {
  padding: 12px 0;
  display: flex;
  align-items: center;

  .icon {
    width: 60px;
    height: 60px;
    margin-right: 12px;
    border-radius: 50%;
    overflow: hidden;
  }

  .info {
    flex: 1;

    .title {
      font-size: 16px;
      font-weight: bold;
      color: #1a1a1a;
    }

    .subtitle {
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
  }
}
:deep(.van-tab__panel) {
  display: flex;
  flex-direction: column;
}
</style>
