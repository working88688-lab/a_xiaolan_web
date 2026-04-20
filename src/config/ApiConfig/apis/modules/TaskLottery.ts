export default {
  // 抽奖首页（含 my_chances、items 奖品列表）
  info: { method: 'post', url: '/api/tasklottery/info' },
  // 机会抽奖
  drawByChance: { method: 'post', url: '/api/tasklottery/drawByChance' },
  // 积分抽奖
  drawByPoints: { method: 'post', url: '/api/tasklottery/drawByPoints' },
  // 抽奖记录
  logs: { method: 'post', url: '/api/tasklottery/logs' }
}
