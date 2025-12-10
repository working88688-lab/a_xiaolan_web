<template>
  <van-dialog v-bind="$attrs" close-on-click-overlay :title="title" teleport="body" @close="onClose">
    <div class="alert-content">
      <div class="coin_input_box">
        <input v-model="inputValue" placeholder="输入打赏金额" type="number" />
      </div>
    </div>
    <template #footer>
      <dx-button class="btn-submit" @click="onSubmit">确定</dx-button>
    </template>
  </van-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 0 | 1
    id?: string
    replyId?: string | number
  }>(),
  {
    type: 1,
    id: undefined,
    replyId: undefined
  }
)
const emit = defineEmits<{
  'update:show': [e: boolean]
  success: []
}>()
const __ = useNuxtApp()

const inputValue = ref()

const title = computed(() => {
  return props.type === 1 ? '追加赏金' : '打赏'
})

const onClose = () => {
  emit('update:show', false)
}
const onSubmit = () => {
  if (!inputValue.value) {
    return __.$Toast(`请输入${title.value}`)
  }
  onClose()
  const api = props.type === 1 ? __.$Api.Community.appendCoins : __.$Api.Community.reward
  api({
    find_id: props.id,
    coins: inputValue.value,
    reply_id: props.replyId
  }).then(() => {
    emit('success')
  })
  inputValue.value = ''
}

useDectivted(onClose)
</script>

<style lang="less" scoped>
.btn-submit {
  width: 276px;
  margin: 12px auto;
  display: block;
}
.alert-content {
  margin: 30px 12px;
}
.coin_input_box {
  width: 100%;
  height: 1.133rem;
  padding: 0 0.32rem;
  font-size: 0.426rem;
  background: #3f3f51;
  border-radius: 0.13rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  color: #ffffff;
  input {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    text-align: center;
    color: #ffffff;
  }
}
</style>
