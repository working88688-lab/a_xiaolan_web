export function useBuy() {
  const { value: show_buy, open: open_buy } = useBoolean()
  const { value: show_share, open: open_share } = useBoolean()

  const on_buy = (isCoin: boolean) => {
    if (isCoin) {
      open_buy()
    } else {
      open_share()
    }
  }

  return {
    show_buy,
    show_share,
    on_buy
  }
}
