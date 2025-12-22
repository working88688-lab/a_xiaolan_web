// @ts-nocheck
/**
 * desc: 接口构建类
 * date: 2024.03.28
 */
import type { PromiseifyApi } from '@types'
import Api from './apis/index'
// import UploadBigVideo from './uploadBigVideo/handler'
// import UploadBigRequest from './uploadBigVideo/http/index'
import UploadImage from './uploadImage/index'
// import uploadSimpleVideo from './uploadSimpleVideo/index'
import upload from './uploadVideo'

type IApiMap = typeof Api

type IApi = PromiseifyApi<IApiMap> & {
  dynamic: ApiLike
}

class HttpApi {
  static instance = null

  // 初始化
  constructor(apisConfig, app) {
    // 单例模式
    if (HttpApi?.api) {
      return HttpApi.api
    }

    const _this = this

    //
    _this.app = app

    // 构建API
    _this.api = _this.crateApis(apisConfig)

    //动态路径api
    _this.api.dynamic = this.createDyamicApi.bind(this)
  }
  // 构建动态url api
  createDyamicApi(config = {}) {
    const { method = 'post', url, data = {}, axiosConfig = {}, ...restConfig } = config
    // 接口创建
    switch (method.toLocaleUpperCase()) {
      case 'GET':
        return this.createGet(url, data)
      case 'POST':
        return this.createPost(url, data, { ...restConfig, ...axiosConfig })
      case 'FETCH':
        return this.createFetchPost(url, data)
      case 'UPLOADIMAGE':
        return this.createUploadImage(url, data)
      case 'UPLOADVIDEO':
        return this.createUploadVideo(url, data)
      default:
        console.error('指定的接口请求类型不存在, 请注意检查!')
        break
    }
  }
  // 构建API
  crateApis(apisConfig) {
    const methods: any = {}

    // 初始接口
    Object.keys(apisConfig).forEach(key => {
      // @ts-ignore
      const func = apisConfig[key]
      // 递归模块
      if (!(func.method && func.url)) {
        return (methods[key] = this.crateApis(func))
      }
      const { url, mapping, method, ...restConfig } = func
      // 接口创建
      switch (method.toLocaleUpperCase()) {
        case 'GET':
          methods[key] = this.createGet(url, mapping, restConfig)
          break
        case 'POST':
          methods[key] = this.createPost(url, mapping, restConfig)
          break
        case 'FETCH':
          methods[key] = this.createFetchPost(url, mapping)
          break
        case 'UPLOADIMAGE':
          methods[key] = this.createUploadImage(url, mapping)
          break
        case 'UPLOADVIDEO':
          methods[key] = this.createUploadVideo(url, mapping)
          break
        default:
          console.error('指定的接口请求类型不存在, 请注意检查!')
          break
      }
    })

    return methods
  }

  // get请求, 新增是否接口出错默认弹出接口报错信息
  createGet(url, params, config = {}) {
    return (_args = {}) => {
      const { _config = {}, ...args } = _args
      return this.app.$Http({
        method: 'GET',
        url: url,
        ...args,
        ...{ data: params },
        ...config,
        ..._config
      })
    }
  }

  // post请求
  createPost(url, params, config = {}) {
    const _this = this
    return async (_args = {}) => {
      const { _config = {}, ...args } = _args
      return await _this.app.$Http({
        method: 'POST',
        url: url,
        data: {
          ...params,
          ...args
        },
        ...config,
        ..._config
      })
    }
  }

  // 直接请求, 新增是否接口出错默认弹出接口报错信息
  createFetchPost(url, params) {
    const _this = this
    return async (path = '', args = {}) => {
      return await _this.app.$Http({
        method: 'POST',
        url: `${path}`,
        data: {
          ...params,
          ...args
        }
      })
    }
  }

  // upload请求(小文件、图片资源)
  createUploadImage(url) {
    const _this = this
    return async ({ file, onUploadProgress, useCompress = true }) => {
      try {
        if (useCompress) {
          file = await _this.app.$ImageCompression.compressor(file)
        }
        return _this.app.$G.getConfig().then(({ imgUploadUrl }) => {
          return UploadImage({
            baseURL: `${imgUploadUrl}`,
            // url: url,
            method: 'POST',
            onUploadProgress,
            data: { ...{ file } }
          })
        })
      } catch (error) {
        _this.app.$Toast(error)
        return Promise.reject(error)
      }
    }
  }
  // upload请求(大文件、视频切片)
  createUploadVideo() {
    return (file: File, onUploadProgress: any) => {
      return upload(file, {
        onUploadProgress
      })
    }
  }

  static getInstance(app) {
    if (HttpApi?.api) {
      return HttpApi.api
    } else {
      return new HttpApi(Api, app).api
    }
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const api = HttpApi.getInstance(nuxtApp) as unknown as IApi
  // nuxtApp.provide('Api', api)
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@接口构建器加载完成~`)

  return {
    provide: {
      Api: api
    }
  }
})
