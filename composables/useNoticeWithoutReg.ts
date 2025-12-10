export const useNoticeWithoutReg = () => {
  const __ = useNuxtApp()
  const { u: user } = useUserStore()

  onMounted(() => {
    if (!user?.is_reg) {
      __.$Alert({
        title: '温馨提示',
        closeOnClickOverlay: true,
        confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)',
        message: () =>
          h('div', { style: { margin: '0 .4rem' } }, '请先注册登录后再充值，避免因账号丢失，导致会员或钻石无法找回')
      })
    }
  })
}
