import { createDecryWorker } from '@utils/helper'

export default defineNuxtPlugin(() => {
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@worker初始化完成~`)
  const worker = process.client ? createDecryWorker() : null
  const { $GlobalObject } = useNuxtApp()
  const fetch_from_worker = <T>(src: string, options?: { type?: string; responseType?: string }): Promise<T> => {
    return new Promise((resolve, reject) => {
      $GlobalObject._IMAGE_DECRY_SCHEDULER[src] = {
        // @ts-ignore
        resolve,
        reject
      }
      // @ts-ignore
      worker.postMessage({
        data: src,
        key: src,
        type: 'image',
        responseType: 'url',
        ...(options || {})
      })
    })
  }
  if (worker) {
    worker.addEventListener('message', e => {
      const { result, key, error } = e.data
      // @ts-ignore
      const { resolve, reject } = $GlobalObject._IMAGE_DECRY_SCHEDULER[key]
      if (resolve) {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
        Reflect.deleteProperty($GlobalObject._IMAGE_DECRY_SCHEDULER, key)
      }
    })
  }
  return {
    provide: {
      Worker: worker,
      fetch_from_worker
    }
  }
})
