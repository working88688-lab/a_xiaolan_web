/**
 * desc: 内置加解密
 * date: 2023.03.20
 */

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('Encrypt', (str: string, offset = 3) =>
    Array.from(str)
      .map(char => String.fromCharCode(char.charCodeAt(0) + offset))
      .join('')
  )
  nuxtApp.provide('Decrypt', (str: string, offset = 3) =>
    Array.from(str)
      .map(char => String.fromCharCode(char.charCodeAt(0) - offset))
      .join('')
  )

  console.log(`【${process.client ? 'CSR' : 'SSR'}】@内置加解密加载完成~`)
})
