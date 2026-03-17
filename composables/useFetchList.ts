/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-28 14:25:40
 * @Description: 自定义列表类请求
 */
import type { BaseFetchOption, MyAxiosResponse, PageConfig, Result, BannerItem } from '@types'

import { _sleep } from '@utils/helper'

import { get as _get } from 'lodash-es'

interface Option extends BaseFetchOption {
  api: (<T, D = any>(config: D) => MyAxiosResponse<Array<T>>) | string
  startRefreshEmptyData?: boolean // 刷新时是否先清空历史数据
  usePageSize?: boolean // 是否开启分页大小，有的接口不支持
  loadingWhenRefresh?: boolean
  adConfig?: {
    key: string
    index?: number
  }
  axiosConfig?: any
}

const _getData = <T>(data: Array<T> | Record<string, any>, field: string): T[] => {
  return Array.isArray(data) ? data : (_get(data, field, []) as unknown as T[])
}

const getRawParams = (_params?: Record<string, unknown>) => {
  const params = _params || {}
  return Object.keys(params).reduce(
    (acc, cur) => {
      const value = params[cur]

      acc[cur] = isRef(value) ? value.value : value
      return acc
    },
    {} as Record<string, unknown>
  )
}

const getReactiveParams = (_params?: Record<string, unknown>) => {
  const params = _params || {}
  return Object.keys(params).reduce(
    (acc, cur) => {
      const value = params[cur]
      if (isRef(value)) {
        acc.push(value)
      }
      return acc
    },
    [] as Array<Ref<any>>
  )
}

const handle_route_query = (arr: Array<string>, res: any, route: any) => {
  arr.forEach(item => {
    const keys = item.split(':')
    if (keys.length > 1) {
      res[keys[1]] = route.query[keys[0]]
    } else {
      res[item] = route.query[item]
    }
  })
}

export const useFetchList = <T>({
  api: _api,
  params,
  success,
  immediate,
  routeQueries,
  fields = 'list',
  startRefreshEmptyData = true,
  usePageSize = false,
  before_refresh,
  loadingWhenRefresh = true,
  useShallowRef = false,
  adConfig,
  axiosConfig = {}
}: Option) => {
  const __ = useNuxtApp()
  const api = typeof _api === 'string' ? __.$Api.dynamic({ url: _api, method: 'post', axiosConfig }) : _api
  let latestRequest = 0
  const MAX_PAGE_SIZE = params?.size ?? 1
  const isReady = ref(false)
  const error_msg = ref()
  const isError = ref(false)
  const effect = ref(false)
  const loading = ref(false) // 请求中
  const isEnd = ref(false) // 接口是否还有数据
  const data = useShallowRef ? shallowRef<T[]>([]) : ref<T[]>([]) // 当前请求结果
  const listData = useShallowRef ? shallowRef<T[]>([]) : ref<T[]>([]) // 所有请求结果
  const ads = ref<BannerItem[]>([])
  const result = useShallowRef
    ? shallowRef<Result<T>>({} as unknown as Result<T>)
    : ref<Result<T>>({} as unknown as Result<T>)
  const _reactiveParams = getReactiveParams(params)

  const defaultPageConfig: PageConfig = {
    page: 1
  }
  let page: PageConfig = usePageSize
    ? {
        ...defaultPageConfig,
        size: params?.size ?? MAX_PAGE_SIZE,
        limit: params?.size ?? MAX_PAGE_SIZE
      }
    : defaultPageConfig
  const isEmpty = computed(() => {
    return listData.value.length === 0 && !loading.value
  }) // 请求是否为空

  const execute = async (_params: any = {}) => {
    const currentRequest = Date.now()
    latestRequest = currentRequest
    try {
      loading.value = true
      const combineParams = {
        ...page,
        ...getRawParams(params),
        ...getRawParams(_params)
      }
      if (routeQueries) {
        await _sleep()
        const route = useRoute()
        handle_route_query(routeQueries, combineParams, route)
      }

      const res = await api<T>(combineParams)
      if (latestRequest === currentRequest) {
        const _data = _getData(res.data, fields)
        // @ts-ignore
        data.value = [..._data]
        // @ts-ignore
        listData.value = [...listData.value, ..._data]

        if (adConfig && listData.value.length >= 10) {
          const merged = [...listData.value] // 拷贝一份
          const newAds = _get(res.data, adConfig.key, [])
          const adInsertIndex1 = (page.page - 1) * 20 + 9
          const adInsertIndex2 = adInsertIndex1 + 10
          if (newAds[0]) {
            // @ts-ignore
            const item = newAds[0]
            // @ts-ignore
            merged.splice(adInsertIndex1, 0, { ...item, isAd: true, id: item.id + page.page + 1 })
          }
          if (newAds[1]) {
            // @ts-ignore
            const item = newAds[1]
            // @ts-ignore
            merged.splice(adInsertIndex2, 0, { ...item, isAd: true, id: item.id + page.page + 2 })
          }
          // @ts-ignore
          listData.value = [...merged]
        }
        const maxSize = page.size || MAX_PAGE_SIZE
        isEnd.value = _data.length < maxSize
        page.page += 1
        // @ts-ignore
        result.value = { ...res }
        isError.value = false
        error_msg.value = ''
        success?.(result.value, false)

        return res
      }
    } catch (error) {
      console.log('error: ', error)
      isEnd.value = true
      isError.value = true
      error_msg.value = (error as any)?.msg
      return Promise.reject(error)
    } finally {
      nextTick(() => {
        loading.value = false
        isReady.value = true
      })
    }
  }

  const refresh = async (_params: any = {}) => {
    const currentRequest = Date.now()
    latestRequest = currentRequest
    before_refresh?.()
    try {
      loading.value = loadingWhenRefresh
      isEnd.value = false
      if (startRefreshEmptyData) {
        listData.value = []
        ads.value = []
      }
      page.page = 1
      const combineParams = {
        ...page,
        ...getRawParams(params),
        ...getRawParams(_params)
      }
      if (routeQueries) {
        await _sleep()
        const route = useRoute()
        handle_route_query(routeQueries, combineParams, route)
      }
      const res = await api<T>(combineParams)
      if (latestRequest === currentRequest) {
        page.page += 1
        const _data = _getData(res.data, fields)
        listData.value = []
        // @ts-ignore
        data.value = [..._data]
        // @ts-ignore
        listData.value = [..._data]
        if (adConfig && listData.value.length >= 10) {
          const merged = [...listData.value] // 拷贝一份
          const newAds = _get(res.data, adConfig.key, [])
          const adInsertIndex1 = 9
          const adInsertIndex2 = 19
          if (newAds[0]) {
            const item = newAds[0]
            // @ts-ignore
            merged.splice(adInsertIndex1, 0, { ...item, isAd: true, id: item.id + page.page + 1 })
          }
          if (newAds[1]) {
            const item = newAds[1]
            // @ts-ignore
            merged.splice(adInsertIndex2, 0, { ...item, isAd: true, id: item.id + page.page + 2 })
          }
          listData.value = merged
        }
        // @ts-ignore
        result.value = { ...res }
        const maxSize = page.size || MAX_PAGE_SIZE
        isEnd.value = _data.length < maxSize
        isError.value = false
        error_msg.value = ''
        success?.(result.value, true)
        return res
      }
    } catch (error) {
      console.log('error: ', error)
      isEnd.value = true
      isError.value = true
      error_msg.value = (error as any)?.msg
      return Promise.reject(error)
    } finally {
      nextTick(() => {
        loading.value = false
        isReady.value = true
      })
    }
  }

  const setPage = (_page: any) => {
    page = {
      ...page,
      ..._page
    }
  }

  const reset = () => {
    listData.value = []
    data.value = []
    isEnd.value = false
    loading.value = false
    isError.value = false
    ads.value = []
    // @ts-ignore
    result.value = {}
    page = usePageSize
      ? {
          ...defaultPageConfig,
          size: params?.size ?? 20,
          limit: params?.size ?? 20,
          page: 1
        }
      : {
          ...defaultPageConfig,
          page: 1
        }
  }

  if (_reactiveParams.length) {
    watch(_reactiveParams, () => {
      effect.value = true
      refresh().finally(() => {
        effect.value = false
      })
    })
  }

  onBeforeMount(() => {
    if (immediate) {
      execute()
    }
  })

  return {
    execute,
    loading,
    isError,
    error_msg,
    isEnd,
    effect,
    data,
    isEmpty,
    listData,
    refresh,
    setPage,
    result,
    isReady,
    reset,
    ads,
    page
  }
}
