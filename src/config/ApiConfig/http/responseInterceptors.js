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
    const decryptData = $CryptoData.Decrypt(data.data)

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
