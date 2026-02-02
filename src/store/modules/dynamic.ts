/**
 * desc: 动态页面
 * date: 2024.04.12
 */
import type { TabItem, Ai } from '@types'

interface Cache_state {
  PREVIEW_AI_FACE: Ai
  AI_FACE: Ai
}
type Cache_Keys = keyof Cache_state

const dynamicStore = defineStore('dynamic', {
  // 初始状态
  state: () => ({
    tab: {} as unknown as TabItem,
    cache: {} as unknown as Cache_state,
    pushVideo: [] as any[]
  }),

  // 提交状态
  actions: {
    setTab(newTab: TabItem) {
      this.tab = {
        ...newTab
      }
    },
    setCache(cache: any) {
      this.cache = cache
    },
    setPushVideo(items: any) {
      this.pushVideo = [...items]
    },
    update_cache<T extends Cache_Keys>(key: T, _cache: Cache_state[T]) {
      this.cache = {
        ...this.cache,
        [`${key}`]: {
          ..._cache
        }
      }
    }
  },

  persist: {
    storage: sessionStorage,
    pick: ['tab', 'cache']
  }
})

export default dynamicStore
