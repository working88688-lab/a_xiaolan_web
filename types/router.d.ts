/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-21 10:59:33
 * @Description: redefined vue-router metadata type
 */
import type { CSSProperties } from 'vue'
import 'vue-router'

export { }

declare module 'vue-router' {
  interface RouteMeta {
    theme?: {
      // 主题， 可以使用css 变量
      page?: CSSProperties // 页面主题
    }
    requiresAuth?: boolean // 页面是否需要登录
    top?: boolean // 是否显示顶部 topbar
    bottom?: boolean // 是否显示底部  bootombar
    trackPageName?: string
    trackPageKey?: string
    nav?: {
      rightTitle?: string
      to: string
      icon?: string
      backgroundColor?: string
    }
  }
}
