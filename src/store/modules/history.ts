/**
 * desc: 路由历史管理
 * date: 2023.04.25
 */

const historyStore = defineStore('history', {
  // 初始状态
  state: () => ({
    keepalive: new Set()
  }),

  // 派生状态
  getters: {},

  // 提交状态
  actions: {
    addKeepaLive(route) {
      this.keepalive.add(route)
    },
    deleteKeepaLive() {
      this.keepalive.pop()
    }
  }
})

export default historyStore
