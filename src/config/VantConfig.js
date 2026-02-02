/* eslint-disable */
/**
 * desc: 通用组件配置
 * date: 2023.03.20
 */
import '@vant/touch-emulator'
import numeral from 'numeral'
import en from 'vant/es/locale/lang/en-US'
import zh from 'vant/es/locale/lang/zh-CN'

export default defineNuxtPlugin(app => {
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@初始组件UI配置完成~`)

  return {
    provide: {
      MessageClose: () => closeToast(),
      MessageSuccess: options => showSuccessToast(options),
      MessageLoading: options => showLoadingToast(options),
      Alert: options => {
        if (typeof options === 'object') {
          return showDialog({
            title: '温馨提示',
            closeOnClickOverlay: true,
            theme: 'round-button',
            ...options
          })
        } else {
          return showDialog({
            title: '温馨提示',
            theme: 'round-button',
            closeOnClickOverlay: true,
            message: options || ' ',
            confirmButtonText: '确定'
          })
        }
      },
      Confirm: options => {
        if (typeof options === 'object') {
          return showConfirmDialog({
            // 默认
            ...{
              theme: 'round-button',
              message: ' ',
              closeOnClickOverlay: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            },
            // 自定义
            ...options
          })
        } else if (typeof options === 'string') {
          //
        } else {
          //
        }
      },
      Toast: options => {
        const _options =
          typeof options === 'string'
            ? {
              message: options,
              transition: 'van-dialog-bounce'
            }
            : {
              ...options,
              transition: 'van-dialog-bounce'
            }

        showToast(_options)
      },
      Numeral: options => numeral(options),
      vantLang: () => ({
        zh,
        en
      })
    }
  }
})
