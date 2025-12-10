<template>
  <van-form @submit="validate">
    <slot></slot>
  </van-form>
</template>

<script setup lang="ts">
import type { CustomRule, CustomRules } from '@types'
import { FORM_RULES } from '@utils/constants/form'
import Schema from 'async-validator'

const props = withDefaults(
  defineProps<{
    model: Record<string, unknown>
    toastWhenError?: boolean
    scrollToError?: boolean
  }>(),
  {
    toastWhenError: true,
    scrollToError: true
  }
)

const emit = defineEmits<{
  submit: [e?: any]
}>()

const inject_rules: CustomRules = {}
const weakmap = new WeakMap<CustomRule, HTMLElement>()

const add_rule = (key?: string, rule?: CustomRule, el?: HTMLElement) => {
  if (key && rule) {
    inject_rules[key] = rule
    el && weakmap.set(rule, el)
  }
}

const validate = () => {
  return new Promise(resolve => {
    const validator = new Schema(inject_rules)
    validator.validate(props.model, (errors, fields) => {
      if (errors) {
        const [error] = errors
        if (props.toastWhenError) {
          const __ = useNuxtApp()
          __.$Toast(error.message)
        }
        if (props.scrollToError) {
          const [key] = Object.keys(fields)
          weakmap.get(inject_rules[key])?.scrollIntoView?.({
            behavior: 'smooth'
          })
        }
        resolve(false)
      } else {
        emit('submit')
        resolve(true)
      }
    })
  })
}
provide(FORM_RULES, {
  add_rule
})

defineExpose({
  validate
})
</script>
