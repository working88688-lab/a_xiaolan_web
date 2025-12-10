<!-- 
    desc: 搜索
    date: 2024.03.28
-->
<template>
  <div class="dx dx-flex dx-flex-col container">
    <dx-navbar right-text="搜索" :border="false" left-arrow @click-left="onBack" @click-right="onSearch">
      <template #title>
        <form action="/">
          <van-search v-model="searchValue" autofocus clear-trigger="always" class="search-input"
            placeholder="可搜索用户/视频/喜好" @search="onSearch"></van-search>
        </form>
      </template>
    </dx-navbar>
    <div class="search-container flex-1 overflow-hidden">
      <search-result v-if="showResult" v-model:active="activeTab" :text="searchValue"></search-result>
      <search-list v-show="!showResult" :list="searchHistory" @search="onHistrySearch"
        @clear="onClearHistory"></search-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 当前实例
 */
const __ = useNuxtApp()
const searchValue = ref('')
const searchHistory = ref<Array<string>>([])
const showResult = ref(false)
const SEARCH_HISTORY_BLUE = 'SEARCH_HISTORY_BLUE'
const activeTab = ref(0)
const route = useRoute()
/**
 * 状态声明
 */

const onSearch = () => {
  const _searchvalue = searchValue.value

  if (!_searchvalue) {
    return __.$Toast('请输入关键字')
  }
  console.log(1)
  showResult.value = false
  if (!searchHistory.value.includes(_searchvalue) && _searchvalue.length >= 2) {
    console.log(2)
    const _searchlist = [...searchHistory.value, _searchvalue]
    localStorage.setItem(SEARCH_HISTORY_BLUE, _searchlist.toString())
    searchHistory.value = [..._searchlist]
  }
  console.log(3)
  nextTick(() => {
    showResult.value = true
  })
}
const onClear = () => {
  activeTab.value = 0
}
const onBack = () => {
  __.$Back()
  nextTick(() => {
    searchValue.value = ''
    showResult.value = false
    // activeTab.value = 0
  })
}

const onHistrySearch = (val: string) => {
  searchValue.value = val
  showResult.value = true
}

const onClearHistory = () => {
  searchHistory.value = []
  localStorage.setItem(SEARCH_HISTORY_BLUE, '')
}

watch(
  () => searchValue.value,
  val => {
    if (!val) {
      showResult.value = false
    }
  }
)

// 初始入口
onBeforeMount(() => {
  const history = localStorage.getItem(SEARCH_HISTORY_BLUE)
  if (history) {
    searchHistory.value = [...history.split(',')]
  }
})

onActivated(() => {
  if (activeTab.value === 0) {
    activeTab.value = Number(route.query._index ?? 0)
  }
})

useActivatiedEventListener(window, 'popstate', onClear)
</script>

<style lang="less">
@import '@styles/search.less';
</style>

<style lang="less" scoped>
.container {
  .search-input {
    background-color: #f6f7f8;
    border-radius: 30px;
    height: 36px;
    padding: 0 15px;
  }
}

:deep(.van-nav-bar__content) {
  margin: 0.3rem 0;
  height: 36px;
}

:deep(.van-nav-bar__title) {
  max-width: 100%;
  width: 250px;

  input {
    color: #777;
    font-size: 14px;
    display: flex;
    flex: 1;
    border: none;
    background-color: transparent;
    font-weight: normal;
  }

  input::placeholder {
    color: #777;
  }

  .van-icon.van-icon-search {
    color: #969799;
  }

  .van-search__content {
    padding-left: 0;
  }
}
</style>
