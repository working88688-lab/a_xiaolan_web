/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-05-24 15:30:38
 * @Description: 动态接口、动态参数列表请求
 */
import type { ApiLike, PageConfig, Result } from '@types'

interface Option {
  api: <T, D = any>(config?: D) => ApiLike
  params?: () => Record<any, any> // 如果参数中带有响应式数据，在其改变会后将会自动调用refresh方法
  immediate?: boolean
  fields?: string
  startRefreshEmptyData?: boolean // 刷新时是否先清空历史数据
  usePageSize?: boolean // 是否开启分页大小，有的接口不支持
  success?: (...args: any[]) => void
  useRouteQuery?: boolean
}

const _getData = <T>(data: Array<T> | Record<string, any>, field: string): T[] => {
  return Array.isArray(data) ? data : (data[field] as unknown as T[])
}

export const useDynamicFetchList = <T>({
  api,
  params,
  immediate,
  fields = 'list',
  startRefreshEmptyData = true,
  usePageSize = true,
  success
}: Option) => {
  let latestRequest = 0
  const MAX_PAGE_SIZE = 10
  const isReady = ref(false)
  const loading = ref(false) // 请求中
  const isEnd = ref(false) // 接口是否还有数据
  const data = ref<T[]>([]) // 当前请求结果
  const listData = ref<T[]>([]) // 所有请求结果
  const result = ref<Result<T>>({} as unknown as Result<T>)
  const defaultPageConfig: PageConfig = {
    page: 1
  }
  let page: PageConfig = usePageSize
    ? {
        ...defaultPageConfig,
        size: params?.()?.size ?? MAX_PAGE_SIZE,
        limit: params?.()?.size ?? MAX_PAGE_SIZE
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
        ...params?.(),
        ...page,
        ..._params
      }
      const res = await api()<T>(combineParams)
      if (latestRequest === currentRequest) {
        const _data = _getData(res.data, fields)
        // @ts-ignore
        data.value = [..._data]
        // @ts-ignore
        listData.value = [...listData.value, ..._data]
        const maxSize = page.size || MAX_PAGE_SIZE
        isEnd.value = _data.length < maxSize
        page.page += 1
        // @ts-ignore
        result.value = { ...res }
        success?.()
        return res
      }
    } catch (error) {
      isEnd.value = true
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
    try {
      loading.value = true
      isEnd.value = false
      isReady.value = false
      if (startRefreshEmptyData) {
        listData.value = []
      }
      page.page = 1

      const res = await api()<T>({ ...params?.(), ...page, ..._params })
      if (latestRequest === currentRequest) {
        page.page += 1
        const _data = _getData(res.data, fields)
        listData.value = []
        // @ts-ignore
        data.value = [..._data]
        // @ts-ignore
        listData.value = [..._data]
        // @ts-ignore
        result.value = { ...res }
        const maxSize = page.size || MAX_PAGE_SIZE
        isEnd.value = _data.length < maxSize
        success?.()
        return res
      }
    } catch (error) {
      console.log('error: ', error)
      isEnd.value = true
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
    result.value = {}
    page = usePageSize
      ? {
          ...defaultPageConfig,
          size: params?.size ?? 20,
          limit: params?.size ?? 20
        }
      : defaultPageConfig
  }

  onBeforeMount(() => {
    if (immediate) {
      execute()
    }
  })

  return {
    execute,
    loading,
    isEnd,
    data,
    isEmpty,
    listData,
    refresh,
    setPage,
    result,
    isReady,
    reset
  }
}
