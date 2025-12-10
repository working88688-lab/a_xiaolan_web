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
              active: params[item.name] === tab.value
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

const setDefaultActive = (_category: any[]) => {
  _category.forEach(item => {
    params.value[item.name] =
      item.name === route.query.key
        ? item.items.filter(_item => _item.value === route.query.type)[0].value
        : item.items[0].value
  })

  category.value = _category
}

const _params = ref<any>({
  size: 18,
  limit: 18
})
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
  params.value[type] = value

  if (route.query.key === type) {
    _params.value[type] = value
  }
  list_ref.value?.refresh_data({
    ...params.value
  })
}

const { key } = useKeepAlive({
  reset: () => {
    category.value = []
    params.value = {}
  },
  active() {
    _params.value[route.query.key as string] = route.query.type
    nextTick(() => {
      list_ref.value
        ?.refresh_data({
          [route.query.key as string]: route.query.type
        })
        .then(res => {
          setDefaultActive([...(res?.data?.category ?? [])])
        })
    })
  }
})
</script>

<style lang="less" scoped>
@import '@styles/filter.less';
</style>
