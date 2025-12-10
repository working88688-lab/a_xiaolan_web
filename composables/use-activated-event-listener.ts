export const useActivatiedEventListener = (el: any, eventName: string, fn: (...args: any[]) => void) => {
  onActivated(() => {
    el.addEventListener(eventName, fn)
  })

  onDeactivated(() => {
    setTimeout(() => {
      el.removeEventListener(eventName, fn)
    })
  })
}
