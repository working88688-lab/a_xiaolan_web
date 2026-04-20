<template>
  <div :key="key" class="container">
    <div class="comics-filter-container">
      <div v-for="(item, index) in category" :key="index" class="comics-filter-tabs">
        <scroll-x-view v-if="category.length">
          <div
            v-for="(tab, _index) in item.items"
            :key="tab.label"
            :title="tab.label"
            :class="{
              active: String(params[item.name] ?? '') === String(tab.value ?? ''),
              'is-header': _index === 0
            }"
            class="comics-filter-item"
            @click="onSelect(item.name, tab.value)"
          >
            {{ tab?.label }}
          </div>
        </scroll-x-view>
      </div>
    </div>
    <div class="scroll-container">
      <dx-hoc-list
        v-if="key && module"
        ref="list"
        :key="key"
        :use-watch="false"
        :immediate="false"
        class="dx-grid-3"
        :params="_params"
        v-bind="module?.config?.()"
      >
        <template #item="{ item, index, items }">
          <comics-item
            :key="item.id"
            :list="items"
            :index="index"
            :size="4"
            v-bind="module.props"
            :item="item"
          ></comics-item>
        </template>
      </dx-hoc-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import ComicsItem from '~/components/my/comics-item.vue'
const __ = useNuxtApp()
const route = useRoute()
useNavbarTitle()
const category = ref<any[]>([])
const list_ref = useTemplateRef('list')
const params = ref<Record<string, any>>({})

function syncParamsToRequest(next: Record<string, any>) {
  // 接口字段名约定：order 这组实际要传 sort
  const { order, ...rest } = next
  _params.value = {
    ..._params.value,
    ...rest,
    ...(order !== undefined ? { sort: order } : {})
  }
}

const setDefaultActive = (_category: any[]) => {
  const qKey = (route.query.key ?? '').toString()
  const qType = (route.query.type ?? '').toString()
  const qSortLabel = (route.query.sort ?? '').toString()
  const qSort = sortLabelToKey[qSortLabel] ?? qSortLabel

  _category.forEach(item => {
    const items = Array.isArray(item?.items) ? item.items : []
    const firstValue = items.length ? (items[0]?.value ?? '') : ''
    const hasValue = (val: any) => items.some((_item: any) => String(_item?.value) === String(val))

    if (item?.name === qKey && qType) {
      const matched = items.find((_item: any) => String(_item?.value) === qType)
      params.value[item.name] = matched?.value ?? firstValue
      return
    }

    // sort 跳转：只要某一组里包含这个 value，就默认选中它（不依赖 item.name）
    if (qSort && hasValue(qSort)) {
      params.value[item.name] = qSort
      return
    }

    // 主题跳转兜底：如果 qKey 不匹配任何组，就用 value 匹配一次
    if (qType && hasValue(qType)) {
      params.value[item.name] = qType
      return
    } else {
      params.value[item.name] = firstValue
    }
  })

  category.value = _category
  // 把默认选中同步到真正请求参数里（尤其是 order -> sort）
  syncParamsToRequest(params.value)
}

const _params = ref<any>({
  size: 18,
  limit: 18
})

const sortLabelToKey: Record<string, string> = {
  最近更新: 'refresh_at',
  最新: 'refresh_at',
  最热: 'rating',
  畅销: 'pay_num',
  随机: 'rand'
}
const MAP = {
  comics: {
    config: () => ({
      api: __.$Api.Community.manhuaFilter
    }),
    props: {}
  },
  images: {
    config: () => ({
      api: __.$Api.Community.imageFilter
    }),
    props: {
      page: 'images'
    }
  },
  story: {
    config: () => ({
      api: __.$Api.Community.storyFilter
    }),
    props: {
      page: 'story'
    }
  }
}

const module = computed(() => {
  const type = route.query._type as keyof typeof MAP

  return MAP[type]
})

const onSelect = (type: string, value: string) => {
  params.value[type] = value ?? ''

  // 保证点击任何筛选都会实际传参给接口（order -> sort）
  syncParamsToRequest({ ...params.value, [type]: value ?? '' })
  // dx-hoc-list 这里 use-watch=false，不会自动响应 params 变化
  // 所以每次点击都显式把最新请求参数传进去，避免仍用旧的 firstParams
  list_ref.value?.refresh_data({ ..._params.value })
}

const { key } = useKeepAlive({
  reset: () => {
    category.value = []
    params.value = {}
  },
  active() {
    const qKey = (route.query.key ?? '').toString()
    const qType = (route.query.type ?? '').toString()
    const qSortLabel = (route.query.sort ?? '').toString()
    const qSort = sortLabelToKey[qSortLabel] ?? qSortLabel
    if (qKey) {
      _params.value[qKey] = qType
    }
    if (qSort) {
      _params.value.sort = qSort
    } else {
      delete _params.value.sort
    }
    nextTick(() => {
      const firstParams = {
        ...(qKey ? { [qKey]: qType } : {}),
        ...(qSort ? { sort: qSort } : {})
      }
      list_ref.value?.refresh_data(firstParams).then(res => {
        console.log('[resource-filter] route.query:', route.query)
        console.log('[resource-filter] category(raw):', res?.data?.category)
        setDefaultActive([...(res?.data?.category ?? [])])
      })
    })
  }
})
</script>

<style lang="less" scoped>
@import '@styles/filter.less';

/* 调整顶部筛选标签观感，参考 male-beauty-category 的 button tabs */
:deep(.comics-filter-container) {
  padding: 8px 0 10px 12px;

  .comics-filter-item {
    min-width: auto;
    padding: 3px 15px !important;
    font-size: 13px !important;
    border-radius: 999px;
    color: #646c85 !important;
  }

  .comics-filter-item.is-header {
    margin-left: 0;
  }

  .comics-filter-item.active {
    color: #3da7fd !important;
    background: #e6f4ff;
  }
}
</style>
