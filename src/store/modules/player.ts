/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-09-24 15:10:19
 * @Description: 播放器全局设置
 */

const playerStore = defineStore('player', {
  // 初始状态
  state: () => ({
    autoplayMuted: true,
    danmuOpen: false,
    expand: true
  }),

  actions: {
    update_autoplay_muted(status: boolean) {
      this.autoplayMuted = status
    },
    toggleDanmu() {
      this.danmuOpen = !this.danmuOpen
    },
    toggleExpand() {
      this.expand = !this.expand
    }
  },

  persist: {
    storage: localStorage,
    pick: ['autoplayMuted', 'danmuOpen']
  }
})

export default playerStore
