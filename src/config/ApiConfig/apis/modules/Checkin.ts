export default {
  // 执行今日签到并发放奖励
  sign: { method: 'post', url: '/api/sign/sign', showSuccess: true },
  // 签到日历接口（按连续签到循环）
  calendar: { method: 'post', url: '/api/sign/calendar' },
  // 签到记录列表
  records: { method: 'post', url: '/api/sign/records' },
  // 兼容旧路径
  signLogs: { method: 'post', url: '/api/sign/signLogs' }
}
