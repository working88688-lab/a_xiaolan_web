<template>
  <div ref="containerRef" class="comment-input-container van-hairline--top" :class="classNames">
    <div class="flex items-center px-1 py-1">
      <slot name="left"></slot>
      <div class="input-box">
        <slot name="icon"></slot>
        <!-- <van-icon name="edit" class="text-base10" /> -->
        <input ref="inputRef" v-model="model" class="pl-0.5" type="text" :placeholder="_placeholder" @focus="onFocus"
          @blur="onBlur" />
      </div>

      <slot name="right"></slot>
      <div class="flex-col-center ml-1 text-primary" @click="onSubmit">
        <nuxt-icon class="text-3xl" name="send"></nuxt-icon>
        <span class="text-sm">发送</span>
      </div>
    </div>
    <div class="van-safe-area-bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    api?: any
    params?: any
    placeholder?: string
    fixed?: boolean
    autoFocus?: boolean
  }>(),
  {
    fixed: true,
    autoFocus: true
  }
)

const emit = defineEmits<{
  close: []
  submit: []
  success: []
}>()

const model = defineModel<string>()
const reply = defineModel<any>('reply')

const _placeholder = computed(() => {
  return props.placeholder
    ? props.placeholder
    : reply.value?.user
      ? `回复：${reply.value?.user?.nickname}`
      : '我来评论下'
})

const __ = useNuxtApp()
const [, bem] = createNamespace('comment-input')
const inputRef = ref()
const containerRef = ref()
const isFocus = ref(false)

const api =
  typeof props.api === 'string'
    ? __.$Api.dynamic({
      url: props.api,
      method: 'post',
      axiosConfig: {
        showError: true,
        showSuccess: true
      }
    })
    : props.api

const onSubmit = async () => {
  try {
    if (api) {
      if (!model.value) {
        return __.$Toast('请输入评论内容～')
      }
      api({
        content: model.value,
        ...props.params
      }).then(() => {
        model.value = ''
        emit('success')
      })
    } else {
      emit('submit')
    }

    nextTick(() => {
      close()
    })
  } catch (error) {
    console.log('error: ', error)
  }
}

const classNames = computed(() => {
  return [
    bem({
      fixed: props.fixed
    })
  ]
})

onClickOutside(containerRef, e => {
  close()
})

function close() {
  emit('close')
  reply.value = {}
}

const onFocus = () => {
  nextTick(() => {
    isFocus.value = true
    setTimeout(() => {
      inputRef.value?.scrollIntoView()
      inputRef.value?.scrollIntoViewIfNeeded()
    }, 300)
  })
}

const onBlur = () => {
  isFocus.value = false
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  focus
})
</script>

<style lang="postcss" scoped>
.comment-input-container {
  &--fixed {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    z-index: 99;
    display: flex;
    flex-direction: column;
  }
}

.input-box {
  display: flex;
  align-items: center;
  flex: 1;
  height: 1rem;
  border-radius: 50px;
  padding: 0 12px;
  background-color: var(--dx-base10-color);

  img {
    width: 0.25rem;
    height: auto;
    margin-right: 10px;
  }

  input {
    border: none;
    flex: 1;
    background-color: transparent;
    font-size: 12px;
    /* color: #333; */
  }

  input::placeholder {
    color: var(--dx-base3-color);
  }
}
</style>
