<script setup lang="ts">
const emit = defineEmits<{
  search: [e: string]
}>()
const searchValue = ref()

const __ = useNuxtApp()
const searchHistory = ref<Array<string>>([])

function onSearch() {
  const _search_value = searchValue.value
  if (!_search_value) {
    return __.$Toast('请输入关键字')
  }
  emit('search', searchValue.value)

  saveHistory(_search_value)
}

function saveHistory(value: string) {
  if (!searchHistory.value.includes(value)) {
    const search_list = [...searchHistory.value, value]
    localStorage.setItem(SEARCH_HISTORY_KEY, search_list.toString())
    searchHistory.value = [...search_list]
  }
}

function set_value(_value?: string) {
  searchValue.value = _value
}
onBeforeMount(() => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY)
  if (history) {
    searchHistory.value = [...history.split(',')]
  }
})

const { config } = storeToRefs(useGlobalStore())

const router = useRouter()
function onClear() {
  router.back()
}
defineExpose({
  set_value,
  saveHistory
})
</script>

<template>
  <van-search v-model="searchValue" show-action autocomplete="off" clear-trigger="always" class="search-input"
    :placeholder="config.search_hot_keywords" @clear="onClear">
    <template #left-icon>
      <nuxt-icon name="search" filled class="icon-search !text-[20px] !text-black"></nuxt-icon>
    </template>
    <template #action>
      <div class="text-xl" @click="onSearch">搜索</div>
    </template>
  </van-search>
</template>

<style lang="postcss" scoped>
.search-input {
  --van-search-content-background: linear-gradient(90deg, rgba(235, 244, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%);
  --van-search-input-height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  background: transparent;

  :deep(.van-search__content) {
    border-radius: 50px;
    border: 1px solid #fff;
  }

  :deep(.van-search__action) {
    padding-right: 0;
  }

  :deep(.van-field__control::placeholder) {
    color: var(--dx-base2-color);
  }

  span {
    color: var(--dx-gray-color);
    font-size: 14px;
    display: flex;
    flex: 1;
  }

  :deep(.van-field__left-icon) {
    margin-right: 0.25rem;
  }
}
</style>
