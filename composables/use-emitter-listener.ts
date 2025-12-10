/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-10-10 14:01:04
 * @Description:  Use EventListener with ease. Register using emitter.on on mounted,  emitter.off automatically on unmounted.
 */

import type { Events, EventType } from '@types'

interface Option {
  activated?: boolean // 是否在onActivated 生命周期注册监听，否则在onMounted
  once?: boolean // 只执行一次
}
export function useEmitterListener<T extends EventType>(
  eventType: T,
  listener: (...args: Array<Events[T]>) => void,
  options: Option = {
    activated: false,
    once: false
  }
) {
  const __ = useNuxtApp()
  const _listener = options.activated ? onActivated : onMounted
  const _removeListener = options.activated ? onDeactivated : onBeforeUnmount

  const handler = options?.once
    ? (...args: any[]) => {
      listener(...args)

      __.$Emitter.off(eventType, handler)
    }
    : listener

  _listener(() => {
    __.$Emitter.on(eventType, handler)
  })

  _removeListener(() => {
    __.$Emitter.off(eventType, handler)
  })
}

export function useListener<T extends EventType>(eventName: T, fn: (...args: any[]) => void) {
  const __ = useNuxtApp()
  let is_register = false
  const _handler = () => {
    is_register = false
    __.$Emitter.off(eventName, fn)
  }
  onActivated(() => {
    window.addEventListener('popstate', _handler)
  })

  onDeactivated(() => {
    setTimeout(() => {
      window.removeEventListener('popstate', _handler)
    })
  })

  onActivated(() => {
    if (!is_register) {
      is_register = true
      __.$Emitter.on(eventName, fn)
    }
  })
}
