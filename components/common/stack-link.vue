<template>
  <div class="stack-link" @click="navigateToVideo">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'

import { ROUTE_PARAMS } from '@utils/constants/route'

const props = withDefaults(
  defineProps<{
    list?: any // 短视频所留，旧版本全是短视频，保留，以防后面还有短视频需求
    disabled?: boolean
    isOriginal?: boolean
    replace?: boolean
    data?: any
    isLink?: boolean
    mvType?: 1 | 2 | 3 | 4 // 普通视频，片库，动漫, 短视频
    index?: number
    fieldPath?: string
    api?: string
    params?: any
    track?: boolean
  }>(),
  {
    list: () => [],
    index: 0,
    disabled: false,
    isOriginal: false,
    replace: false,
    data: undefined,
    mvType: 1,

    isLink: true
  }
)
const emit = defineEmits<{
  click: [e: VideoItem]
}>()

const __ = useNuxtApp()

const router_params = inject(ROUTE_PARAMS, undefined)

const NAVIGATES = {
  1: '/player',
  2: '/original-detail',
  3: '/original-detail',
  4: '/short-player'
}
const stackStore = useStackStore()
const router = useRouter()
const navigateToVideo = () => {
  const _data = props.list[props.index] || props.data
  const id = _data.id
  const action = props.replace ? router.replace : router.push

  if (props.mvType === 4 && props.list) {
    stackStore.updateStacks(props.list)
    stackStore.update_api(props.api ?? '')
    stackStore.updateIndex(props.index ?? 0)
    stackStore.update_params(props.params || {})
    stackStore.updateFieldPath(props.fieldPath || 'data')
  }

  if (!props.disabled && props.isLink) {
    if (router_params) {
      return action(`${NAVIGATES[props.mvType]}?id=${id}&${record_to_querystring(router_params)}`)
    }
    action(`${NAVIGATES[props.mvType]}?id=${id}&type=${props.mvType}`)
    if (props.track) {
      emit('click', _data)
    }
  } else {
    emit('click', _data)
  }
}
</script>
