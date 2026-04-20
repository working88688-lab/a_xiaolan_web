export default {
  // 创作中心主页聚合
  center: { method: 'post', url: '/api/creator/center' },
  // 创作者申请验证配置
  verifyConf: { method: 'post', url: '/api/creator/verifyConf' },
  // 申请成为创作者
  apply: { method: 'post', url: '/api/creator/apply', showSuccess: true },
  // 获取创作者申请信息
  applyInfo: { method: 'post', url: '/api/creator/applyInfo' }
}
