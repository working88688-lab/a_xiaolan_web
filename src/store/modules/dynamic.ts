/**
 * desc: 动态页面
 * date: 2024.04.12
 */
import type { TabItem } from '@types'

const dynamicStore = defineStore('dynamic', {
  // 初始状态
  state: () => ({
    tab: {} as unknown as TabItem,
    cache: {},
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
    }
  },

  persist: {
    storage: sessionStorage,
    pick: ['tab', 'cache']
  }
})

export default dynamicStore
