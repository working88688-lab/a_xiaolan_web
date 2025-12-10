import type { CustomRule } from '@types'
import type { InjectionKey } from 'vue'

export const FORM_RULES = Symbol('FORM_RULES') as InjectionKey<{
  add_rule: (key?: string, rule?: CustomRule, el?: HTMLElement) => void
}>
