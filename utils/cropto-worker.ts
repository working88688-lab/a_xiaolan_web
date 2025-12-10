// @ts-nocheck

// 图片、视频、小说解密单独开web worker, 可以并行处理
import { read_file_as_type } from '@utils/blob-helper'
// import { decode, encode } from '@jsquash/jpeg'
import CryptoJS from 'crypto-js'

import utf8 from 'utf8'

const cryptodata = {
  mode: 'CBC',
  media_key: '102_53_100_57_54_53_100_102_55_53_51_51_54_50_55_48',
  media_iv: '57_55_98_54_48_51_57_52_97_98_99_50_102_98_101_49'
}

function cc(e, o = true) {
  return o
    ? CryptoJS.enc.Utf8.parse(
      e
        .split('_')
        .map(a => String.fromCharCode(Number.parseInt(a)))
        .join('')
    )
    : e
      .split('_')
      .map(a => String.fromCharCode(Number.parseInt(a)))
      .join('')
}

// 图片解密
function Decrypt_base64(word) {
  const decrypt = CryptoJS.AES.decrypt(word, cc(cryptodata.media_key), {
    iv: cc(cryptodata.media_iv),
    mode: CryptoJS.mode[cryptodata.mode],
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Base64)
  return decryptedStr
}

// 文本解密
function DecryptText(buffer) {
  try {
    const base64Data = new TextDecoder('utf-8').decode(new Uint8Array(buffer))

    const decrypted = CryptoJS.AES.decrypt(base64Data, cc(cryptodata.media_key), {
      iv: cc(cryptodata.media_iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.log('error: ', error)
    return ''
  }
}
const MEME_TYPE_FIX = {
  jpg: 'jpeg'
}
function DecryptImage2Blob(encrybase64Image, imgtype) {
  const base64Image = Decrypt_base64(encrybase64Image)
  const byteImage = new Uint8Array(
    atob(base64Image)
      .split('')
      .map(c => c.charCodeAt(0))
  )
  return new Blob([byteImage], { type: `image/${MEME_TYPE_FIX[imgtype] || imgtype}` })
}

function base_fetch(resource_src, responseType = 'blob', fetch_config = {}) {
  const request = new Request(resource_src)
  return fetch(request, {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    ...fetch_config
  }).then(res => res[responseType]())
}
function fetch_text(resource_src, config = {}) {
  return new Promise((resolve, reject) => {
    base_fetch(resource_src, 'arrayBuffer')
      .then(buffer => {
        if (buffer.byteLength === 0) {
          return reject(new Error(`${resource_src}: 远程资源为空`))
        }
        resolve(DecryptText(buffer))
      })
      .catch(e => {
        reject(new Error(`${resource_src}: 加载失败`))
      })
  })
}
// async function paddingColorSpace(file: File) {
//   const buffer = await file.arrayBuffer()
//   const imageData = await decode(buffer)

//   const _buffer = await encode(imageData)

//   return new Blob([_buffer], { type: 'image/jpeg' })
// }
async function fetch_image(resource_src, config = {}) {
  try {
    const blob = await base_fetch(resource_src)

    if (blob.size === 0) {
      return Promise.reject(new Error(`${resource_src}: 远程图片资源为空`))
    }
    const result = await read_file_as_type(blob, 'readAsDataURL')
    const { responseType = 'url' } = config || {}

    const ext = resource_src.split('.').pop()

    const file = DecryptImage2Blob(result.split(',').pop(), ext)
    // const needFix = resource_src.endsWith('jpg') || resource_src.endsWith('jpeg')
    // if (needFix) {
    //   file = await paddingColorSpace(file)
    // }
    if (responseType === 'blob') {
      return file
    } else {
      return URL.createObjectURL(file)
    }
  } catch (error) {
    console.log('error: ', error)
    return Promise.reject(new Error(`${resource_src}: 加载失败`))
  }
}
self.onmessage = function (e) {
  const { type, data, key, responseType, ...rest } = e.data
  if (type === 'image') {
    return fetch_image(data, { responseType })
      .then(result => {
        self.postMessage({
          result,
          key
        })
      })
      .catch(error => {
        self.postMessage({
          error,
          key
        })
      })
  }
  if (type === 'text') {
    return fetch_text(data)
      .then(result => {
        self.postMessage({
          result,
          key
        })
      })
      .catch(error => {
        self.postMessage({
          error,
          key
        })
      })
  }
  self.postMessage({
    ...e.data,
    key
  })
}
