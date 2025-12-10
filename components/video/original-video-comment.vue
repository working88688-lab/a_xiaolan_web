<template>
  <div class="container">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :is-end="isEnd" :is-empty="isEmpty" :pullup="fetchData">
        <div class="px-1.5 pt-2">
          <div v-for="(data, index) in listData" :key="data.id" class="comment-container">
            <div class="comment-avatar"><dx-image :src="data.user.avatar_url" /></div>
            <div class="comment-content">
              <div class="comment-info">
                <div class="comment-info-text">
                  <div>{{ data.user.nickname }}</div>
                  <div class="time">{{ data.created_at }}</div>
                  <div class="text" @click.stop="onReply(data)">{{ data.content }}</div>
                </div>
                <dx-btn-like
                  :id="data.id"
                  icon="good-job-o"
                  active-icon="good-job"
                  :likes="data.like_num"
                  :like="data.is_like === 1"
                  :api="__.$Api.original.like_comment"
                  :params="{
                    comment_id: data.id,
                    id: props.id
                  }"
                  :use-toast="false"
                >
                  <template #default="{ likes }">
                    <span class="text-nowrap">{{ likes > 0 ? likes : '点赞' }}</span>
                  </template>
                </dx-btn-like>
              </div>
            </div>
          </div>
        </div>
      </scroll-list>
    </div>
    <div
      class="video-comment-submit"
      :class="{
        active: switchSao
      }"
    >
      <div class="video-comment-input">
        <input v-model="inputValue" :disabled="!isVip" :placeholder="placeholder" />
        <div class="menu"><img :src="switchSao ? menuopen : menuclose" @click.stop="getSaoLists" /></div>
        <div class="submit" @click="onComment">
          <img :src="inputValue ? arrow_active : arrow_icon" />
        </div>
      </div>
      <div v-show="switchSao" class="scroll-container">
        <scroll-list :loading="saoLoading">
          <div class="video-comment-sao">
            <div v-for="(item, index) in sao" :key="index" class="comment-sao-item" @click="select(item)">
              {{ item.tips }}
            </div>
            <div style="height: '1.5rem'" />
          </div>
        </scroll-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OriginalCommentItem, SaoItem } from '@types'

import arrow_icon from '~/assets/image/video/arrow.png'
import arrow_active from '~/assets/image/video/arrow_active.png'
import menuclose from '~/assets/image/video/menuclose.png'
import menuopen from '~/assets/image/video/menuopen.png'

const props = defineProps<{
  id: string | number
}>()

const inputValue = ref('')
const sid = ref()
const reply = ref<any>(null)
const __ = useNuxtApp()

const { value: switchSao, toggle } = useBoolean()
const { listData, execute, loading, isEmpty, isEnd, result, refresh, reset } = useFetchList<OriginalCommentItem>({
  api: __.$Api.original.comment_list,
  startRefreshEmptyData: true
})
const {
  data: sao,
  execute: saoExcute,
  loading: saoLoading
} = useMyFetch<SaoItem[]>({
  api: __.$Api.Video.saoTalk
})
const getSaoLists = () => {
  if (!sao.value?.length) {
    saoExcute()
  }
  toggle()
  if (!switchSao.value) {
    inputValue.value = ''
  }
}
const isVip = computed(() => {
  return result.value?.isVV ?? false
})

const placeholder = computed(() => {
  let text = ''
  if (isVip.value) {
    text = '能不能火就靠你了～'
  } else {
    text = '您还不是VIP用户，只能发送骚话～'
  }
  if (reply.value) {
    text = `回复 ${reply.value?.user?.nickname}`
  }
  if (switchSao.value) {
    text = '请选择骚话'
  }
  return text
})

const select = (item: SaoItem) => {
  inputValue.value = item.tips
  sid.value = item.id
}

const fetchData = () => {
  if (props.id) {
    return execute({
      id: props.id
    })
  }
}

const onReply = (item: CommentItem) => {
  reply.value = item
}
const onComment = async () => {
  if (!inputValue.value || !sid.value) {
    return
  }
  try {
    switchSao.value = false
    if (inputValue.value) {
      await __.$Api.original.comment({
        id: props.id,
        content: inputValue.value || sid.value
      })

      refresh({
        id: props.id
      })
    }
  } catch (error) {
  } finally {
    reply.value = null
    sid.value = ''
    inputValue.value = ''
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.video-comment-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 45px;
  text-align: center;
  padding: 0 0.3rem;
  box-sizing: border-box;
  color: #000;
  span {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
  }
  img {
    width: 24px;
    height: 24px;
  }
}

.comment-container {
  display: flex;
  flex-direction: flex;
  .comment-avatar {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 0.3rem;
  }
  .comment-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 0.35rem;
    color: #777;
    .comment-info {
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
      .commen-like {
        width: 0.8rem;
        font-size: 0.3rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        .like {
          width: 0.5rem;
          margin-bottom: 0.1rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.video-comment-input {
  width: 10rem;
  min-height: 1.2rem;
  padding: 0 0.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  input {
    flex: 1;
    background-color: transparent;
    caret-color: #428af7;
    border: none;
    font-size: 0.37rem;
    color: #333;
    &::placeholder {
      color: #bbb;
    }
  }
  .menu {
    width: 1rem;
    box-sizing: border-box;
    padding: 0.2rem;
    img {
      width: 100%;
    }
  }
  .submit {
    width: 1rem;
    box-sizing: border-box;
    padding: 0.2rem;
    img {
      width: 100%;
    }
  }
}

.video-comment-submit {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  &.active {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

.video-comment-sao {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.3rem;
  background-color: #f6f7f8;
  .comment-sao-item {
    width: 100%;
    padding: 0.3rem 0.3rem;
    box-sizing: border-box;
    font-size: 0.36rem;
    color: #666;
  }
}
</style>
