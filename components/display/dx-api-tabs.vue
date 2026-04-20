<script setup lang="ts">
import type { ApiLike } from '@types'
import { watch } from 'vue'

const props = withDefaults(
  defineProps<{
    api: string
    params?: any
    listTabsConfig?: any
    labelKey?: 'title' | 'name'
    listProps?: any
    type?: string
    defaultKey?: 'current' | 'isDefault' | any
    fetchOptions?: any
    recKey?: string
    initDefault?: boolean
  }>(),
  {
    labelKey: 'title',
    defaultKey: 'isDefault',
    recKey: 'recommend',
    initDefault: true,
    fetchOptions: () => ({})
  }
)

const __ = useNuxtApp()

const { activeTab, duration, updateActiveTab } = useDefaultActiveTab({
  key: props.defaultKey
})

const { data, loading } = useMyFetch<any>({
  api: __.$Api.dynamic({ url: props.api, method: 'post' }) as unknown as ApiLike,
  immediate: true,
  params: props.params,
  success() {
    if (props.initDefault) {
      updateActiveTab(data.value)
    }
  },
  ...props.fetchOptions
})

// 调试：打印接口返回和标题映射（用于确认“顶部标题是否动态”）
watch(
  data,
  v => {
    const titles = Array.isArray(v) ? v.map((tab: any) => tab?.[props.labelKey]) : []
    // 醒目日志：包含 api、labelKey、data 摘要、最终 titles
    console.log('%c[dx-api-tabs] ✅ dynamic title debug', 'color:#2494ff;font-weight:700;font-size:13px', {
      api: props.api,
      labelKey: props.labelKey,
      loading: loading?.value,
      data: Array.isArray(v) ? v.slice(0, 8) : v,
      titles
    })
  },
  { immediate: true }
)

function scrollTo(name: number) {
  activeTab.value = name
}

defineExpose({
  scrollTo
})

const cacheMap: any = {}

function onRendered(name: any) {
  cacheMap[name] = 1
}
</script>

<template>
  <dx-tabs
    v-model:active="activeTab"
    class="text-medium first-no-padding dx-tabs"
    line-height="2px"
    line-width="24px"
    gap="8px"
    shrink
    :duration="duration"
    stop-propagation
    @rendered="onRendered"
  >
    <template #nav-bottom>
      <dx-spin v-show="loading" size="0.6rem" class="my-2 text-center" />
    </template>
    <van-tab v-for="(tab, index) in data" :key="index" :title="tab[props.labelKey]">
      <slot
        v-if="Math.abs(Number(activeTab) - Number(index)) <= 3 && cacheMap[index]"
        name="tab"
        :is-recommend="tab.name === '推荐'"
        :is-rec="tab.type === props.recKey"
        :tab
        :tabs="data"
      />
    </van-tab>

    <template #nav-left>
      <slot name="nav-left" />
    </template>
    <template #nav-right>
      <slot name="nav-right" />
    </template>
  </dx-tabs>
</template>
