/**
 * desc: 请求拦截器
 * date: 2024.04.2
 */
import md5 from 'md5'
import sha256 from 'sha256'

const generateSign = (timestamp?: number) => {
  const newkey = `id=${timestamp}&position=upload132f1537f85scxpcm59f7e318b9epa51`
  const tmpsha256 = sha256(newkey)
  return md5(tmpsha256)
}
// 请求准备处理
// TODO 此处抽时间再优化处理
// const signKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
export function reqConfig(config) {
  // 加签处理 start
  const timestamp = parseInt((new Date().getTime() / 1000).toString())
  const formdata = new FormData()
  formdata.append('id', timestamp.toString())
  formdata.append('cover', config.data.file)
  formdata.append('position', 'head')
  formdata.append('sign', generateSign(timestamp))
  config.data = formdata
  // 加签处理 end
  return config
}

// 请求错误处理
export function reqError(error) {
  return Promise.reject(error)
}
