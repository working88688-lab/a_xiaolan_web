/**
 * desc: 本地通用工具类
 * date: 2023.03.20
 */
import * as utils from '@utils'

export default defineNuxtPlugin(({ vueApp: app, provide }) => {
  // 绑定content上下文
  // provide('Utils', utils)

  // 绑定vue实例
  // app.config.globalProperties.$Utils = utils;

  return {
    provide: {
      Utils: utils
    }
  }
})
