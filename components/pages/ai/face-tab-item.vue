<script setup lang="ts">
import type { AdItem, Ai } from '@types'

const props = defineProps<{
  id: any
}>()

const { ai_tab } = useGlobalStore()

const activeTab = ref(ai_tab?.[0]?.sor ?? '')
const banners = ref<AdItem[]>([])
const { listData, loading, execute, refresh, isEmpty, isEnd, result, effect } = useFetchList<Ai>({
  api: 'api/ai/list_face_material',
  params: {
    cate_id: props.id,
    search_id: activeTab
  },
  immediate: true,
  success() {
    if (result.value.data?.ads?.length) {
      banners.value = result.value.data.ads
    }
  },
  startRefreshEmptyData: false
})
</script>

<template>
  <dx-container class="!block">
    <template #default="{ disabledRefresh, height }">
      <scroll-list :disabled-refresh="disabledRefresh" :loading="loading" :pull-down-refresh="refresh" :pullup="execute"
        :is-end="isEnd" :show-end="false">
        <dx-spin v-show="loading && isEmpty" />
        <dx-ads v-if="banners?.length" class="px-1" :items="banners" />
        <div :style="{ minHeight: `${height}px` }">
          <dx-tabs v-model:active="activeTab" stop-propagation line-width="0px" line-height="0px" static
            class="my-nest-tabs text-medium first-no-padding dx-tabs" shrink>
            <van-tab v-for="item in ai_tab" :key="item.name" :title="item.name" :name="item.sort" />
          </dx-tabs>
          <dx-spin v-show="effect" />
          <dx-empty v-show="isEmpty && !loading" class="mt-3" />
          <div class="dx-grid-2">
            <face-item v-for="item in listData" :key="item.id" :item />
          </div>
          <dx-end-tip v-show="isEnd && !isEmpty" />
        </div>
      </scroll-list>
    </template>
  </dx-container>
</template>

<style scoped>
.my-nest-tabs {
  position: sticky;
  left: 0;
  top: -1px;
  z-index: 999;

  :deep(.van-tabs__wrap) {
    background-color: #fff;
  }
}
</style>
