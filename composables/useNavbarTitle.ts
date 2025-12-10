/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-23 21:47:46
 * @Description: 动态更新顶部导航栏标题
 */

export const useNavbarTitle = (prefix?: string) => {
  const globalStore = useGlobalStore()

  const route = useRoute()
  const setNavbarTitle = (_title?: string) => {
    if (_title) {
      nextTick(() => {
        globalStore.setNavbarTitle(_title)
      })
    }
  }

  const setMetaTitle = () => {
    nextTick(() => {
      globalStore.setNavbarTitle(route.query.title as string)
    })
  }

  const pageTitle = computed(() => {
    return prefix ? `${prefix}${route.query.title}` : (route.query.title as string)
  })
  onBeforeMount(() => {
    nextTick(() => {
      setNavbarTitle(pageTitle.value)
    })
  })

  onActivated(() => {
    nextTick(() => {
      setNavbarTitle(pageTitle.value)
    })
  })

  onDeactivated(() => {
    globalStore.setNavbarTitle()
  })

  onBeforeRouteUpdate(to => {
    setNavbarTitle(to.query.title as string)
  })

  onBeforeUnmount(() => {
    globalStore.setNavbarTitle()
  })

  return {
    setNavbarTitle,
    setMetaTitle,
    pageTitle
  }
}
