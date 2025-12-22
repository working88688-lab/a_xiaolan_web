/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-07-06 15:45:47
 * @Description:  获取视频帧
 */

export const captureFrame = async (video_url: string, frames: number[]) => {
  const create_video = (time: number): Promise<HTMLVideoElement> => {
    return new Promise(resolve => {
      const video = document.createElement('video')
      video.src = video_url
      video.currentTime = time
      video.muted = true
      video.crossOrigin = 'anonymous'
      video.autoplay = true
      video.playsInline = true
      video.load()
      video.oncanplay = () => {
        video.play()
      }
      video.onplay = () => {
        resolve(video)
      }
    })
  }

  const create_cavans = (time: number): Promise<{ url: string; blob: Blob | null }> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      create_video(time).then(video => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        // setTimeout(() => {
        ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        canvas.toBlob(blob => {
          resolve({
            blob,
            url: blob ? URL.createObjectURL(blob) : ''
          })
        })
        // }, 100)
      })
    })
  }

  const frames_queque = []
  const len = frames.length
  for (let i = 0; i < len; i++) {
    frames_queque.push(create_cavans(frames[i]))
  }

  const res_frames = await Promise.all(frames_queque)

  return res_frames
}
