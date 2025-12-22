/**
 * desc: 设备标识类
 * date: 2023.03.20
 *
 * 主要方法:
 * data():    获取标识
 * reset():   重置标识
 * isExist(): 存在标识
 */
class Oauth {
  static _LOCAL_OAUTHID = '___USER__OAUTHID'

  // 初始化
  constructor({ $LocalStorage }) {
    const config = useAppConfig()
    const _LOCAL_OAUTHID = config.tokenKey || Oauth._LOCAL_OAUTHID
    const _this = this

    if (_this.instance) {
      return _this
    }

    _this.instance = true
    _this.oauth_type = 'pwa'
    const parmas = new URLSearchParams(location.search)
    // 封装
    const getdata = () => {
      return {
        bundle_id: 'tips.yc.bs',
        version: config.api.version,
        oauth_type: _this.oauth_type,
        oauth_id: _this.oauth_id,
        trace_id: parmas.get('trace_id') || ''
      }
    }

    // 生成
    const generate = () => {
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var id = ''
      var date = +new Date()
      for (var i = 0; i < 19; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return `${id}${date}`
    }

    // 获取
    _this.data = () => {
      const _this = this

      // 存在？
      if (_this?.oauth_id) {
        return getdata()
      }

      // 存在？
      if (_this?.isExist()) {
        return getdata()
      }

      // 生成
      _this.oauth_id = generate()
      // 同步本地
      process.client && $LocalStorage.set(_LOCAL_OAUTHID, _this.oauth_id)
      // 同步内存
      // todo...

      return getdata()
    }

    // 重置
    _this.reset = () => {
      const _this = this

      // 生成
      _this.oauth_id = generate()
      // 同步本地
      process.client && $LocalStorage.set(_LOCAL_OAUTHID, _this.oauth_id)
      // 同步内存
      // todo...

      return getdata()
    }

    // 存在？
    _this.isExist = () => {
      const _this = this
      let oauth = $LocalStorage?.get(_LOCAL_OAUTHID) ?? false
      if (oauth) {
        _this.oauth_id = oauth
        return true
      } else {
        return false
      }
    }

    return false
  }
  // 浏览器指纹
  // generateBrowserFingerprint() {
  //   // 获取浏览器的语言设置
  //   var language = navigator.language || navigator.userLanguage

  //   // 获取屏幕分辨率和颜色深度
  //   var resolution = screen.width + 'x' + screen.height
  //   var colorDepth = screen.colorDepth

  //   // 获取浏览器窗口大小
  //   var windowSize = window.innerWidth + 'x' + window.innerHeight

  //   // 获取是否启用 cookie
  //   var hasCookieEnabled = navigator.cookieEnabled

  //   // 获取浏览器插件信息
  //   var plugins = Array.from(navigator.plugins).map(function (plugin) {
  //     return {
  //       name: plugin.name,
  //       filename: plugin.filename,
  //       description: plugin.description
  //     }
  //   })

  //   // 获取浏览器的字体列表
  //   var fonts = Array.from(document.fonts).map(function (font) {
  //     return {
  //       family: font.family,
  //       weight: font.weight,
  //       style: font.style
  //     }
  //   })

  //   // 获取浏览器的 WebGL 渲染信息
  //   var gl = null
  //   try {
  //     var canvas = document.createElement('canvas')
  //     gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  //   } catch (e) {}

  //   var glVendor = gl ? gl.getParameter(gl.VENDOR) : 'unknown'
  //   var glRenderer = gl ? gl.getParameter(gl.RENDERER) : 'unknown'
  //   var glVersion = gl ? gl.getParameter(gl.VERSION) : 'unknown'

  //   // 构造浏览器指纹对象
  //   var fingerprint = {
  //     userAgent: navigator.userAgent,
  //     language: language,
  //     resolution: resolution,
  //     colorDepth: colorDepth,
  //     windowSize: windowSize,
  //     hasCookieEnabled: hasCookieEnabled,
  //     plugins: plugins,
  //     fonts: fonts,
  //     glVendor: glVendor,
  //     glRenderer: glRenderer,
  //     glVersion: glVersion
  //   }

  //   // 转换为 JSON 字符串
  //   var fingerprintString = JSON.stringify(fingerprint)

  //   var hash = CryptoJS.SHA256(fingerprintString)

  //   // 返回 SHA-256 哈希字符串
  //   return hash.toString(CryptoJS.enc.Hex)
  // }
}

export default defineNuxtPlugin(nuxtApp => {
  const oauth = new Oauth(nuxtApp)
  // nuxtApp.provide('Oauth', oauth)
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@设备生成器加载完成~`)

  return {
    provide: {
      Oauth: oauth
    }
  }
})
