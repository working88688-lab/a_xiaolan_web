export * from './api'
export * from './banner'
export * from './comics'
export * from './common'
export * from './discover'
export * from './globalState'
export * from './login'
export * from './my'
export * from './tag'
export * from './validator'
export * from './video'
export * from './live'
export * from './resource'
export * from './permissions'
export * from './emitter'

export interface Result<T = any> {
  data: T
  status: number
  crypt: boolean
  isVV: boolean
  msg: string
  needLogin: boolean
}

export type MyAxiosResponse<T> = Promise<Result<T>>

export type ApiLike = <T, D = any>(config: D) => MyAxiosResponse<T>

export type Local = 'en' | 'zh-cn'

export type PageConfig = {
  page: number
  size?: number
  limit?: number
}
