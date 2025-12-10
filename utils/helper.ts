/*
 * @Author: li jin dexing.2723@gmail.com
 * @Date: 2025-05-09 15:53:57
 * @LastEditors: li jin dexing.2723@gmail.com
 * @LastEditTime: 2025-05-19 20:12:07
 * @FilePath: /xl_web/utils/helper.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { NAVIGATION_MAP } from '@utils/constants/navigation'

export function createDecryWorker() {
  const worker = new Worker(new URL('../utils/cropto-worker', import.meta.url), {
    type: 'module'
  })

  return worker
}

export const _sleep = (time = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

/**
 * @description:  手机屏幕是否横竖屏状态
 * @param {*}
 * @return {boolean}
 */
export const is_screen_orientation_portrait = () => {
  if (screen.orientation.type) {
    return screen.orientation.type.includes('portrait')
  }
  return window.orientation === 90 || window.orientation === -90
}

export const record_to_querystring = (obj: Record<string, any>) =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&')

export function format_url_params(_params?: Record<string, any>) {
  if (_params) {
    const url_params = new URLSearchParams()

    Object.keys(_params).forEach(key => {
      url_params.append(key, _params[key])
    })

    return url_params.toString()
  }

  return ''
}

export const navigate = (index: keyof typeof NAVIGATION_MAP, fallback?: string) => {
  return NAVIGATION_MAP[index] || fallback
}

export function isPWA() {
  return (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches
}

export function getUrlParams(key: string) {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  const search_string = url.search || currentUrl.split('?')[1]
  const searchParams = new URLSearchParams(search_string)
  const _p = searchParams.get(key)
  return _p
}

export function get_display_style(show_style: number, default_style = '') {
  let style_class = default_style
  switch (show_style) {
    case 0:
      style_class = 'dx-grid-1'
      break
    case 1:
      style_class = 'dx-grid-2'
      break
    case 2:
      style_class = 'dx-grid-3'
      break

    default:
      break
  }

  return style_class
}

export function sortTopItem<T extends [any, any, any]>(arr: Array<T>) {
  if (arr.length === 0) {
    return []
  }

  if (arr.length === 1) {
    return arr
  }

  const [item1, item2, item3] = toRaw(arr)
  if (arr.length == 2) {
    return [item2, item1]
  }
  return [item2, item1, item3]
}
