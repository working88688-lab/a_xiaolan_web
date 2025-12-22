export function timeToMilliseconds(timeString: string) {
  // 将时间字符串拆分为小时、分钟、秒
  const [hours, minutes, seconds] = timeString.split(':').map(Number)

  // 计算总毫秒数
  const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000

  return totalMilliseconds
}

export function millisecondsToTime(milliseconds: number) {
  // 将毫秒数转换为秒
  let seconds = Math.floor(milliseconds / 1000)

  // 计算小时、分钟和秒
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  // 格式化成 HH:mm:ss 格式
  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':')

  return formattedTime
}
