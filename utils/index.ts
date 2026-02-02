import type { Local } from '@types'
// 数字格式化成 千 万
export const formatNumber = (num: number | string, local?: Local) => {
  if (!num) {
    return '0'
  }
  num = Number(num)

  num = Number.isNaN(num) ? 0 : num
  local = local || 'en'
  const unitMap = {
    'zh-cn': formatNumberWithUnit,
    en: formatNumberWithUnit
  }
  return unitMap[local](num)
}

function formatNumberWithChineseUnit(number: number) {
  if (number < 0) {
    return 0
  }
  // 定义中文单位和对应的数字范围
  const units = ['', '千', '万', '百万', '亿', '兆']
  const unitThresholds = [1, 10, 100, 1000, 10000, 100000000]

  // 初始化单位索引和初始值
  let unitIndex = 0
  let formattedNumber = number

  // 循环直到找到合适的单位
  while (formattedNumber >= unitThresholds[unitIndex + 1] && unitIndex < units.length - 1) {
    formattedNumber /= unitThresholds[unitIndex + 1]
    unitIndex++
  }

  // 保留一位小数，并且去掉多余的0
  formattedNumber = parseFloat(formattedNumber.toFixed(1))

  // 返回带单位的格式化数字
  return `${formattedNumber}${units[unitIndex]}`
}

function toFixedFloor(num: number, digits: number) {
  const factor = Math.pow(10, digits)
  return (Math.floor(num * factor) / factor).toFixed(digits)
}
function formatNumberWithUnit(number: number) {
  if (number < 0) {
    return 0
  }
  let formattedNumber = number + ''
  if (number >= 10000) {
    formattedNumber = toFixedFloor(number / 10000, 1) + 'W'
  }

  return formattedNumber
}

export const getYearMonthDay = (str, lang, time) => {
  const dateObject = new Date(str)
  //lang定义
  // 'en-US': 英语（美国）
  // 'es-ES': 西班牙语（西班牙）
  // 'fr-FR': 法语（法国）
  // 'de-DE': 德语（德国）
  // 'ja-JP': 日语（日本）
  // 'ko-KR': 韩语（韩国）
  // 'ru-RU': 俄语（俄罗斯）
  // 配置日期格式选项
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  if (time) {
    dateOptions.hour = 'numeric'
    dateOptions.minute = 'numeric'
    dateOptions.second = 'numeric'
  }
  const formattedDate = dateObject.toLocaleString(lang, { ...dateOptions })
  return formattedDate
}

// 如 60 转 00:01:00
export const toVideoTime = (seconds: number) => {
  seconds = seconds || 0
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  const _toTime = (_n: number) => {
    return _n < 10 ? `0${_n}` : _n
  }
  const _res = hours > 0 ? [hours, minutes, remainingSeconds] : [minutes, remainingSeconds]
  return _res.map(_toTime).join(':')
}

// 打开广告
export const onOpenAdv = (e, __) => {
  const { url, type, id, to_type } = e
  __.$Api.Video.adclick({ id: id }).finally(() => {
    switch (to_type) {
      case 1:
        window.open(url, '_blank')
        break

      case 2:
        __.$NavigateTo(`${url}`)
        break

      default:
        window.open(url, '_blank')
        break
    }
  })
}

export const onWinOpen = (url?: string, target = '_blank') => {
  url && window.open(url, target)
}

export const setDocTitle = (title?: string) => {
  if (title) {
    document.title = title
  }
}

export function formatDate(date: Date, fmt?: string) {
  if (typeof date == 'string') {
    return date
  }

  if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss'

  if (!date || date == null) return ''
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  }
  return fmt
}

export function timeStringToNumber(timeString: string) {
  // 从时间格式字符串中提取小时、分钟和秒
  const timeArray = timeString.split(':')
  const hours = parseInt(timeArray[0])
  const minutes = parseInt(timeArray[1])
  const seconds = parseInt(timeArray[2])

  // 将时、分、秒转换为字符串并拼接
  const timeNumericString =
    hours.toString().padStart(2, '0') + minutes.toString().padStart(2, '0') + seconds.toString().padStart(2, '0')

  // 将拼接后的字符串转换为数字并返回
  return parseInt(timeNumericString)
}
