interface WebviewConfig {
  fixed?: boolean
  origin?: string
}

const EVENT_MAP = {
  'pwa::view::vip': () => {
    return new Promise(resolve => {
      const router = useRouter()
      router.isReady().then(() => {
        router.push('/renewal')

        resolve(true)
      })
    })
  },
  'pwa::view::recharge': () => {
    return new Promise(resolve => {
      const router = useRouter()
      router.isReady().then(() => {
        router.push('/coin-recharge1')

        resolve(true)
      })
    })
  },
  'pwa::navigate::back': () => {
    return new Promise(resolve => {
      const router = useRouter()
      router.isReady().then(() => {
        router.back()
        resolve(true)
      })
    })
  }
}
export class Webview {
  public url: string
  public config: WebviewConfig
  public iframe?: HTMLIFrameElement
  private _messageHandler?: (e: any) => void
  constructor(
    url: string,
    config = {
      fixed: true
    }
  ) {
    this.url = url
    this.config = config
  }

  create(el?: HTMLElement | string | null): HTMLIFrameElement {
    const iframe = document.createElement('iframe')
    iframe.src = this.url
    this.iframe = iframe

    const { origin } = this.config
    if (el) {
      el = (typeof el === 'object' ? el : document.querySelector(el)) as unknown as HTMLElement

      el.appendChild(iframe)
      iframe.style.cssText = 'width:100%;height:100%'
    } else {
      iframe.style.cssText = 'width:100%;height:100%;position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999'
      document.body.appendChild(iframe)
    }

    this._messageHandler = (e: MessageEvent) => {
      if (origin && origin !== e.origin) {
        return ''
      }

      const message = e.data
      // @ts-ignore
      const event = EVENT_MAP[message]
      if (typeof message === 'string' && event) {
        event()
      }
    }
    window.addEventListener('message', this._messageHandler)
    return iframe
  }

  destory() {
    if (this.iframe) {
      this.iframe.remove()
    }
    if (this._messageHandler) {
      window.removeEventListener('message', this._messageHandler)
    }
  }
}
