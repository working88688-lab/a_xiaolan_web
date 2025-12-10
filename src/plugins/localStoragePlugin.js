/**
 * desc: 本地缓存工具类
 * date: 2023.03.20
 */
class LocalStorage {
  // 初始化
  constructor({ $Decrypt, $Encrypt }) {
    const _this = this

    // 新增
    _this.set = (key, value) => {
      if (process.client) {
        window.localStorage.setItem(key, $Encrypt(JSON.stringify(value)))
      }
    }

    // 获取
    _this.get = (key, defaultValue = null) => {
      const json = window.localStorage.getItem(key)
      if (!json) {
        return defaultValue
      }

      try {
        const data = $Decrypt(json)
        return JSON.parse(data)
      } catch (e) {
        return defaultValue
      }
    }

    // 获取
    _this.getMap = (key, defaultValue = new Map()) => {
      const json = window.localStorage.getItem(key)
      if (!json) {
        return defaultValue
      }

      try {
        return new Map(JSON.parse($Encrypt(json)).map(([mk, mo]) => [mk, mo]))
      } catch (e) {
        return defaultValue
      }
    }

    // 匹配
    _this.match = (prefix = '') => {
      const data = Object.keys(localStorage).reduce((e, key) => {
        if (key.startsWith(prefix)) {
          let u = key.replace(prefix, '')
          if ('' == u) {
            return Object.fromEntries(LocalStorage.get(key))
          } else {
            e[u] = Object.fromEntries(LocalStorage.get(key))
          }
        }
        return e
      }, {})
      return data
    }

    // 删除
    _this.del = key => {
      window.localStorage.removeItem(key)
    }

    // 清除
    _this.clear = (prefix = '') => {
      const data = Object.keys(localStorage).reduce((e, key) => {
        if (key && prefix && key.startsWith(prefix)) {
          LocalStorage.del(key)
        }
        return e
      }, {})
      return data
    }
  }
}

export default defineNuxtPlugin(nuxtApp => {
  const localStorage = new LocalStorage(nuxtApp)
  // nuxtApp.provide('LocalStorage', localStorage)

  return {
    provide: {
      LocalStorage: localStorage
    }
  }
})
