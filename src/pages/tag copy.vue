<template>
  <div :key="key" class="container">
    <template v-if="tabs">
      <dx-tabs
        v-model:active="tab_state"
        class="first-no-padding"
        line-width="0px"
        line-height="0px"
        gap="0px"
        static
        shrink
      >
        <van-tab v-for="item in tabs" :key="item.name" v-bind="item"></van-tab>
      </dx-tabs>
    </template>
    <dx-hoc-list v-if="key && module" :key="key" class="px-1.5" :class="module?.className" v-bind="module?.config?.()">
      <template #item="{ item, index, items }">
        <component
          :is="module.component"
          :key="item.id"
          :list="items"
          :index="index"
          v-bind="module.props"
          :item="item"
        ></component>
      </template>
    </dx-hoc-list>
  </div>
</template>

<script setup lang="ts">
import CateItem from '~/components/home/cate-item.vue'
import VideoCard from '~/components/my/video-card.vue'

useNavbarTitle()
const __ = useNuxtApp()
const route = useRoute()

const tab_state = ref()
const filter_keys = ['_type', 'title', 'api', 'has_sort']
const get_url_query = () => {
  const query = route.query
  return Object.keys(query).reduce(
    (acc, cur) => {
      if (!filter_keys.includes(cur)) {
        acc[cur] = query[cur]
      }

      return acc
    },
    {} as unknown as Record<string, any>
  )
}

const MAP = {
  find: {
    config: () => ({
      api: route.query.api,
      params: {
        ...get_url_query(),
        sort: tab_state
      },
      adConfig: {
        key: 'list_ads'
      }
    }),
    component: VideoCard,
    className: 'dx-grid-2',
    props: {}
  },
  user: {
    config: () => ({
      api: __.$Api.User.userVideos,
      params: {
        ...get_url_query(),
        sort: tab_state
      }
    }),
    component: VideoCard,
    className: 'dx-grid-2',
    props: {}
  },
  home: {
    config: () => ({
      api: __.$Api.Home.list_tab_mv,
      params: {
        ...get_url_query(),
        sort: tab_state
      },
      adConfig: {
        key: 'list_ads'
      }
    }),
    component: VideoCard,
    className: 'dx-grid-2',
    props: {}
  },
  cate: {
    config: () => ({
      api: __.$Api.Home.construct_list,
      params: {
        ...get_url_query(),
        sort: tab_state
      }
    }),
    component: CateItem,
    className: 'dx-grid-1',
    props: {}
  },
  discover: {
    config: () => ({
      api: __.$Api.Home.new_mv_tag,
      params: {
        ...get_url_query(),
        sort: tab_state
      },
      adConfig: {
        key: 'list_ads'
      }
    }),
    component: VideoCard,
    className: 'dx-grid-2',
    props: {
      lines: true
    }
  },
  anime: {
    config: () => ({
      api: '/api/cartoon/search_cate',
      params: {
        ...get_url_query(),
        sort: tab_state
      }
    }),
    component: VideoCard,
    className: 'dx-grid-2',
    props: {}
  }
}

const { mv_find_tab, mv_nag_tab } = useGlobalStore()
const TABS = {
  find: mv_find_tab,
  home: mv_nag_tab,
  discover: mv_find_tab,
  anime: [
    {
      name: 'new',
      title: '最新'
    },
    {
      name: 'hot',
      title: '最热'
    }
  ]
}

const module = computed(() => {
  const type = route.query._type as keyof typeof MAP

  return MAP[type]
})

const tabs = computed(() => {
  const { has_sort } = route.query
  const type = route.query._type as keyof typeof TABS

  return has_sort === '1' && TABS[type]
})

const { key } = useKeepAlive({
  active() {
    const _tabs = tabs.value

    if (_tabs) {
      tab_state.value = _tabs[0]?.name
    } else {
      tab_state.value = undefined
    }
  }
})
</script>
