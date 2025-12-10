/**
 * desc: 文件上传(小文件)
 * date: 2023.03.20
 */

import axios from 'axios'
import { reqConfig, reqError } from './requestInterceptors'
import { resConfig, resError } from './responseInterceptors'

class Http {
  constructor() {
    const _this = this

    // 单例模式
    if (_this.instance) {
      return _this.instance
    }

    // 创建axios实例
    _this.instance = axios.create({
      // baseURL: "https://new.ycomesc.live",
      timeout: 50000,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // 请求拦截器
    _this.instance.interceptors.request.use(reqConfig, reqError)

    // 响应拦截器
    _this.instance.interceptors.response.use(resConfig, resError)
  }

  // 获取实例
  getInstance() {
    const _this = this
    return _this.instance
  }
}

export default new Http().getInstance()
