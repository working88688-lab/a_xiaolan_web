/**
 *
 *  表单验证hooks
 */
import type { CustomRules } from '@types'
import Schema from 'async-validator'

interface ValidatorOption {
  useToastWhenError: boolean
}

export const useValidator = (
  descriptor: CustomRules,
  config: ValidatorOption = {
    useToastWhenError: true
  }
) => {
  const validator = new Schema(descriptor)

  function validate(target: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      validator.validate(target, (errors, fields) => {
        if (errors) {
          const [error] = errors
          if (config.useToastWhenError) {
            const __ = useNuxtApp()
            __.$Toast(error.message)
          }
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }

  return {
    validate
  }
}
