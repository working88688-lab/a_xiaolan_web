/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-07-01 15:55:43
 * @Description: 自定义请求
 */

import type { BaseFetchOption, MyAxiosResponse, Result } from '@types'

interface Option extends BaseFetchOption {
  api: (<T, D = any>(config: D) => MyAxiosResponse<T>) | string
}

export const useMyFetch = <T>({
  api: _api,
  fields,
  params,
  success,
  immediate,
  routeQueries,
  useShallowRef = false
}: Option) => {
  const __ = useNuxtApp()
  const api = typeof _api === 'string' ? __.$Api.dynamic({ url: _api, method: 'post' }) : _api
  const loading = ref(false) // 请求中
  const data = useShallowRef ? shallowRef<T>({} as unknown as T) : ref<T>({} as unknown as T) // 当前请求结果
  const result = useShallowRef ? ref<Result<T>>() : shallowRef<Result<T>>()
  const execute = async (_params: any = {}) => {
    try {
      loading.value = true
      const combineParams = {
        ...params,
        ..._params
      }
      if (routeQueries) {
        await _sleep()
        const route = useRoute()

        routeQueries.forEach(item => {
          combineParams[item] = route.query[item]
        })
      }
      const res = await api<T>(combineParams)
      const _data = res.data
      // @ts-ignore
      data.value = Array.isArray(_data)
        ? [..._data]
        : fields
          ? Array.isArray(_data[fields])
            ? [..._data[fields]]
            : {
                // @ts-ignore
                ..._data[fields]
              }
          : _data
      result.value = { ...res }
      success?.()
      return _data
      // @ts-ignore
    } catch (error) {
      data.value = Array.isArray(data.value) ? [] : {}
      return Promise.reject(error)
    } finally {
      loading.value = false
    }
  }
  onBeforeMount(() => {
    if (immediate) {
      execute()
    }
  })
  return {
    execute,
    loading,
    data,
    result
  }
}
