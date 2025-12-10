/**
 * desc: 图片压缩工具类
 * date: 2024.04.24
 * refer: https://juejin.cn/post/6854573215910789128
 */

export default defineNuxtPlugin(nuxtApp => {
  const _this = nuxtApp
  const { $GlobalObject, $Worker } = _this

  console.log(`【${process.client ? 'CSR' : 'SSR'}】@初始图片加解密完成~`)
  const fetch_resouce_from_worker = (src, imgtype, response_type) => {
    return new Promise((resolve, reject) => {
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src] = {}
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src].resolve = resolve
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src].reject = reject
      $Worker.postMessage({
        type: 'image',
        data: src,
        key: src,
        imgtype: imgtype,
        response_type
      })
    })
  }
  return {
    provide: {
      ImageDecryption: ({ imgurl = '', responseType = 'url' }) => {
        return new Promise((resolve, reject) => {
          if (imgurl) {
            // 缓存取图
            const CACHE_IMG = $GlobalObject['_CACHE_IMAGES_MAPS']?.[imgurl]

            if (CACHE_IMG) {
              const { status } = CACHE_IMG
              if (status === 1) {
                return resolve(CACHE_IMG.url)
              } else if (status === 2) {
                return reject(`图片获取失败:${imgurl}`)
              } else {
                CACHE_IMG.pending.push(resolve)
              }
            } else {
              $GlobalObject['_CACHE_IMAGES_MAPS'][imgurl] = {
                pending: []
              }
            }

            const imgtype = imgurl.split('.').pop()
            // 1. 获取图片(二进制)

            setTimeout(() => {
              if ($GlobalObject['_CACHE_IMAGES_MAPS'][imgurl].status >= 0) {
                return
              }
              $GlobalObject['_CACHE_IMAGES_MAPS'][imgurl].status = 0

              fetch_resouce_from_worker(imgurl, imgtype, responseType)
                // 4. 监听事件
                .then(base64Image => {
                  if (responseType === 'base64') {
                    return resolve(`data:image/${imgtype};base64,${base64Image}`)
                  }

                  const localImage = base64Image

                  $GlobalObject['_CACHE_IMAGES_MAPS'][imgurl] = {
                    ...$GlobalObject['_CACHE_IMAGES_MAPS'][imgurl],
                    status: 1,
                    url: localImage
                  }
                  // const image = `${localImage}#.${imgtype}`
                  $GlobalObject['_CACHE_IMAGES_MAPS'][imgurl].pending.forEach(callback => {
                    callback(localImage)
                  })
                  Reflect.deleteProperty($GlobalObject['_CACHE_IMAGES_MAPS'][imgurl], 'pending')
                  // 图片加载
                  resolve(localImage)
                })

                // 5. 异常处理
                .catch(err => {
                  reject(err)
                  $GlobalObject['_CACHE_IMAGES_MAPS'][imgurl].status = 2
                  Reflect.deleteProperty($GlobalObject._IMAGE_DECRY_SCHEDULER, imgurl)
                  Reflect.deleteProperty($GlobalObject['_CACHE_IMAGES_MAPS'][imgurl], 'pending')
                  console.error('图片获取失败:', err)
                })
            }, 0)
          } else {
            resolve('')
          }
        })
      }
    }
  }
})
