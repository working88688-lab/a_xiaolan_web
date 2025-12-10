// @ts-nocheck
/**
 * desc: Nuxt准备配置
 * date: 2023.03.20
 */

import type { RouteLocationRaw, Router } from 'vue-router'

export default defineNuxtPlugin(nuxtApp => {
  const _router = nuxtApp.$router as unknown as Router
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@参数初始化配置完成~`)
  return {
    provide: {
      // 初始状态
      NavigateTo: (path: RouteLocationRaw) => {
        _router.push(path)
      },
      Back: () => {
        _router.back()
      },
      Replace: (path: RouteLocationRaw) => {
        _router.replace(path)
      }
    }
  }
})
