export const useBoolean = (booleanValue = false) => {
  const value = ref(booleanValue)
  const toTrue = () => {
    value.value = true
  }
  const toFalse = () => {
    value.value = false
  }
  const toggle = () => {
    value.value = !value.value
  }
  return {
    value,
    toTrue,
    toFalse,
    toggle,
    open: toTrue,
    close: toFalse
  }
}
