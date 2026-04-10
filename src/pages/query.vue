<template>
  <div :key="key" class="container">
    <dx-tabs v-model:active="tab_state" line-width="22px" class="first-no-padding dx-tabs" gap="8px" shrink>
      <van-tab v-for="tab in tabs" :key="tab.name" v-bind="tab">
        <dx-hoc-list
          v-if="key && module"
          :key="key"
          class="px-1.5"
          :class="module?.className"
          v-bind="module?.config"
          :params="{
            ...get_url_query(),
            [`${route.query._sort_key || 'sort'}`]: tab.name
          }"
        >
          <template #item="{ item }">
            <nuxt-link
              v-if="isImagesType"
              class="graphic-information-common"
              :to="`/images?id=${item.id}`"
            >
              <dx-cover class="aspect-h-4 aspect-w-3" :poster="item?.thumb_full">
                <dx-pay-type :coins="item.coins" class="absolute right-0.5 top-0.5" />
                <div class="absolute bottom-0.5 left-0.5 right-0.5 z-10 flex justify-between text-[0.28rem] text-white">
                  <div class="flex items-center gap-0.5">
                    <van-icon name="eye-o" size="0.32rem" />
                    <span>{{ $Utils.formatNumber(item.view_count || item.view_num || item.rating || 0) }}</span>
                  </div>
                  <div>{{ item.total || (item.series && item.series.length) || 0 }}张</div>
                </div>
              </dx-cover>
              <div class="text-sm line-clamp-2">{{ item.title }}</div>
            </nuxt-link>

            <component
              v-else
              :is="module.component"
              :key="item.id"
              :item="module.rewrite_props ? module.rewrite_props(item) : item"
              v-bind="module.props"
            />
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<script setup lang="ts">
import ComicsItem from '~/components/my/comics-item.vue'
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
      if (!cur.startsWith('_') && !filter_keys.includes(cur)) {
        acc[cur] = query[cur]
      }

      return acc
    },
    {} as unknown as Record<string, any>
  )
}

const MAP = {
  comics: {
    config: {
      api: __.$Api.Community.manhuaClass
    },
    component: ComicsItem,
    className: 'dx-grid-2',
    props: {}
  },
  images: {
    config: {
      api: __.$Api.Community.imageClass
    },
    component: ComicsItem,
    className: 'dx-grid-2',
    props: {
      page: 'images'
    }
  },
  story: {
    config: {
      api: __.$Api.Community.storyClass
    },
    component: ComicsItem,
    className: 'dx-grid-2',
    props: {
      page: 'story'
    }
  },
  original: {
    config: {
      api: __.$Api.original.list_tag
    },
    component: VideoCard,
    className: 'dx-grid-2',

    props: {
      isOriginal: true,
      showDuration: false,
      showType: false
    },
    rewrite_props(item: any) {
      return {
        cover_thumb_url: item.cover_full,
        rating: item.play_count,
        ...item
      }
    }
  }
}

const common_tabs = [
  {
    title: '最新',
    name: 'new'
  },
  {
    title: '最热',
    name: 'hot'
  }
]
const { mv_original_tab } = useGlobalStore()
const TABS = {
  comics: common_tabs,
  story: common_tabs,
  images: common_tabs,
  original: mv_original_tab
}

const module = computed(() => {
  const type = route.query._type as keyof typeof MAP

  return MAP[type]
})

const isImagesType = computed(() => String(route.query._type || '') === 'images')

const tabs = computed(() => {
  const type = route.query._type as keyof typeof TABS

  return TABS[type]
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
