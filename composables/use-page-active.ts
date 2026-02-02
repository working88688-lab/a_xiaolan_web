export function usePageActive() {
  const isPageActive = ref(false)
  onActivated(() => {
    isPageActive.value = true
  })
  onDeactivated(() => {
    isPageActive.value = false
  })

  return {
    isPageActive,
  }
}
