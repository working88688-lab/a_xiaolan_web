import type { TabItem } from '@types'

type IConfig = {
  key?: keyof TabItem
  defaultActive?: number
}
export const useDefaultActiveTab = (config?: IConfig) => {
  const { key = 'current', defaultActive = -1 } = config || {}
  const activeTab = ref(defaultActive)
  const duration = ref(0)

  const updateActiveTab = (tabs: TabItem[]) => {
    const _index = tabs.findIndex(tab => tab[key])
    activeTab.value = _index < 0 ? 0 : _index

    updateDuration()
  }
  const updateDuration = (_duration = 0.3) => {
    nextTick(() => {
      duration.value = _duration
    })
  }
  return {
    activeTab,
    duration,
    updateDuration,
    updateActiveTab
  }
}
