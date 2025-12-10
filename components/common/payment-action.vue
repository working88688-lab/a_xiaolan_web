<template>
  <van-action-sheet
    teleport="body"
    :closeable="false"
    title="选择支付方式"
    v-bind="$attrs"
    @closed="onClosed"
    @click-overlay="close"
    @open="onOpen"
  >
    <div class="user-recharge-layer-content">
      <p class="user-recharge-layer-title">
        已选择
        <span class="color">{{ selectItem.name }}</span>
      </p>
      <van-radio-group v-model="checked">
        <van-cell-group :border="false" inset>
          <van-cell v-for="item in lists" :key="item.type" :border="false" clickable @click="onSelect(item)">
            <template #right-icon>
              <van-radio checked-color="rgb(247, 126, 84)" :name="item.type" />
            </template>
            <template #title>
              <div class="flex items-center">
                <img v-lazyLoad="item.icon" class="icon-box" alt="" />
                {{ item.name }}
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <div class="user-recharge-layer-btn" @click="onSubmit">立即充值</div>
    </div>
  </van-action-sheet>
</template>

<script setup lang="ts">
type PayItem = {
  name: string
  icon: string
  type: string
}

const props = withDefaults(
  defineProps<{
    data?: any
    target?: string
  }>(),
  {
    data: undefined,
    target: 'pw_new'
  }
)
const __ = useNuxtApp()
const checked = ref('')
const selectItem = ref({
  name: '',
  icon: '',
  type: ''
})

const lists = computed(() => {
  return props.data?.[props?.target] ?? []
})

const emit = defineEmits<{
  'update:show': [e: boolean]
  submit: [e: PayItem]
}>()
const close = () => {
  emit('update:show', false)
}
const onClosed = () => {
  checked.value = ''
  selectItem.value = {
    name: '',
    icon: '',
    type: ''
  }
}
const onSelect = (item: PayItem) => {
  selectItem.value = { ...item }
  checked.value = item.type
}
const onSubmit = async () => {
  if (!checked.value) {
    return __.$Toast('请选择支付方式')
  }
  const origin = `${window.location.origin}/`

  const winRef = window.open(`${origin}waiting.html`, '_blank')

  try {
    const tempParam = {
      pw: checked.value,
      pt: 'online',
      product_id: props.data.id
    }
    const res = await __.$Api.User.createP(tempParam)
    if (res?.status === 1) {
      onClosed()
      close()
      __.$Alert({
        title: '温馨提示',
        confirmButtonText: '知道了',
        confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)',
        message: () =>
          h(
            'div',
            {
              style: { padding: '0 .4rem', textAlign: 'left' }
            },
            [
              h('p', null, '1、充值高峰期间到账可能存在延迟，请稍作等待；'),
              h(
                'p',
                null,
                '2、如遇充值多次失败、长时间未到账且消费金额未返还情况，请在“充值记录”中选择该订单说明情况，我们会尽快处理。'
              )
            ]
          )
      })
      if (res?.data?.pay_type === 'url' && res?.data?.pUrl && winRef) {
        winRef.location = res?.data?.pUrl
      } else {
        __.$Alert({
          title: '温馨提示',
          message: '获取支付地址失败',
          confirmButtonText: '知道了'
        })

        if (winRef) {
          winRef.location = `${origin}error.html`
        }
      }
    }
    emit('submit', selectItem.value)
  } catch (error) {
    __.$Alert({
      title: '温馨提示',
      message: '请求支付失败',
      confirmButtonText: '知道了'
    })
    if (winRef) {
      winRef.location = `${origin}error.html`
    }
  }
}

const onOpen = () => {
  const [item] = lists.value
  selectItem.value = { ...item }
  checked.value = item.type
}
</script>

<style lang="less" scoped>
.user-recharge-layer-content {
  color: var(--dx-base1-color);
  .icon-box {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    margin-right: 4px;
    overflow: hidden;
    vertical-align: middle;
  }
  .user-recharge-layer-title {
    padding: 0.25rem 32px;
    font-size: 0.35rem;

    .color {
      padding-left: 0.2rem;
      font-size: 0.35rem;
      color: #1989fa;
    }
  }

  .user-recharge-layer-btn {
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    font-size: 0.4rem;
    color: #000;
    background-image: linear-gradient(to top, #efc87e, #f4deac);
    border-radius: 0.6rem;
    margin: 0.5rem 0;
  }
}
</style>
