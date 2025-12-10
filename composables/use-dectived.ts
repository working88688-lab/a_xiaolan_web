export const useDectivted = (callback: (...args: any[]) => void) => {
  onDeactivated(() => {
    callback()
  })
}
