type IConfig = {
  defaultActive?: number
  name?: string
  mode?: 0 | 1
}

export const useUrlTab = (config?: IConfig) => {
  const { defaultActive = 0, name = '_index', mode = 1 } = config || {}
  const __ = useNuxtApp()
  const activeTab = ref<number>(defaultActive)
  const route = useRoute()
  const duration = ref(0)

  const cacheKey = `${route.name as string}${name}`
  const initTab = () => {
    const defaultIndex = (route.query[name] as unknown as string) || sessionStorage.getItem(cacheKey)
    if (defaultIndex) {
      activeTab.value = mode ? Number(defaultIndex) : defaultIndex
      __.$Replace({
        path: route.path,
        query: {
          ...route.query,
          [name]: defaultIndex
        }
      })
    }
  }
  watch(
    () => activeTab.value,
    newActiveTab => {
      __.$Replace({
        path: route.path,
        query: {
          ...route.query,
          [name]: newActiveTab
        }
      })
      sessionStorage.setItem(cacheKey, newActiveTab)
    }
  )

  onBeforeMount(() => {
    initTab()
  })

  return {
    duration,
    activeTab
  }
}
