<template>
  <div class="container bg-white">
    <div class="scroll-container">
      <scroll-list :loading="loading">
        <van-field label="问题类型" class="dx-form-input" placeholder="顶部对齐" label-align="top">
          <template #input>
            <van-radio-group v-model="state.type" class="!grid w-full grid-cols-4 gap-1" direction="horizontal">
              <van-radio v-for="item in data?.list" :key="item.id" :name="item.id">
                <template #icon></template>
                {{ item.name }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="state.content"
          class="feedback-content dx-form-input"
          rows="4"
          type="textarea"
          label="问题描述"
          placeholder="输入内容"
          show-word-limit
          :maxlength="2000"
          label-align="top"
        />
        <dx-input-image v-model="state.images" :limit="9"></dx-input-image>
      </scroll-list>
    </div>
    <div class="van-safe-area-bottom my-1 px-1 text-center">
      <dx-button block :round="false" :loading="submiting" @click="onSubmit">确认提交</dx-button>
      <p class="mt-1 text-[#808080]">请反馈信息后，找客服领取奖励</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const state = reactive<{
  type?: number
  content: string
  images: []
}>({
  type: undefined,
  content: '',
  images: []
})

let defaultType: number
const ctx = useNuxtApp()
const { data, loading } = useMyFetch<{
  list: Array<{ name: string; id: number }>
}>({
  api: ctx.$Api.dynamic({
    url: '/api/system/feedback_reward_types'
  }),
  immediate: true,
  success() {
    defaultType = data.value?.list?.[0]?.id ?? ''
    state.type = defaultType
  }
})

const { validate } = useValidator({
  content: [
    {
      type: 'string',
      required: true,
      message: '请填写问题描述'
    }
  ],
  images: {
    type: 'array',
    required: true,
    message: '请添加图片'
  }
})

const _submit = ctx.$Api.dynamic({
  url: 'api/system/feedback_reward'
})
const submiting = ref(false)
const onSubmit = async () => {
  try {
    const { content, type, images } = state
    await validate({
      content,
      images
    })
    submiting.value = true
    const medias = [...images].map(item => ({ media_url: item.url }))
    const res = await _submit({
      content,
      type,
      images: JSON.stringify(medias)
    })
    console.log(res)
    state.type = defaultType
    state.images = []
    state.content = ''
    ctx.$Alert({
      title: '您的反馈已提交',
      confirmButtonText: '完成'
    })
  } catch (error) {
  } finally {
    submiting.value = false
  }
}
</script>

<style lang="postcss" scoped>
.feedback-content {
  :deep(.van-cell__value) {
    background-color: #f6f7f8;
    padding: 8px;
    border-radius: 4px;
  }
}

.van-radio {
  background-color: #f6f7f8;
  margin-right: 0 !important;

  :deep(.van-radio__label) {
    margin: 6px auto;
    font-size: 11px;
    border-radius: 4px;
    overflow: hidden;
  }
  &[aria-checked='true'] {
    background: linear-gradient(to right, rgb(66, 138, 247), rgb(109, 230, 251));

    :deep(.van-radio__label) {
      color: #fff;
    }
  }
}
</style>
