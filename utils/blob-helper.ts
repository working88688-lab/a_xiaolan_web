import Compressor from 'compressorjs'

/**
 * @description: 图片压缩
 * @param {File} file
 * @return {Promise<File>}
 */
export function image_compressor(file: File | Blob): Promise<File | Blob> {
  return new Promise((resolve, reject) => {
    /* eslint no-new: "off" */
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        resolve(result)
      },
      error: reject
    })
  })
}

type ReadableType = 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsText'
type ReaderResult<T extends ReadableType> = T extends 'readAsArrayBuffer' ? ArrayBuffer : string
/**
 * @description: file_reader
 * @param {File} file
 * @param {type} ReadableType
 * @return {*}
 */
export function read_file_as_type<T extends ReadableType>(file: File | Blob, type: T): Promise<ReaderResult<T> | null> {
  return new Promise((resolve, reject) => {
    const file_reader = new FileReader()
    file_reader[type](file)

    file_reader.onload = () => {
      // @ts-ignore
      resolve(file_reader.result)
    }

    file_reader.onerror = reject
  })
}
type TransformType = 'blob' | 'base64'
export function image_source_to_type<T extends TransformType>(
  src: string,
  type: T
): Promise<(T extends 'blob' ? Blob : string) | null> {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img')
    image.src = src
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(image, 0, 0, image.width, image.height)

      if (type === 'blob') {
        canvas.toBlob(blob => {
          // @ts-ignore
          resolve(blob)
        })
      } else {
        // @ts-ignore
        resolve(canvas.toDataURL())
      }
    }
    image.onerror = reject
  })
}

export function get_image_size(_img: File | Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(_img)
    const img = new Image()
    img.src = url
    img.onload = function () {
      if (import.meta.dev) {
        console.log(`宽度: ${img.naturalWidth}, 高度: ${img.naturalHeight}`)
      }

      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
      URL.revokeObjectURL(url)
    }

    img.onerror = e => {
      URL.revokeObjectURL(url)
      reject(e)
    }
  })
}

export function download_image(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
