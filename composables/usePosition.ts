export const usePosition = (scrollerRef: Ref<HTMLDivElement>) => {
  const scrollTop = ref(0)

  onActivated(async () => {
    await nextTick()

    if (scrollerRef?.value) {
      scrollerRef.value.scrollTop = scrollTop.value
    }
  })
  onBeforeRouteLeave(() => {
    if (scrollerRef?.value) {
      scrollTop.value = scrollerRef.value.scrollTop
    }
  })

  return {
    scrollTop
  }
}
