import type { PayPopupOptions } from '@types'

export interface Events {
  cache: any // 同步缓存
  refresh: any
  recharge: number //  同步充值
  pay: PayPopupOptions // 全局支付
}

export type EventType = keyof Events
