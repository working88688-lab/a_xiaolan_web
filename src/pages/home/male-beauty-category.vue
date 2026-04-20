<template>
  <div :key="key" class="container">
    <dx-spin v-if="initing"></dx-spin>
    <template v-else>
      <div class="category-header">
        <dx-tabs
          v-model:active="themeTabIndex"
          line-height="0"
          line-width="0"
          shrink
          theme="button"
          class="sticky-title mb-1"
          @change="onCommonChange"
        >
          <van-tab title="主题"></van-tab>
          <van-tab v-for="(item, index) in themeTabs" :key="index" :title="item"></van-tab>
        </dx-tabs>
        <dx-tabs
          v-model:active="sortTabIndex"
          class="mb-1"
          line-height="0"
          line-width="0"
          shrink
          theme="button"
          @change="onSort"
        >
          <van-tab title="排序"></van-tab>
          <van-tab title="最新"></van-tab>
          <van-tab title="最热"></van-tab>
          <van-tab title="畅销"></van-tab>
          <van-tab title="随机"></van-tab>
        </dx-tabs>
        <dx-tabs
          v-model:active="typeTabIndex"
          class="mb-1"
          line-height="0"
          line-width="0"
          shrink
          theme="button"
          @change="onCommonChange"
        >
          <van-tab title="分类"></van-tab>
          <van-tab v-for="(item, index) in typeList" :key="index" :title="item.name"></van-tab>
        </dx-tabs>
      </div>
      <div class="scroll-container">
        <scroll-list
          v-model:loading="loading"
          :pullup="_fetch"
          :pull-down-refresh="_refresh"
          :is-empty="isEmpty"
          :is-end="isEnd"
        >
          <div class="grid grid-cols-3 gap-1 px-1">
            <video-card
              v-for="(item, index) in listData"
              :key="item.id"
              :list="listData"
              :index="index"
              :item="item"
              :vertical="true"
            ></video-card>
          </div>
        </scroll-list>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NewTabItem, VideoItem } from '@types'
const __ = useNuxtApp()
const route = useRoute()

const key = ref()
const themeTabIndex = ref(0)
const sortTabIndex = ref(0)
const typeTabIndex = ref(0)

const sortOptions = ['newest', 'hottest', 'bestseller', 'random'] as const
type SortKey = (typeof sortOptions)[number] | ''

const typeList = [
  { name: '超高清', type: 0 },
  { name: 'VIP', type: 1 },
  { name: '付费', type: 2 }
]
const {
  data,
  execute: generateTabs,
  loading: initing
} = useMyFetch<NewTabItem[]>({
  api: 'api/tab/categoryNew'
})

const sourceTitle = computed(() => (route.query.title ?? '').toString().trim())
const routeTabId = computed(() => {
  const v = (route.query.tab_id ?? '').toString().trim()
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})
const baseTab = computed(() => {
  const list = Array.isArray(data.value) ? data.value : []
  const byId = routeTabId.value !== null ? list.find((t: any) => Number(t?.tab_id) === routeTabId.value) : null
  const byTitle = sourceTitle.value
    ? list.find((t: any) => String(t?.tab_name ?? '').trim() === sourceTitle.value)
    : null
  return byId ?? byTitle ?? list[0] ?? null
})

const headerApi = computed(() => {
  const q = (route.query.api ?? '').toString().trim()
  return q || '/api/image/IndexNew'
})
const headerData = ref<any>(null)
const headerLoading = ref(false)

let __headerLogged = false
const fetchHeader = async () => {
  const apiUrl = headerApi.value
  if (!apiUrl) return
  headerLoading.value = true
  try {
    const api = __.$Api.dynamic({ url: apiUrl, method: 'post' })
    const res: any = await api({})
    headerData.value = res?.data ?? null

    if (!__headerLogged) {
      __headerLogged = true
      const bannerStyle =
        'background:#16a34a;color:#fff;padding:4px 10px;border-radius:999px;font-weight:900;font-size:14px;'
      const labelStyle = 'color:#16a34a;font-weight:900;'
      const icons = Array.isArray(res?.data?.icon) ? res.data.icon : []
      console.groupCollapsed('%c[男色主题] 同源接口返回（来自 graphic-image-item 的 data.icon）', bannerStyle)
      console.log('%capi:', labelStyle, apiUrl)
      console.log('%ccount(icon):', labelStyle, icons.length)
      console.log('%cicon(raw):', labelStyle, icons)
      try {
        console.log('%cresponse(json):', labelStyle, JSON.stringify(res, null, 2))
      } catch (e) {
        console.warn('[男色主题] response stringify failed:', e)
      }
      console.groupEnd()
    }
  } catch (e) {
    console.warn('[男色主题] fetch header failed:', e)
  } finally {
    headerLoading.value = false
  }
}

watch(
  () => headerApi.value,
  () => {
    __headerLogged = false
    fetchHeader()
  },
  { immediate: true }
)

let __tabsLogged = false
watchEffect(() => {
  if (__tabsLogged) return
  if (!data.value) return
  __tabsLogged = true
  const bannerStyle =
    'background:#111827;color:#fff;padding:4px 10px;border-radius:999px;font-weight:800;font-size:14px;'
  const labelStyle = 'color:#111827;font-weight:800;'
  console.groupCollapsed('%c[男色分类] 接口返回值 api/tab/categoryNew', bannerStyle)
  const tabs = Array.isArray(data.value) ? data.value : []
  const summary = tabs.map((t: any) => ({
    tab_id: t?.tab_id,
    tab_name: t?.tab_name,
    tags_count: Array.isArray(t?.tags_ary) ? t.tags_ary.length : 0
  }))
  console.log('%ccount(tabs):', labelStyle, tabs.length)
  console.table(summary)
  console.log('%cdata(raw):', labelStyle, data.value)
  try {
    console.log('%cdata(json):', labelStyle, JSON.stringify(data.value, null, 2))
  } catch (e) {
    console.warn('[男色分类] data stringify failed:', e)
  }
  console.groupEnd()
})
const themeIcons = computed(() => {
  return Array.isArray(headerData.value?.icon) ? headerData.value.icon : []
})
const themeTabs = computed(() => {
  const themes = themeIcons.value.map((it: any) => it?.label || it?.name).filter(Boolean)
  return themes
})

const routeTag = computed(() => (route.query.tag ?? '').toString().trim())
// 进入页面时允许用 query.tag 作为初始 tag；一旦用户手动切换主题（非“主题”行头），就清掉它
const initialTag = ref('')
watchEffect(() => {
  if (!initialTag.value && routeTag.value) initialTag.value = routeTag.value
})
watch(themeTabIndex, idx => {
  if (idx !== 0) initialTag.value = ''
})

const sortLabelToKey: Record<string, (typeof sortOptions)[number]> = {
  最新: 'newest',
  最热: 'hottest',
  畅销: 'bestseller',
  随机: 'random'
}
const initialSort = ref<SortKey>('')
watchEffect(() => {
  if (initialSort.value) return
  const maybeSortKey = sortLabelToKey[routeTag.value]
  if (maybeSortKey) {
    initialSort.value = maybeSortKey
    // 如果 query.tag 是“最热”这种，说明它是排序而不是主题，避免把它当 tag 传给接口
    if (!themeTabIndex.value) initialTag.value = ''
  }
})
watch(sortTabIndex, idx => {
  if (idx !== 0) initialSort.value = ''
})

function normalizeAllTag(tag: unknown): string {
  const t = (tag ?? '').toString().trim()
  // 约定：当选中“主题”(tabIndex=0) 时，不传 tag（不筛选）
  if (!t) return ''
  return t
}

const getParams = () => {
  const rawTag = themeTabIndex.value === 0 ? initialTag.value : themeTabs.value[themeTabIndex.value - 1]
  const tag = normalizeAllTag(rawTag)
  // UI 默认选中“排序/分类”行头，但接口仍然需要一个默认值，否则可能返回空
  const sort: SortKey = sortTabIndex.value === 0 ? initialSort.value || 'newest' : sortOptions[sortTabIndex.value - 1]
  const type = typeTabIndex.value === 0 ? 0 : typeList[typeTabIndex.value - 1]?.type

  return {
    ...(tag ? { tag } : {}),
    tab_id: baseTab.value?.tab_id,
    ...(sort ? { sort } : {}),
    ...(type === undefined ? {} : { type })
  }
}

const __uiLoggedOnce = ref(false)
watchEffect(() => {
  if (!data.value?.length) return
  const bannerStyle =
    'background:#0b5fff;color:#fff;padding:4px 10px;border-radius:999px;font-weight:900;font-size:14px;'
  const labelStyle = 'color:#0b5fff;font-weight:900;'

  // 只在首次 ready 时提示“数据来源”，后续点击再打印实时参数
  if (!__uiLoggedOnce.value) {
    __uiLoggedOnce.value = true
    console.groupCollapsed('%c[男色分类] 顶部筛选数据来源（你圈出来那块）', bannerStyle)
    console.log('%c1) 第一行大分类 tabs：', labelStyle, '来自接口 api/tab/categoryNew -> data')
    console.log('%c2) 主题 tabs：', labelStyle, '来自同源接口返回 data.icon（并额外插入“标题=全部”）')
    console.log('%c3) 分类(超高清/VIP/付费)：', labelStyle, '页面内写死 typeList')
    console.log('%c4) 排序(最新/最热/畅销/随机)：', labelStyle, '页面内写死 sort tabs')
    console.groupEnd()
  }

  // 每次筛选变化，都把“当前 UI 显示来自哪 + 当前选中值 + 请求参数”打出来
  const tab = baseTab.value
  const rawTag = themeTabIndex.value === 0 ? '' : themeTabs.value?.[themeTabIndex.value - 1]
  const tag = normalizeAllTag(rawTag)
  const sort: SortKey = sortTabIndex.value === 0 ? 'newest' : sortOptions[sortTabIndex.value - 1]
  const type = typeTabIndex.value === 0 ? { name: '默认(0)', type: 0 } : typeList[typeTabIndex.value - 1]
  console.groupCollapsed('%c[男色分类] 当前筛选/请求参数', bannerStyle)
  console.log('%ctabs(from api/tab/categoryNew):', labelStyle, {
    baseTabName: sourceTitle.value || tab?.tab_name,
    tab_id: tab?.tab_id,
    tab_name: tab?.tab_name,
    tabs_count: Array.isArray(data.value) ? data.value.length : 0
  })
  console.log('%ctags(from tabs.tags_ary):', labelStyle, {
    themeTabIndex: themeTabIndex.value,
    raw_tag: rawTag,
    normalized_tag: tag,
    tags_count: themeTabs.value.length
  })
  console.log('%csort(from local sort tabs):', labelStyle, {
    sortTabIndex: sortTabIndex.value,
    sort
  })
  console.log('%ctype(from local typeList):', labelStyle, {
    typeTabIndex: typeTabIndex.value,
    type_name: type?.name,
    type_value: type?.type
  })
  console.log('%cgetNewCategory params ->', labelStyle, getParams())
  console.groupEnd()
})

const _fetch = () => {
  return execute(getParams())
}

const _refresh = () => {
  return refresh(getParams())
}
const { listData, loading, execute, refresh, isEmpty, isEnd, reset } = useFetchList<VideoItem>({
  api: __.$Api.Home.getNewCategory,
  params: {
    size: 16
  },
  adConfig: {
    key: 'list_ads'
  }
})

const onSort = (_index?: number) => {
  _refresh()
}

const onCommonChange = () => {
  _refresh()
}

const back = () => {
  key.value = ''
  themeTabIndex.value = 0
  sortTabIndex.value = 0
  typeTabIndex.value = 0
  reset()
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!key.value) {
    key.value = Math.random()
    generateTabs().then(_fetch)
  }
  fetchHeader()
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__left) {
  position: static;
  padding: 0 8px;
  margin-bottom: 12px;
}

:deep(.van-nav-bar__title) {
  max-width: 100%;
  text-overflow: initial;
  margin: 0;
}

:deep(.van-tabs__nav) {
  background-color: transparent;
}

:deep(.van-nav-bar) {
  background-color: transparent;
}

.catagory-tab {
  :deep(.van-tabs__nav) {
    padding-left: 0px;
  }
}

:deep(.dx-custom-tabs__button) {
  .van-tabs__wrap {
    height: 26px;

    .van-tab__text {
      padding-left: 20px;
      padding-right: 20px;
    }

    .van-tab--active {
      font-weight: normal !important;
    }
  }
}
</style>
