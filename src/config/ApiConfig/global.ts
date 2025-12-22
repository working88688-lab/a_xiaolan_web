class Global {
  private _config?: any
  public app: any
  // 初始化
  constructor(app: any) {
    this._config = null
    this.app = app
  }

  init() {
    return this._getConfig()
  }

  async _getConfig() {
    const router = useRouter()
    const cache_site = localStorage.getItem('pwa_download_url')
    try {
      const app = useAppConfig()
      const { checkLine } = useLine()
      const baseURL = await checkLine()

      app.api.baseURL = baseURL as string
      const data = (await this.app.$Store.global.synch()) || {}

      if ((!cache_site && data?.pwa_download_url) || (cache_site && cache_site !== data?.pwa_download_url)) {
        setTimeout(() => {
          localStorage.setItem('pwa_download_url', data?.pwa_download_url)
        }, 0)
      }
      localStorage.removeItem('check_fail')
      this._config = data
      return data
    } catch (error) {
      localStorage.setItem('check_fail', '1')
      // 缓存了才跳
      if (cache_site) {
        setTimeout(() => {
          router.replace('/error/timeout')
        })
      }
      console.error('@获取配置失败', error)
    }
  }

  getConfig() {
    return new Promise((resolve, reject) => {
      if (this._config) {
        resolve(this._config)
      } else {
        this._getConfig().then(resolve).catch(reject)
      }
    })
  }
}

const _proxyGlobal = createSingletonProxy(Global)
export default defineNuxtPlugin(async () => {
  // 初始参数
  const app = useNuxtApp()
  const g = new _proxyGlobal(app)
  await g.init()
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@全局初变量加载完成~`)
  const globalStore = useGlobalStore()
  const userStore = useUserStore()

  function createSign(data = {}, keyString: string, ivString: string, signKey: string) {
    const _data = JSON.stringify({
      ...app.$Oauth.data(),
      ...data,
      system_token: useUserStore().token
    })
    console.log('_data: ', _data)
    return app.$CryptoData.encryptReportParamsBrowser(_data, { keyString, ivString, signKey })
  }
  app.$Tracker.init({
    channel: userStore.u.build_id,
    appId: globalStore.config.click_app_id,
    uid: userStore.u.uid,
    deviceId: app.$Oauth.data().oauth_id,
    bury_point: toRaw(globalStore.config.bury_point),
    createSign
  })
  return {
    provide: {
      G: g
    }
  }
})
