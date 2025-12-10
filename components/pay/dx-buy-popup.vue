<!--
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-14 10:47:35
 * @Description: 支付弹框
-->

<script setup lang="ts">
import type { ApiLike, PayType, ResourceType, Result } from '@types'

const props = withDefaults(
  defineProps<{
    title?: string
    coins?: number
    successText?: string
    submitText?: string
    showSuccessAlert?: boolean
    successHandler?: (res: Result<any>) => boolean
    api?: ApiLike | string
    params?: Record<string, any>
    type: ResourceType
    payType?: PayType
    freeNum?: number
    cancelButtonText?: string
    message?: string
    cancelTo?: string
    confirmTo?: string
    alertTitle?: string
  }>(),
  {
    payType: 1,
    coins: 0,
    alertTitle: '温馨提示',
    showSuccessAlert: true,
    submitText: '立即支付',
    cancelButtonText: '取消',
    successText: '购买成功',
    params: () => ({}),
    successHandler: (res: any) => res.status === 1
  }
)

const emit = defineEmits<{
  'update:show': [e: boolean]
  'pay:success': [e: any]
}>()

const __ = useNuxtApp()
const loading = ref(false)
const paying = defineModel<boolean>('paying')
const router = useRouter()

const _title = computed(() => {
  return props.title || (props.payType === 1 ? '支付金币' : '免费解锁')
})
const userStore = useUserStore()
const { u: user } = storeToRefs(userStore)

const discount = computed(() => {
  const key = `${props.type}_discount` as const
  return (userStore.u.discount_info?.[key] ?? 100) / 100
})

const actual_coins = computed(() => {
  return Math.floor(props.coins * discount.value)
})

function onClose() {
  emit('update:show', false)
}

const config_map = {
  confirmButtonText: {
    1: '去充值',
    2: '去开通'
  },
  to: {
    1: '/coin-recharge',
    2: '/renewal'
  }
} as const

async function onPay() {
  paying.value = true
  loading.value = true

  try {
    const api =
      typeof props.api === 'string'
        ? __.$Api.dynamic({
            url: props.api,
            axiosConfig: {
              showError: false,
              throwError: false
            }
          })
        : props.api
    if (api) {
      const res = (await api(props.params)) as any
      console.log('res: ', res)
      loading.value = false
      paying.value = false
      onClose()
      if (props.successHandler(res)) {
        emit('pay:success', res.data?.url ?? '')
        props.showSuccessAlert &&
          __.$Alert({
            message: props.successText
          })
        __.$Store.user.info()
      } else {
        await __.$Alert({
          title: props.alertTitle,
          message: props.message || (props.payType === 1 ? '金币余额不足' : '剩余免费次数不足，开通VIP畅享无限解锁！'),
          confirmButtonText: config_map.confirmButtonText[props.payType],
          showCancelButton: true,
          cancelButtonText: props.cancelButtonText
        })
        onClose()

        router.push(props.confirmTo || config_map.to[props.payType])
      }
    }
  } catch (error) {
    console.log('error: ', error)

    if (error === 'cancel' && props.cancelTo) {
      router.push(props.cancelTo)
    }
    paying.value = false
  } finally {
    loading.value = false
    paying.value = false
  }
}

onDeactivated(onClose)
</script>

<template>
  <van-popup
    close-on-click-overlay
    position="bottom"
    :style="{ height: '6.2rem', width: '100%' }"
    :lock-scroll="false"
    teleport="body"
    v-bind="$attrs"
    closeable
    safe-area-inset-bottom
    close-on-popstate
    @click-overlay="onClose"
    @click-close-icon="onClose"
  >
    <div class="container">
      <div class="mb-2 mt-1.5 text-center text-xl font-medium">
        {{ _title }}
      </div>
      <div v-if="payType === 1" class="flex items-center justify-between px-1.5 pb-1">
        <span>金币余额：{{ user.coins ?? 0 }}</span>
        <nuxt-link to="/coin-recharge?type=1" class="text-primary underline underline-offset-2" @click="onClose">
          立即充值
        </nuxt-link>
      </div>
      <div v-else class="flex items-center justify-between px-1">
        <span>免费解锁</span>
        <span class="text-primary">剩余次数{{ props.freeNum }}</span>
      </div>
      <slot />

      <div class="mt-auto px-1.5 pb-2.5">
        <!-- <div v-if="payType === 1" class="mb-1 flex items-end justify-between pb-1">
          <span>支付金额</span>
          <span class="text-myellow">{{ props.coins }}金币</span>
        </div>
        <div v-if="payType === 1" class="mb-1.5 flex items-center justify-between text-myellow">
          <template v-if="discount === 1">
            <span>您当前不享受折扣优惠</span>
            <nuxt-link class="underline underline-offset-2" to="/renewal" @click="onClose">
              购买vip享受折扣
            </nuxt-link>
          </template>
          <template v-else>
            <span>您当前享受折扣优惠</span>
            <span>{{ discount * 10 }}折</span>
          </template>
        </div> -->

        <div class="van-hairline--top flex-1 pt-1.5">
          <div v-if="payType === 1" class="mb-2.5 flex items-center justify-between">
            实际支付
            <span class="ml-auto text-myellow">{{ actual_coins }}金币</span>
          </div>
          <dx-button block class="!h-[40px]" linear loading-text="支付中..." :loading="loading" @click="onPay">
            {{ props.submitText }}
          </dx-button>
          <div class="van-safe-area-bottom" />
        </div>
      </div>
    </div>
  </van-popup>
</template>
