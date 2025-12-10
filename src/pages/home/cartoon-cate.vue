<template>
  <div :key="key" class="container">
    <dx-spin v-if="loading"></dx-spin>
    <template v-else>
      <div class="comics-filter-container">
        <div v-for="(item, index) in category" :key="index" class="comics-filter-tabs">
          <scroll-x-view v-if="category.length">
            <div
              v-for="(tab, _index) in item.items"
              :key="tab.name"
              :title="tab.name"
              :class="{
                active: state[item.type] === tab.key
              }"
              class="comics-filter-item"
              @click="onSelect(item.type, tab.key)"
            >
              {{ tab?.name }}
            </div>
          </scroll-x-view>
        </div>
      </div>
      <div class="scroll-container">
        <dx-hoc-list
          v-if="key"
          ref="list"
          :key="key"
          :use-watch="false"
          :immediate="false"
          fields="data"
          class="dx-grid-2"
          :params="{
            ...state
          }"
          :start-refresh-empty-data="false"
          api="api/cartoon/search_cate"
        >
          <template #item="{ item }">
            <video-card
              :key="item.id"
              :show-type="false"
              :mv-type="3"
              lines
              :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, rating: item.play_count, ...item }"
            />
          </template>
        </dx-hoc-list>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface IStort {
  cate: Array<{ key: string; name: string }>
  free_type: Array<{ key: string; name: string }>
  sort: Array<{ key: string; name: string }>
}

const __ = useNuxtApp()
const list_ref = useTemplateRef('list')

const { data, loading, execute } = useMyFetch<{
  search?: IStort
}>({
  api: 'api/cartoon/construct_cate'
})

const state = reactive({
  cate: '',
  free_type: '',
  sort: ''
})

const onSelect = (key: keyof IStort, value: string) => {
  state[key] = value

  list_ref.value?.refresh_data({
    ...state
  })
}

const category = computed(() => {
  const { search } = data.value
  const { cate, free_type, sort } = search || {}
  return [
    { type: 'cate', items: cate },
    { type: 'free_type', items: free_type },
    { type: 'sort', items: sort }
  ] as const
})

const route = useRoute()
const { key } = useKeepAlive({
  reset: () => {},
  active() {
    const { key, type } = route.query
    // @ts-ignore
    state[type] = key
    execute().then(() => {
      list_ref.value?.refresh_data({
        ...state
      })
    })
  }
})
</script>

<style lang="less" scoped>
@import '@styles/filter.less';
</style>
