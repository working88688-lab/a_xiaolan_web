/**
 * desc: 响应拦截器
 * date: 2023.03.20
 */

// 响应结果处理
export function resConfig(res) {
  let {
    data,
    status,
    config: { fullAddress, imgDomain }
  } = res
  if (status === 200) {
    let { code, msg } = data

    // 是否返回全地址域名
    if (fullAddress) {
      msg = `${imgDomain}/${msg}`
    }

    // 如果成功，则返回资源路径
    if (1 == code) {
      return Promise.resolve(msg)
    }

    // 如果失败，则返回错误原因
    return Promise.reject(data)
  } else {
    return Promise.reject(data)
  }
}

// 响应错误处理
export function resError(error) {
  return Promise.reject(error)
}
