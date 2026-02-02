/**
 * desc: 录像追踪
 * date: 2024.03.29
 */
import type { VideoItem } from '~/types'

const stackStore = defineStore('stack', {
  // 初始状态
  state: () => ({
    stacks: [] as unknown as VideoItem[],
    api: '',
    params: {} as any,
    index: 0,
    fieldPath: 'data'
  }),
  getters: {},
  // 提交状态
  actions: {
    update_params(params: any) {
      this.params = {
        ...params
      }
    },
    updateFieldPath(_path: string) {
      this.fieldPath = _path
    },
    update_api(api: string) {
      this.api = api
    },
    addStacks(stacks: VideoItem[]) {
      this.stacks = [...this.stacks, ...stacks]
    },
    updateStacks(stacks: VideoItem[]) {
      this.stacks = [...stacks]
    },
    updateIndex(_index: number) {
      this.index = _index
    },
    updateStackByIndex(index: number, stack: VideoItem) {
      this.stacks.splice(index, 1, stack)
    }
  },

  persist: {
    storage: sessionStorage,
    pick: ['api', 'params', 'fieldPath', 'index', 'stacks']
  }
})

export default stackStore
