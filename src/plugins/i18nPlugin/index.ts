/**
 * desc: 语言国际化类
 * date: 2023.03.20
 */

import en from './i18n-en.js'
import zh from './i18n-zh.js'

export default defineI18nConfig(() => {
  const language = window.localStorage.getItem('lang') || 'en'
  window.localStorage.setItem('lang', language)

  return {
    legacy: false,
    locale: language,
    messages: {
      zh,
      en
    }
  }
})
