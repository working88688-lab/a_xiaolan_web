<template>
  <div class="btn_like cursor-pointer" :class="{
    'is-row': align === 'row',
    'is-column': align === 'column'
  }" @click.stop="onLike">
    <slot name="icon" :is-like="isLike">
      <van-icon v-if="iconType === 'van'" :size="iconSize" class="btn_like--icon" :class="{
        'text-mred': isLike
      }" :color="isLike ? props.activeColor : props.color" :name="isLike ? activeIcon || icon : icon" />
      <nuxt-icon v-if="iconType === 'nuxt'" class="btn_like--icon" :class="{
        'text-mred': isLike
      }" :style="{
          fontSize: size
        }" :name="isLike ? activeIcon || icon : icon" />
    </slot>
    <slot v-if="showCount" :likes="localLikes">
      {{ $Utils.formatNumber(localLikes, 'en') }}
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { ApiLike } from '@types'

const props = withDefaults(
  defineProps<{
    id?: number | string
    like?: boolean
    likes?: number
    api?: ApiLike | string
    params?: any
    size?: number | string
    align?: 'column' | 'row'
    useToast?: boolean
    icon?: string
    activeIcon?: string
    disabled?: boolean
    iconType?: 'van' | 'nuxt'
    color?: string
    activeColor?: string
    showCount?: boolean
    idKey?: string
  }>(),
  {
    id: undefined,
    like: false,
    likes: 0,
    api: undefined,
    params: () => ({}),
    size: '0.5rem',
    align: 'column',
    useToast: true,
    icon: 'like-o',
    activeIcon: 'like',
    disabled: false,
    iconType: 'van',
    showCount: true,
    idKey: 'id'
  }
)

const emit = defineEmits<{
  success: []
}>()

const __ = useNuxtApp()

const slots = defineSlots<{
  default(props: { likes: number }): any
  icon: (props: { isLike?: boolean }) => any
}>()

const isLike = ref(props.like)
const localLikes = ref(props.likes || 0)

const iconSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}rem` : props.size
})

const onLike = async (_data: any) => {
  if (props.disabled || !props.api) {
    return
  }
  const _api =
    typeof props.api === 'string'
      ? (__.$Api.dynamic({ url: props.api, method: 'post', axiosConfig: props.axiosConfig }) as unknown as ApiLike)
      : props.api

  try {
    const params = {
      ...props.params,
      [props.idKey]: props.id
    }

    const res = await _api(params)
    emit('success')
    isLike.value = !isLike.value
    localLikes.value = isLike.value ? localLikes.value + 1 : localLikes.value - 1

    if (props?.useToast ?? true) {
      // @ts-ignore
      __.$Toast(res.data?.msg || res.data?.message || res?.msg)
    }

    __.$Emitter.emit('cache', {
      module: 'like',
      data: {
        id: props.id,
        is_follow: +isLike.value,
        like_num: localLikes.value
      }
    })
  } catch (error) { }
}
watchEffect(() => {
  isLike.value = props.like
  localLikes.value = props.likes
})
</script>

<style lang="postcss" scoped>
.btn_like {
  &.is-row {
    flex-direction: row;

    .btn_like--icon {
      margin-right: 4px;
    }
  }

  &.is-column {
    flex-direction: column;

    .btn_like--icon {
      margin-bottom: 4px;
    }
  }

  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--dx-base2-color);
  font-size: 12px;
}
</style>
