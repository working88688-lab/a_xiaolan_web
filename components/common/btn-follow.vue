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

const _api = props.api || __.$Api.User.updateFollow
const params = props.params || {
  to_uid: props.uid
}

const onFollow = async (_data: any) => {
  try {
    const { data } = await _api(params)

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
  width: 84px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px #548aef;
  line-height: 30px;
  text-align: center;
  color: #548aef;
  font-size: 13px;
}
</style>
