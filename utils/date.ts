export function millisecondsToTime(milliseconds: number) {
  // 将毫秒数转换为秒
  let seconds = Math.floor(milliseconds / 1000)

  // 计算天、小时、分钟和秒
  const days = Math.floor(seconds / 86400) // 1天 = 24 * 60 * 60
  seconds %= 86400

  const hours = Math.floor(seconds / 3600)
  seconds %= 3600

  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  // 格式化成 D天 HH:mm:ss（天数不补0，可按需改）
  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ]
  if (days > 0) {
    formattedTime.unshift(`${days}天`)
  }

  return formattedTime.join(':')
}
