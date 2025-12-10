import type { ApiLike, Result } from '@types'

export type ResourceType =
  | 'mv'
  | 'post'
  | 'girl'
  | 'contents'
  | 'mh'
  | 'mv_feature'
  | 'mv_original'
  | 'audio'
  | 'face'
  | 'porn'
  | 'strip'
  | 'picture'
  | 'novel'
  | 'pic'
  | 'live'

export type AddUniKey<U extends ResourceType, T extends string, V> = {
  [K in U as `${K}_${T}`]: V
}

// export type ResourceVipTips = {
//   [K in ResourceType as `${K}_pop_vip_tips`]: string
// }
export type DialogAction = 'confirm' | 'cancel'
export type ResourceVipTips = AddUniKey<ResourceType, 'pop_vip_tips', string>

export type ResourceDiscount = AddUniKey<ResourceType, 'discount', number>

export interface PayPopupOptions {
  title?: string
  coins?: number
  successText?: string
  submitText?: string
  showSuccessAlert?: boolean
  successHandler?: (res: Result<any>) => boolean
  api: ApiLike | string
  params?: Record<string, any>
  type: ResourceType
  vip_type?: ResourceType
  payType?: PayType | number // 次数还是金币vip
  _type: number // 1 VIP  2 金币
  freeNum?: number
  onPay: (...args: any[]) => void
}

export type PayType = 1 | 2
