/**
 * desc: 请求拦截器
 * date: 2023.04.25
 */

import { useUserStore } from '@store'

// 请求准备处理
export function reqConfig(config, { $CryptoData, $Oauth }) {
  let data = config.data
  // 參數加密
  if (config.data) {
    data = {
      ...$Oauth.data(),
      ...config.data,
      system_token: useUserStore().token
    }
  }
  config.data = JSON.stringify(data)

  const isDebug = import.meta.env.VITE_MODE === 'debug'
  if (isDebug) {
    // @ts-ignore
    config.__dev__log__data__ = config.data
  }
  console.log('config.data: ', config.data)

  config.data = $CryptoData.Encrypt(config.data)
  const { baseURL = '' } = useAppConfig().api
  config.baseURL = baseURL
  return config
}

// 请求错误处理
export function reqError(error) {
  return Promise.reject(error)
}
