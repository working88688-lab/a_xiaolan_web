/**
 * desc: 录像追踪
 * date: 2024.03.29
 */
import type { VideoItem } from '@types'

const stackStore = defineStore('stack', {
  // 初始状态
  state: () => ({
    stackKey: 0,
    stacks: [] as unknown as VideoItem[],
    index: -1
  }),
  getters: {
    stackIds(): number[] {
      return this.stacks.map(item => item.id)
    },
    currentItem(): VideoItem {
      return this.stacks[this.index]
    }
  },
  // 提交状态
  actions: {
    updateStacks(stacks: any[]) {
      this.stacks = [...stacks]
    },
    updateStackByIndex(index: number, stack: any) {
      this.stacks.splice(index, 1, stack)
    },
    addStack(stackData: any) {
      const { stackKey, data, index } = stackData
      if (!this.stackKey || this.stackKey !== stackKey) {
        this.stackKey = stackKey
        this.stacks = []
        this.stacks.push(data)
      } else {
        if (!this.stackIds.includes(data.id)) {
          this.stacks.push(data)
        }
      }
    },
    setIndex(index: number) {
      this.index = index
    }
  },

  persist: {
    storage: sessionStorage,
    pick: ['stacks']
  }
})

export default stackStore
