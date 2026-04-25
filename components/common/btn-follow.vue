<template>
  <div
    v-if="is_not_self"
    class="btn_follow"
    :class="{
      has_style: props.useDefaultStyle,
      followed: follow
    }"
    @click.stop="onFollow"
  >
    <slot :text="text" :follow="follow">
      {{ text }}
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    uid?: number
    attention?: 0 | 1
    api?: any
    params?: any
    useDefaultStyle?: boolean
    symbol?: string
    useToast?: boolean
  }>(),
  {
    uid: undefined,
    attention: undefined,
    api: undefined,
    params: undefined,
    useDefaultStyle: false,
    symbol: undefined,
    useToast: false
  }
)
const emit = defineEmits<{
  success: [e: number]
}>()
const __ = useNuxtApp()
const slots = defineSlots<{
  default(props: { text: string; follow: boolean }): any
}>()

const follow = ref(props.attention === 1)
const text = computed(() => {
  return follow.value ? '已关注' : `${props.symbol || ''}关注`
})

const followDebug = import.meta.env.DEV && import.meta.client

const _api = props.api || __.$Api.User.updateFollow

function buildPayload() {
  const base =
    typeof props.params === 'function'
      ? props.params()
      : props.params || {
          to_uid: props.uid
        }
  return { ...base }
}

const onFollow = async (_data: any) => {
  try {
    const payload = buildPayload()
    if (payload?.to_uid == null || payload?.to_uid === '') {
      if (followDebug) {
        console.warn('[btn-follow] 缺少 to_uid，已拦截请求', { uid: props.uid, params: props.params, payload })
      }
      __.$Toast('操作太频繁')
      return
    }
    if (followDebug) {
      console.groupCollapsed(
        '%c[btn-follow] 请求 payload',
        'background:#111827;color:#fff;padding:6px 10px;border-radius:8px;font-weight:900'
      )
      console.log('api =', _api)
      console.log('payload =', payload)
      console.groupEnd()
    }
    const { data } = await _api(payload)

    follow.value = !follow.value

    if (props?.useToast ?? true) {
      __.$Toast(data?.msg || data?.message)
    }
    __.$Emitter.emit('cache', {
      module: 'user',
      data: {
        uid: props.uid,
        is_attention: +follow.value
      }
    })
    emit('success', follow.value ? 1 : -1)
  } catch (error) {}
}
watchEffect(() => {
  follow.value = props.attention === 1
})

const is_not_self = computed(() => {
  return __.$Store.user.u.uid !== props.uid
})
</script>

<style lang="less">
.btn_follow.has_style {
  width: 64px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px #548aef;
  text-align: center;
  background-color: #548aef;
  color: #fff;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
