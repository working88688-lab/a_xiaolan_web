<script setup lang="ts">
import type { ApiLike } from '@types'

import { isEqual } from 'lodash-es'

defineOptions({
  inheritAttrs: false
})

const scroll_ref = useTemplateRef('list')

const props = withDefaults(
  defineProps<{
    api: ApiLike | string
    params?: Record<string, any>
    routeQueries?: string[]
    showEmpty?: boolean
    showEnd?: boolean
    refresh?: boolean
    pullup?: boolean
    classNames?: string
    immediate?: boolean
    ready?: boolean
    fields?: string
    filter?: (keyword: any) => boolean
    listProps?: Record<string, any>
    fetchProps?: Record<string, any>
    useWatch?: boolean
    startRefreshEmptyData?: boolean
    success?: (...args: any[]) => void
    refreshResult?: boolean
    adConfig?: {
      key: string
      index: number
    }
    trackData?: any
    onTrack?: (data: any) => void
  }>(),
  {
    params: undefined,
    showEmpty: true,
    showEnd: true,
    refresh: true,
    pullup: true,
    routeQueries: undefined,
    classNames: undefined,
    immediate: true,
    ready: true,
    fields: 'list',
    filter: undefined,
    useWatch: true,
    refreshResult: false,
    startRefreshEmptyData: true,
    listProps: () => ({}),
    fetchProps: () => ({})
  }
)

defineSlots<{
  list(props: { items: any[] }): any
  item(props: { item: any; index: number; items: any[] }): any
  header(props: { data: any }): any
  banner(props: { data: any }): any
}>()

const __ = useNuxtApp()
const init_data = ref()
const api =
  typeof props.api === 'string'
    ? (__.$Api.dynamic({ url: props.api, method: 'post' }) as unknown as ApiLike)
    : props.api
const {
  listData,
  loading,
  execute,
  refresh: _refresh,
  isEnd,
  result,
  isError,
  page
  // reset
} = useFetchList<any>({
  api,
  fields: props.fields,
  params: props.params,
  routeQueries: props.routeQueries,
  immediate: props.immediate && props.ready,
  usePageSize: false,
  adConfig: props.adConfig,
  before_refresh() {
    scroll_ref.value?.scrollTo(0)
  },
  startRefreshEmptyData: props.startRefreshEmptyData,
  success() {
    if (props.refreshResult || !init_data.value) {
      const { list, ...rest } = result.value.data
      init_data.value = {
        ...rest
      }
    }
    props.success?.(result.value)

    if (props.onTrack) {
      props.onTrack({
        count: listData.value.length
      })
    }
  },
  ...props.fetchProps
})

const is_empty = computed(() => {
  return render_list.value.length === 0
})

const render_list = computed(() => {
  return props.filter ? listData.value.filter(item => props?.filter?.(item)) : listData.value
})

const fetch_data = () => {
  return execute(props.params)
}

const refresh_data = async (_params = {}) => {
  return _refresh({ ...props.params, ..._params })
}

// 排序
const sort = (compare: (a: any, b: any) => number) => {
  listData.value.sort(compare)

  listData.value = [...listData.value]
}

const maybe_reactive = (val: MaybeRefOrGetter): boolean => {
  return isReactive(val) || isRef(val)
}

if (props.useWatch) {
  if (props.params && maybe_reactive(props.params)) {
    watch(props.params, refresh_data)
  } else {
    watch(
      () => props.params,
      (val: any, nVal: any) => {
        if (!isEqual(val, nVal)) {
          refresh_data()
        }
      }
    )
  }
}

defineExpose({
  refresh_data,
  sort
})
</script>
<template>
  <scroll-list ref="list" v-model:loading="loading" v-model:error="isError"
    :pullup="props.pullup ? fetch_data : undefined" :pull-down-refresh="props.refresh ? refresh_data : undefined"
    :is-end="isEnd" :show-end="showEnd" :is-empty="showEmpty && is_empty" v-bind="listProps">
    <slot name="banner" :data="init_data"></slot>
    <div v-bind="$attrs">
      <slot name="header" :data="init_data"></slot>
      <slot v-for="(item, index) in render_list" name="item" :items="render_list" :index="index" :item="item"></slot>
    </div>
    <slot name="list" :items="render_list"></slot>
  </scroll-list>
</template>
