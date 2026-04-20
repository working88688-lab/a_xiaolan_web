/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-08-09 15:57:36
 * @Description: 视频上传
 */

import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { createChunk } from './create-chunk'

function generateSignKey(timestamp: string, key: string) {
  return CryptoJS.MD5(`${timestamp}${key}`).toString(CryptoJS.enc.Hex)
}

type UploadInfo = {
  r2Key?: string
  r2URL?: string
  r2CompleteURL?: string
}

async function getUploadInfoBySize(fileSize: number): Promise<UploadInfo | null> {
  const THRESHOLD = 500 * 1024 * 1024
  const url = fileSize < THRESHOLD ? '/api/home/r2upload_info' : '/api/mv/upload'

  try {
    const __ = useNuxtApp()
    const res: any = await __.$Http({
      method: 'POST',
      url,
      data: {},
      showError: false
    })
    const data = res?.data ?? res
    if (!data) return null
    return {
      r2Key: data.r2Key ?? data.r2_key ?? data.key,
      r2URL: data.r2URL ?? data.r2_url ?? data.r2url ?? data.uploadStartUrl,
      r2CompleteURL: data.r2CompleteURL ?? data.r2_complete_url ?? data.r2CompleteUrl ?? data.uploadEndUrl
    }
  } catch {
    return null
  }
}

export default async function upload(file: File, config: AxiosRequestConfig) {
  const { config: global_config } = useGlobalStore()

  const info = await getUploadInfoBySize(file.size)
  const SIGN_KEY = info?.r2Key || global_config.r2Key
  const UPLOAD_START_URL = info?.r2URL || global_config.r2URL
  const UPLOAD_END_URL = info?.r2CompleteURL || global_config.r2CompleteURL

  return new Promise((resolve, reject) => {
    createChunk(file).then(({ total, chunks }) => {
      console.log('total: ', total)
      const formData = new FormData()
      const timestamp = Date.now().toString()
      const sign = generateSignKey(timestamp, SIGN_KEY)
      formData.append('sign', sign)
      formData.append('timestamp', timestamp)
      formData.append('total', total.toString())
      const requestStore = useRequestStore()
      const uploadProcess: number[] = Array.from({ length: total })
      // 为了返回页面 暂停请求队列
      const startController = new AbortController()
      requestStore.addAbort(startController)
      return axios
        .post(UPLOAD_START_URL, formData, {
          signal: startController.signal
        })
        .then(res => {
          if (res.data.code === 200) {
            const data = res.data.data
            const baseUrl = data.uploadUrl.replace('{UploadName}', data.UploadName).replace('{uploadId}', data.uploadId)
            const slice_tag: Array<{ number: number; e_tag: string }> = []

            const requestQueue = data.slices.map((item: any, index: number) => {
              return () => {
                return new Promise((resolve, reject) => {
                  const number = item.number
                  const chunkUrl = baseUrl.replace('{number}', number).replace('{signature}', item.signature)
                  let chunkPercent = 0
                  const controller = new AbortController()
                  requestStore.addAbort(controller)
                  return axios
                    .put(chunkUrl, chunks[index], {
                      headers: { 'Content-Type': 'application/octet-stream' },
                      timeout: 60 * 60 * 1000,
                      signal: controller.signal,
                      onUploadProgress: (e: AxiosProgressEvent) => {
                        chunkPercent = e.loaded / (e?.total ?? 1) / total
                        uploadProcess[index] = chunkPercent
                        const totalProcess = uploadProcess.reduce<number>((acc = 0, cur = 0) => {
                          return acc + cur
                        }, 0)
                        config.onUploadProgress?.(totalProcess as unknown as AxiosProgressEvent)
                      }
                    })
                    .then(response => {
                      slice_tag.push({
                        number,
                        e_tag: response.headers.etag
                      })
                      resolve(true)
                    })
                    .catch(reject)
                })
              }
            })

            const queue = new ConcurrencyQueue(4, requestQueue)

            requestStore.setBigFileUploadQueue(queue)

            queue
              .startTasks()
              .then(() => {
                const formData = new FormData()
                formData.append('sign', sign)
                formData.append('timestamp', timestamp)
                formData.append('upload_name', data.UploadName)
                formData.append('upload_id', data.uploadId)
                formData.append('slice_tag', JSON.stringify(slice_tag))
                const endController = new AbortController()
                requestStore.addAbort(endController)

                axios
                  .post(UPLOAD_END_URL, formData, {
                    signal: endController.signal
                  })
                  .then(res => {
                    resolve(res.data.data.publicUrl)
                  })
                  .catch(reject)
              })
              .catch(reject)
          } else {
            reject(new Error(res.data.msg))
          }
        })
    })
  })
}
