export const useSyncCacheData = (syncHandler: (...args: any[]) => Promise<void> | void) => {
  const __ = useNuxtApp()

  onMounted(() => {
    __.$Emitter.on('cache', syncHandler)
  })

  onBeforeUnmount(() => {
    __.$Emitter.off('cache', syncHandler)
  })
}
