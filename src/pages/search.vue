<!--
    desc: 搜索
    date: 2024.05.2
-->
<script lang="ts" setup>
const __ = useNuxtApp()

const searchHistory = ref<Array<string>>([])
const route = useRoute()
const router = useRouter()
const search_ref = ref()
const main_tab = ref(0)
const render_sidebar = ref(false)

function normalizeKeyword(val: string) {
  return String(val ?? '').trim()
}

function canSearchKeyword(val: string) {
  const keyword = normalizeKeyword(val)
  // 不允许单个字符（含单个汉字）搜索
  if (keyword.length < 2) {
    __.$Toast('至少两位搜索关键字')
    return { ok: false as const, keyword }
  }
  return { ok: true as const, keyword }
}

function onSearch(new_value: string) {
  const { ok, keyword } = canSearchKeyword(new_value)
  if (!ok) return

  router.push(`/search/result?keyword=${keyword}&_index=${route.query._index || 0}`)

  nextTick(() => {
    if (!searchHistory.value.includes(keyword)) {
      searchHistory.value = [...searchHistory.value, keyword]
    }

    search_ref.value?.set_value()
  })
}

function onBack() {
  router.back()
  nextTick(() => {
    main_tab.value = 0
  })
}

function onHistorySearch(val: string) {
  const { ok, keyword } = canSearchKeyword(val)
  if (!ok) return
  search_ref.value?.saveHistory(keyword)
  router.push(`/search/result?keyword=${keyword}&_index=${route.query._index || 0}`)
}

function onClearHistory() {
  searchHistory.value = []
  localStorage.setItem(SEARCH_HISTORY_KEY, '')
}

watchEffect(() => {
  if (main_tab.value) {
    render_sidebar.value = true
  }
})

onActivated(() => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY)
  if (history) {
    searchHistory.value = [...history.split(',')]
  }
  const _type = route.query._type

  if (_type) {
    main_tab.value = Number(_type)
  }
})
</script>

<template>
  <div class="container">
    <dx-navbar class="nav-search" :border="false" left-arrow @click-left="onBack" @click-right="onSearch">
      <template #title>
        <app-search ref="search_ref" @search="onSearch" />
      </template>
    </dx-navbar>
    <div class="scroll-container">
      <search-list :list="searchHistory" @search="onHistorySearch" @clear="onClearHistory" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
:deep(.van-tabs__nav) {
  padding-top: 7px;
}

.nav-search {
  --van-nav-bar-height: 60px;

  :deep(.van-nav-bar__left) {
    position: static;
    padding-right: 0;
    padding-left: 0.25rem;
  }

  :deep(.van-nav-bar__title) {
    flex: 1;
    margin: unset;
    max-width: unset;
  }

  :deep(.van-search__action) {
    font-weight: normal;
  }

  /* 去掉“搜索”文字自身点击时的白色高亮块 */
  :deep(.van-search__action:active),
  :deep(.van-search__action:focus-visible) {
    background-color: transparent !important;
    box-shadow: none;
    outline: none;
  }

  /* 去掉右侧搜索点击时的白色高亮块 */
  :deep(.van-nav-bar__right) {
    background-color: transparent !important;
  }

  :deep(.van-nav-bar__right:active),
  :deep(.van-nav-bar__right:focus-visible) {
    background-color: transparent !important;
    box-shadow: none;
  }
}
</style>
