// @ts-nocheck

import CryptoJS from 'crypto-js'
import md5 from 'md5'
import sha256 from 'sha256'

const key = CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
  String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
][`${String.fromCharCode(112)}arse`](
  '99_99_56_56_100_100_99_57_51_53_55_102_102_52_54_49_101_48_56_102_48_52_55_97_101_100_101_101_54_57_50_98'
    .split('_')
    .map(a => String.fromCharCode(parseInt(a)))
    .join('')
)
const iv = CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
  String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
][`${String.fromCharCode(112)}arse`](
  '101_56_57_50_50_53_99_102_98_98_105_109_103_107_99_117'
    .split('_')
    .map(a => String.fromCharCode(parseInt(a)))
    .join('')
)

const appkey =
  '99_99_56_56_100_100_99_57_51_53_55_102_102_52_54_49_101_48_56_102_48_52_55_97_101_100_101_101_54_57_50_98'
    .split('_')
    .map(a => String.fromCharCode(parseInt(a)))
    .join('')

//
const cc = (e, o = true) =>
  o
    ? CryptoJS.enc.Utf8.parse(
        e
          .split('_')
          .map(a => String.fromCharCode(parseInt(a)))
          .join('')
      )
    : e
        .split('_')
        .map(a => String.fromCharCode(parseInt(a)))
        .join('')

// 报文加密
function Encrypt(word) {
  const srcs =
    CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
      String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
    ][`${String.fromCharCode(112)}arse`](word)
  const encrypted = CryptoJS[String.fromCharCode(65) + String.fromCharCode(69) + String.fromCharCode(83)][
    '101_110_99_114_121_112_116'
      .split('_')
      .map(a => String.fromCharCode(parseInt(a)))
      .join('')
  ](srcs, key, {
    iv,
    mode: CryptoJS[
      '109_111_100_101'
        .split('_')
        .map(a => String.fromCharCode(parseInt(a)))
        .join('')
    ][String.fromCharCode(67) + String.fromCharCode(70) + String.fromCharCode(66)],
    padding: CryptoJS[`${String.fromCharCode(112)}ad`][`${String.fromCharCode(78)}o${String.fromCharCode(80)}adding`]
  })
  const data = encrypted[
    '99_105_112_104_101_114_116_101_120_116'
      .split('_')
      .map(a => String.fromCharCode(parseInt(a)))
      .join('')
  ]
    .toString()
    [
      '116_111_85_112_112_101_114_67_97_115_101'
        .split('_')
        .map(a => String.fromCharCode(parseInt(a)))
        .join('')
    ]()
  const unix_t = new Date().getTime() / 1000
  const timestamp = parseInt(unix_t.toString())
  const sign = getSign({ client: 'pwa', data, timestamp })

  return SeralizeOrdered({ client: 'pwa', sign, timestamp, data })
}

// 报文解密
function Decrypt(word) {
  const encryptedHexStr =
    CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
      '72_101_120'
        .split('_')
        .map(a => String.fromCharCode(parseInt(a)))
        .join('')
    ][`${String.fromCharCode(112)}arse`](word)
  const srcs =
    CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
      '66_97_115_101_54_52'
        .split('_')
        .map(a => String.fromCharCode(parseInt(a)))
        .join('')
    ].stringify(encryptedHexStr)
  const decrypt = CryptoJS[String.fromCharCode(65) + String.fromCharCode(69) + String.fromCharCode(83)][
    '100_101_99_114_121_112_116'
      .split('_')
      .map(a => String.fromCharCode(parseInt(a)))
      .join('')
  ](srcs, key, {
    iv,
    mode: CryptoJS[
      '109_111_100_101'
        .split('_')
        .map(a => String.fromCharCode(parseInt(a)))
        .join('')
    ][String.fromCharCode(67) + String.fromCharCode(70) + String.fromCharCode(66)],
    padding: CryptoJS[`${String.fromCharCode(112)}ad`][`${String.fromCharCode(78)}o${String.fromCharCode(80)}adding`]
  })
  const decryptedStr = decrypt.toString(
    CryptoJS[String.fromCharCode(101) + String.fromCharCode(110) + String.fromCharCode(99)][
      String.fromCharCode(85) + String.fromCharCode(116) + String.fromCharCode(102) + String.fromCharCode(56)
    ]
  )
  return JSON[`${String.fromCharCode(112)}arse`](decryptedStr.toString())
}

//签名算法
function getSign(obj) {
  const keyValues = []
  if (typeof obj.data !== 'undefined') {
    keyValues.push(`client=${obj.client}`)
  }
  if (typeof obj.data !== 'undefined') {
    keyValues.push(`data=${obj.data}`)
  }
  if (typeof obj.errcode !== 'undefined') {
    keyValues.push(`errcode=${obj.errcode}`)
  }
  if (typeof obj.timestamp !== 'undefined') {
    keyValues.push(`timestamp=${obj.timestamp}`)
  }
  const text = keyValues.join('&') + appkey
  const sha256Text = sha256(text)
  const md5Text = md5(sha256Text)
  return md5Text
}

function SeralizeOrdered(params, splitStr = '&') {
  let client
  let timestamp
  let data
  let sign
  for (const i in params) {
    const key = i
    const value = params[i]
    if (i === 'timestamp') {
      timestamp = `${key}=${value}`
    } else if (i === 'data') {
      data = `${key}=${value}`
    } else if (i === 'sign') {
      sign = `${key}=${value}`
    } else {
      client = `${key}=${value}`
    }
  }
  return client + splitStr + timestamp + splitStr + data + splitStr + sign
}

export default defineNuxtPlugin(nuxtApp => {
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@报文加解密加载完成~`)

  return {
    provide: {
      CryptoData: {
        Decrypt,
        Encrypt
      }
    }
  }
})
