import Compressor from 'compressorjs'
/**
 * desc: 图片压缩工具类
 * date: 2023.03.20
 * refer: https://juejin.cn/post/6854573215910789128
 */
class ImageCompression {
  static compressor(
    file: File,
    config?: {
      type: 'blob' | 'base64'
    }
  ): File | any {
    return new Promise((resolve, reject) => {
      const { type } = config || {}
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1000,
        maxHeight: 1000,
        success(result) {
          if (result?.size / 1024 > 1024) {
            reject('图片压缩后大小仍超出限制，请上传1M以下的图片')
          } else {
            if (type === 'base64') {
              const imgFile = new FileReader()
              imgFile.readAsDataURL(result)
              imgFile.onload = () => {
                resolve(imgFile.result)
              }
            } else {
              resolve(result)
            }
          }
        },
        error: reject
      })
    })
  }
}

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      ImageCompression: ImageCompression
    }
  }
})
