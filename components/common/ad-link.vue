<template>
  <report-click-item stop-propagation :data="{
    page_key,
    ad_type,
    page_name,
    ad_slot_key: props.data.advertise_location_code,
    ad_slot_name: `${name}`,
    ad_id: props.data.advertise_code,
    event: 'ad_click'
  }">
    <div ref="link" v-bind="$attrs" class="tracker-item cursor-pointer" @click="onClick">
      <slot></slot>
    </div>
  </report-click-item>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import type { AdItem } from '@types'

const props = defineProps<{
  data: AdItem
  index?: number
  adName?: string
  adType?: string
  isVirtual?: boolean
  customTrack?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const route = useRoute()
const __ = useNuxtApp()
const toWebView = () => {
  __.$Utils.onWinOpen(props.data.url)
}
const toCharge = () => {
  __.$NavigateTo('/renewal')
}

const toTagList = (tag: string) => {
  __.$NavigateTo(`/tag?tag=${tag}&_type=discover&title=${tag}`)
}

const toDetail = (id: string) => {
  __.$Store.stack.updateStacks([
    {
      ...props.data,
      id
    }
  ])
  __.$NavigateTo(`/player?id=${id}index=0`)
}

const toCoins = () => {
  __.$NavigateTo(`/coin-recharge`)
}

const toPost = (id: string) => {
  __.$NavigateTo(`/post-detail?id=${id}`)
}

const page_key = ((route.name as string) || '').replace(/-/g, '_')
const page_name = route.meta?.title || route.meta?.trackPageName

const name = computed(() => {
  return [page_name, props.adName, props.index ? props.index + 1 : props.index].filter(i => i).join('_')
})
const ad_type = props.adType || 'banner'
const onClick = () => {
  emit('click')
  switch (props.data.type) {
    case 1:
      toWebView()
      break
    case 2:
      toTagList(props.data.url)
      break
    case 3:
      toWebView()
      break
    case 4:
      toDetail(props.data.url)
      break
    case 6:
      toCharge()
      break
    case 7:
      toCoins()
      break
    case 8:
      // game
      break
    case 9:
      // grah
      break
    case 11:
      toPost(props.data.url)
      break
    case 13:
      __.$NavigateTo(`/original-detail?id=${props.data.url}&type=2`)
      break
    default:
      toWebView()
      break
  }
}

const target = useTemplateRef('link')

const { stop } = useIntersectionObserver(target, ([entry]) => {
  if (entry?.isIntersecting) {
    if (!props.isVirtual && !props.customTrack) {
      __.$Tracker.trackAdImpression({
        page_key,
        ad_type,
        page_name,
        ad_slot_key: props.data.advertise_location_code,
        ad_slot_name: `${name.value}`,
        ad_id: props.data.advertise_code
      })
    }

    stop()
  }
})
</script>
