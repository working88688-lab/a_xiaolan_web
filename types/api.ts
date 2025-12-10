export interface Result<T> {
  data: T
  status: number
  crypt: boolean
  isVV: boolean
  msg: string
  needLogin: boolean
}

export interface RequestConfig {
  method: string
  url: string
  mapping?: Record<string, unknown>
}

export interface RequestItem {
  [key: string]: RequestConfig | Record<string, RequestConfig>
}

export type PromiseifyApi<T extends RequestItem, R = any> = {
  [K in keyof T]: T[K] extends RequestConfig
  ? (...args: any[]) => Promise<Result<R>>
  : T[K] extends Record<string, RequestConfig>
  ? {
    [P in keyof T[K]]: (...args: any[]) => Promise<Result<R>>
  }
  : never
}

export interface BaseFetchOption {
  params?: Record<any, any>
  immediate?: boolean
  fields?: string
  success?: (...args: any[]) => void
  routeQueries?: string[]
  useShallowRef?: boolean
  before_refresh?: (...args: any[]) => void
}

export interface FetchListOption<T = any, D = any> extends BaseFetchOption {
  api?: any
  startRefreshEmptyData?: boolean // 刷新时是否先清空历史数据
  usePageSize?: boolean // 是否开启分页大小，有的接口不支持
  loadingWhenRefresh?: boolean
  useRestData?: boolean
}

export interface DFetchListOption<T = any, D = any> extends BaseFetchOption {
  api: any
  startRefreshEmptyData?: boolean // 刷新时是否先清空历史数据
  usePageSize?: boolean // 是否开启分页大小，有的接口不支持
  loadingWhenRefresh?: boolean
  useRestData?: boolean
}
