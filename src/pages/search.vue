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

function onSearch(new_value: string) {
  router.push(`/search/result?keyword=${new_value}&_index=${route.query._index || 0}`)

  nextTick(() => {
    if (!searchHistory.value.includes(new_value)) {
      searchHistory.value = [...searchHistory.value, new_value]
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
  search_ref.value?.saveHistory(val)
  router.push(`/search/result?keyword=${val}&_index=${route.query._index || 0}`)
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
}
</style>
