import type { AcountInfo } from '@types'
/**
 * desc: 账户信息
 * date: 2024.04.03
 */

const accountStore = defineStore('account', {
  // 初始状态
  state: () => ({
    accoutInfo: {
      id: ''
    } as unknown as AcountInfo
  }),

  // 提交状态
  actions: {
    setAccount(info: AcountInfo) {
      this.accoutInfo = { ...info }
    }
  }
})

export default accountStore
