<script setup lang="ts">
import type { ApiLike, FetchListOption, SortTab } from '~/types'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(
  defineProps<{
    api?: ApiLike | string
    params?: Record<string, any>
    isRecommend?: boolean
    fetchProps?: FetchListOption
    resourceType?: string
    showDisplayType?: boolean
    bannerKey?: string
    showTopBanner?: boolean
    showTopRunner?: boolean
    refreshCallBack?: () => void
    tabs?: SortTab[]
    sortKey?: string
    active?: boolean
  }>(),
  {
    bannerKey: 'ads',
    showTopBanner: true,
    showTopRunner: true,
    sortKey: 'sort'
  }
)

const __ = useNuxtApp()
const init_data = ref()
const scrollRef = ref()
const tab_state = ref(props?.tabs?.[0]?.name ?? 0)

const sortKey = props?.sortKey

function merge_params() {
  if (props.tabs?.length) {
    return {
      ...props.params,
      [`${sortKey}`]: tab_state
    }
  }
  return props.params
}

const listRef = useTemplateRef('list')

const {
  listData,
  loading,
  execute: pullup,
  refresh: _refresh,
  isEnd,
  result,
  isEmpty,
  effect,
  isReady
} = useFetchList<any>({
  api: props.api,
  immediate: true,

  params: merge_params(),
  usePageSize: false,
  useShallowRef: !props.isRecommend,
  ...(props.fetchProps || {}),
  success() {
    if (!init_data.value) {
      const { list, ...rest } = result.value.data
      init_data.value = {
        ...rest
      }
    }
  },
  before_refresh() {
    listRef.value?.resetScroll()
  }
})

async function pullDownRefresh() {
  // 父级容器可能需要相应下拉刷新事件
  props.refreshCallBack?.()
  return _refresh()
}

function cacheHandler(e: any) {
  if (e.module === 'like' && e.cache?.type === props.resourceType) {
    listData.value = listData.value.map(item => {
      if (item.id === Number(e.data.id)) {
        return {
          ...item,
          is_follow: e.data.is_follow
        }
      }

      return item
    })
  }
}

watchEffect(() => {
  if (props.isRecommend && props.active) {
    __.$Emitter.on('cache', cacheHandler)
  } else {
    __.$Emitter.off('cache', cacheHandler)
  }
})

onBeforeUnmount(() => {
  __.$Emitter.off('cache', cacheHandler)
})
</script>

<template>
  <dx-list-view
    ref="list"
    :list-props="{
      isEnd,
      pullup,
      loading,
      pullDownRefresh,
      showEnd: false,
      isEmpty: false
    }"
    :loading="effect || !isReady"
    :is-empty="isEmpty"
    :is-end="isEnd"
    :has-tabs="!!tabs?.length"
  >
    <template #header>
      <div class="px-1">
        <dx-ads v-if="showTopBanner" class="mt-0.5" :list="init_data?.[props.bannerKey]" />
        <dx-notice-bar v-if="showTopRunner" class="my-1" :text="init_data?.run_light" />

        <slot name="config" :data="init_data?.mid_conf" />
      </div>
    </template>
    <template #tabs>
      <dx-tabs
        v-if="tabs?.length"
        v-model:active="tab_state"
        class="dx-tabs text-sm"
        static
        shrink
        theme="button"
        stop-propagation
      >
        <van-tab v-for="tab in tabs" :key="tab.name" v-bind="tab" />
      </dx-tabs>
    </template>
    <template #list>
      <slot name="list" :items="listData" />
    </template>
  </dx-list-view>
</template>

<style lang="postcss" scoped></style>
