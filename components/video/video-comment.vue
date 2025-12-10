<template>
  <div
    class="video-comment-submit van-safe-area-bottom"
    :class="{
      active: switchSao
    }"
  >
    <div class="video-comment-input">
      <input v-model="inputValue" :disabled="!isVip" :placeholder="placeholder" />
      <div class="menu"><img :src="menuclose" @click.stop="getSaoLists" /></div>
      <div class="submit" @click="onComment">
        <img :src="inputValue ? arrow_active : arrow_icon" />
      </div>
    </div>
    <van-popup
      v-model:show="switchSao"
      close-on-click-overlay
      close-on-popstate
      position="bottom"
      :style="{ height: '70%', width: '100%' }"
      :lock-scroll="false"
      :overlay="false"
      @click-overlay="onClose"
    >
      <div class="container">
        <div class="video-comment-input">
          <input v-model="inputValue" :disabled="!isVip" :placeholder="placeholder" />
          <div class="menu"><img :src="menuopen" @click.stop="getSaoLists" /></div>
          <div class="submit" @click="onComment">
            <img :src="inputValue ? arrow_active : arrow_icon" />
          </div>
        </div>
        <div class="scroll-container">
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
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import type { CommentItem, SaoItem } from '@types'

import arrow_icon from '~/assets/image/video/arrow.png'
import arrow_active from '~/assets/image/video/arrow_active.png'
import menuclose from '~/assets/image/video/menuclose.png'
import menuopen from '~/assets/image/video/menuopen.png'

const props = withDefaults(
  defineProps<{
    id: string | number
    type?: 0 | 1 | 2 | 3
  }>(),
  {
    type: 0
  }
)
const emit = defineEmits<{
  'update:show': [e: boolean]
  comment: []
}>()
const inputValue = ref('')
const sid = ref()
const reply = ref<any>(null)

const __ = useNuxtApp()

const onClose = () => {
  emit('update:show', false)
}

const { value: switchSao, toggle } = useBoolean()

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
  return __.$Store.user.u.is_vip ?? false
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

const onReply = (item: CommentItem) => {
  reply.value = item
}

const onComment = async () => {
  if (!inputValue.value && !sid.value) {
    return
  }

  try {
    switchSao.value = false
    if (props.type === 1 || props.type === 2) {
      await __.$Api.original.comment({
        id: props.id,
        content: inputValue.value || sid.value
      })
    } else if (props.type === 3) {
      const _api = __.$Api.dynamic({
        url: 'api/cartoon/comment'
      })
      await _api({
        id: props.id,
        content: inputValue.value || sid.value
      })
    } else {
      await __.$Api.Video.createsaoTalk({
        mv_id: props.id,
        c_id: reply.value?.id,
        s_id: sid.value,
        comment: inputValue.value
      })
    }
    emit('comment')
  } catch (error) {
  } finally {
    reply.value = null
    sid.value = ''
    inputValue.value = ''
  }
}

useDectivted(onClose)

defineExpose({
  onReply
})
</script>

<style lang="postcss" scoped>
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
