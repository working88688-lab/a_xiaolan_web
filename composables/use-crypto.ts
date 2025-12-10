export function useCrypto() {
  const { $GlobalObject, $fetch_from_worker } = useNuxtApp()

  const isDecrypting = ref(true)
  const cryptoImage = (url?: string, responseType = 'url'): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (url) {
        // 缓存取图
        const CACHE_IMG = $GlobalObject._CACHE_IMAGES_MAPS?.[url]
        isDecrypting.value = true
        if (CACHE_IMG) {
          const { status } = CACHE_IMG
          if (status === 1) {
            // @ts-ignore
            return resolve(CACHE_IMG.url)
          } else if (status === 2) {
            return reject(new Error(`图片获取失败:${url}`))
          } else {
            CACHE_IMG.pending.push(resolve)
          }
        } else {
          // @ts-ignore
          $GlobalObject._CACHE_IMAGES_MAPS[url] = {
            pending: []
          }
        }

        setTimeout(() => {
          // @ts-ignore
          if ($GlobalObject._CACHE_IMAGES_MAPS[url].status >= 0) {
            return
          }
          $GlobalObject._CACHE_IMAGES_MAPS[url].status = 0

          $fetch_from_worker<string>(url, { responseType })
            // 4. 监听事件
            .then(base64Image => {
              if (responseType === 'base64') {
                const image_type = url.split('.').pop()

                return resolve(`data:image/${image_type};base64,${base64Image}`)
              }

              const localImage = base64Image

              $GlobalObject._CACHE_IMAGES_MAPS[url] = {
                ...$GlobalObject._CACHE_IMAGES_MAPS[url],
                status: 1,
                url: localImage
              }

              $GlobalObject._CACHE_IMAGES_MAPS[url].pending.forEach(callback => {
                callback(localImage)
              })
              Reflect.deleteProperty($GlobalObject._CACHE_IMAGES_MAPS[url], 'pending')
              // 图片加载
              resolve(localImage)
            })

            // 5. 异常处理
            .catch(err => {
              resolve('')
              $GlobalObject._CACHE_IMAGES_MAPS[url].status = 2
              Reflect.deleteProperty($GlobalObject._CACHE_IMAGES_MAPS[url], 'pending')
              console.error('图片获取失败:', err)
            })
            .finally(() => {
              isDecrypting.value = false
            })
        }, 0)
      } else {
        resolve('')
      }
    })
  }

  const cryptoText = (url: string): Promise<string> => {
    return new Promise(resolve => {
      isDecrypting.value = true
      $fetch_from_worker(url, { type: 'text' })
        .then(result => {
          resolve(result as string)
        })
        .catch(_e => {
          resolve('')
          Reflect.deleteProperty($GlobalObject._IMAGE_DECRY_SCHEDULER, url)
        })
        .finally(() => {
          isDecrypting.value = false
        })
    })
  }
  return {
    cryptoImage,
    cryptoText,
    isDecrypting
  }
}
