<script lang="tsx">
import type { DFetchListOption } from '@types'

import CateItem from '~/components/pages/home/cate-item.vue'
import VideoCard from '~/components/my/video-card.vue'
import originalIcon from '~/assets/image-icon/original.png'

interface PageModuleConfig {
  config: (_params: any) => DFetchListOption
  key?: () => string
  className: string
  component: Component
  props?: Record<string, any>
  rewrite_props?: (item: any) => any
  sortKey?: string
}

interface PageModule {
  [key: string]: PageModuleConfig
}

export default defineComponent({
  name: 'Tag',
  props: {
    renderCount: {
      type: Number, // 控制渲染的tab数量，渲染过多会卡顿的
      default: 4
    }
  },
  setup(props) {
    useNavbarTitle()

    const __ = useNuxtApp()
    const route = useRoute()

    const globalStore = useGlobalStore()

    const filter_keys = ['_type', 'title', 'api', 'has_sort', '_sort_key', '_vip']
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

    const activeTab = ref(0)
    const MAP = {
      find: {
        config: (_params = {}) => ({
          api: route.query.api,
          params: {
            ...get_url_query(),
            ..._params
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
        config: (_params = {}) => ({
          api: 'api/users/videos',
          params: {
            ...get_url_query(),
            ..._params
          }
        }),
        component: VideoCard,
        className: 'dx-grid-2',
        props: {}
      },
      home: {
        config: (_params = {}) => ({
          api: __.$Api.Home.list_tab_mv,
          params: {
            ...get_url_query(),
            ..._params
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
        config: (_params = {}) => ({
          api: __.$Api.Home.construct_list,
          params: {
            ...get_url_query(),
            ..._params
          }
        }),
        component: CateItem,
        className: 'dx-grid-1',
        props: {}
      },
      discover: {
        config: (_params = {}) => ({
          api: __.$Api.Home.new_mv_tag,
          params: {
            ...get_url_query(),
            ..._params
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
        config: (_params = {}) => ({
          api: route.query.api,
          params: {
            ...get_url_query(),
            ..._params
          }
        }),
        component: VideoCard,
        className: 'dx-grid-2',
        props: {
          mvType: 3
        },
        rewrite_props(item: any) {
          return {
            cover_thumb_url: item.cover_full,
            rating: item.play_count,
            ...item
          }
        }
      },
      original_tag: {
        config: () => ({
          api: 'api/original/list_tag'
        }),
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
      },
      film: {
        config: (_params = {}) => ({
          api: 'api/find/replyByRank',
          params: {
            ...get_url_query(),
            ..._params
          }
        }),
        component: VideoCard,
        className: 'dx-grid-2',
        props: {}
      }
    } as PageModule

    const { mv_find_tab, mv_nag_tab, mv_original_tab: original_tag, cartoon_tab } = useGlobalStore()
    const TABS = {
      find: mv_find_tab,
      home: mv_nag_tab,
      discover: mv_find_tab,
      anime: cartoon_tab,
      original_tag
    }

    const module = computed(() => {
      const type = route.query._type as keyof typeof MAP

      return MAP[type]
    })

    const tabs = computed(() => {
      const type = route.query._type as keyof typeof TABS

      return route.query.has_sort === '0' ? null : TABS[type]
    })
    const { key } = useKeepAlive({})

    const render_list = (_params = {}) => {
      const slots = {
        item: ({ item }: any) => {
          return h(module.value.component, {
            key: item.id,
            item: module.value.rewrite_props ? module.value.rewrite_props(item) : item,
            ...(module.value?.props ?? {})
          })
        }
      }
      return (
        <dx-hoc-list
          class={['px-1', module.value.className]}
          v-slots={slots}
          {...module.value.config?.(_params)}
        ></dx-hoc-list>
      )
    }

    const render_tab_list = () => {
      return (
        <dx-tabs class='first-no-padding dx-tabs' line-width='16px' shrink v-model:active={activeTab.value}>
          {tabs.value.map((tab: any, index: number) => {
            const { name, ...tabProps } = tab
            return (
              <van-tab {...tabProps}>
                {Math.abs(activeTab.value - index) <= props.renderCount
                  ? render_list({
                      [module.value.sortKey || 'sort']: tab.name
                    })
                  : null}
              </van-tab>
            )
          })}
        </dx-tabs>
      )
    }

    const topIconMap = {
      user: originalIcon
    }
    const title = computed(() => {
      return globalStore.navbarTitle ? globalStore.navbarTitle : ((route.meta.title as unknown as string) ?? '')
    })
    const navBarSlot = {
      title: () => {
        const type = route.query._type as keyof typeof topIconMap
        const icon = topIconMap[type]
        return icon ? (
          <span class='flex items-center'>
            {' '}
            {title.value}
            <img class='ml-0.5 h-auto !w-5' src={icon} alt='' />{' '}
          </span>
        ) : (
          title.value
        )
      }
    }

    return () => (
      <div key={module.value?.key ? key.value + module.value.key() : key.value} class='container pb-1.5'>
        <dx-navbar v-slots={navBarSlot}></dx-navbar>
        <div class='scroll-container'>
          {key.value && module.value ? (tabs.value ? render_tab_list() : render_list()) : null}
        </div>
      </div>
    )
  }
})
</script>
