/**
 * desc: 响应拦截器
 * date: 2023.03.20
 */
// import CryptoData from '../utils/crypto-data'

// 响应结果处理
export function resConfig(res, { $CryptoData, $Store, $Alert, $i18n, $NavigateTo, $Toast }) {
  const { data, status, config } = res

  const { showError = true, showSuccess = false, throwError = true, successCode = 1 } = config
  if (status === 200) {
    // 兼容不同后端返回壳：
    // 1) 常规：{ errcode, timestamp, data: '<HEX>' , sign }
    // 2) 少数接口：{ data: { data: '<HEX>' } }
    // 3) 直出明文：{ status, data, msg }（不需要解密）
    const encryptedPayload = data?.data?.data ?? data?.data
    const shouldDecrypt = typeof encryptedPayload === 'string' && encryptedPayload.length > 0

    let decryptData
    if (shouldDecrypt) {
      decryptData = $CryptoData.Decrypt(encryptedPayload)
    } else if (data && typeof data === 'object' && typeof data.status !== 'undefined') {
      decryptData = data
    } else {
      // 兜底：不要在解密器里因为 undefined.length 直接炸
      const fallback = { status: 0, msg: '接口返回格式异常', data: data }
      if (showError) $Toast(fallback.msg)
      return throwError ? Promise.reject(fallback) : Promise.resolve(fallback)
    }

    if (import.meta.env.VITE_MODE === 'debug') {
      // @ts-ignore
      console.log(
        // @ts-ignore
        `%curl：[${config.url}]\n%cparams before crypto：${config.__dev__log__data__}\n`,
        'color: #1677ff; font-size: 14px;',
        'color: #000; font-size: 12px; '
      )

      console.log(
        `%cresponse：[${config.url}]`,
        `color: ${successCode === decryptData.status ? '#07c160' : '#ee0a24'};font-size: 15px;`
      )
      console.log(decryptData)
    }

    // 正常处理
    if (successCode === decryptData.status) {
      if (showSuccess) {
        const msg = decryptData?.data?.msg ?? decryptData?.msg
        msg && $Toast(msg)
      }
      return Promise.resolve(decryptData)
    }
    if (decryptData.status === 420) {
      if (!$Store.user.token) {
        //没有token 未登录
        if (!$Alert) {
          $NavigateTo('/login')
          return
        }
        $Alert({
          confirmButtonText: '去登录',
          message: decryptData.msg,
          overlay: true,
          closeOnPopstate: false,
          closeOnClickOverlay: true
        }).then(result => {
          $NavigateTo('/login')
        })
      } else {
        //已登录 登录过期
        $Store.user.logout(true)
      }
    }

    if (showError) {
      $Toast(decryptData.msg)
    }
    return throwError ? Promise.reject(decryptData) : Promise.resolve(decryptData)
  } else {
    return Promise.reject(data)
  }
}

// // 响应错误处理
export function resError(error) {
  if (error?.response?.status) {
    switch (error.response.status) {
      // 401: 未登录
      case 420:
        break

      // 其他错误
      default:
    }
  }
  return Promise.reject(error)
}
