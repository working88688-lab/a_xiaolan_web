import type { RuleItem } from 'async-validator'

export type CustomRuleItem = RuleItem & {
  el?: Ref<HTMLDivElement>
}

export type CustomRule = CustomRuleItem | CustomRuleItem[]

export type CustomRules = Record<string, CustomRule>
