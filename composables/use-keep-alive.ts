type IOptions = {
  getKey?: (...args: any[]) => any
  reset?: (...args: any[]) => void
  active?: (...args: any[]) => void
  deactivated?: (...args: any[]) => boolean
  effect?: (...args: any[]) => void
  initKey?: boolean
}

export const useKeepAlive = (config: IOptions) => {
  const _getKey = config?.getKey ?? (() => useId())

  const key = ref(config.initKey && _getKey())
  const activeTab = ref(0)
  const cleanUp = () => {
    nextTick(() => {
      key.value = ''
      activeTab.value = 0
      config.reset?.()
    })
  }
  onActivated(() => {
    window.addEventListener('popstate', cleanUp)
    if (!key.value || config.deactivated?.()) {
      key.value = _getKey()
      activeTab.value = 0
      config.active?.()
    }
    config.effect?.()
  })

  onDeactivated(async () => {
    setTimeout(() => {
      window.removeEventListener('popstate', cleanUp)
    })
  })

  return {
    key,
    activeTab
  }
}
