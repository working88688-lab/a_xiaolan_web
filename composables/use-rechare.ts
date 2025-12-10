/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-06-28 11:32:20
 * @Description: 花金币不够提示充值
 */
import type { Result } from '@types'

export const useReachage = () => {
  const __ = useNuxtApp()

  const to_recharge = (res: Result, status = 0, keyword = '金币') => {
    if (res.status === status && res.msg.includes(keyword)) {
      __.$Alert({
        message: '金币余额不足，立即充值',
        confirmButtonText: '金币充值'
      }).then(() => {
        __.$NavigateTo('/coin-recharge')
      })
    }
  }

  return {
    to_recharge
  }
}
