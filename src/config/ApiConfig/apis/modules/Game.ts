export default {
  // 游戏首页
  index: { method: 'post', url: '/api/game/index' },
  // 游戏抽奖配置
  drawConf: { method: 'post', url: '/api/game/drawConf' },
  // 游戏抽奖
  draw: { method: 'post', url: '/api/game/draw' },
  // 游戏抽奖记录
  drawRecords: { method: 'post', url: '/api/game/drawRecords' },
  // 兼容旧路径
  drawList: { method: 'post', url: '/api/game/drawList' },
  // 游戏产品列表
  products: { method: 'post', url: '/api/game/products' },
  // 游戏支付
  pay: { method: 'post', url: '/api/game/pay' },
  // 游戏订单列表
  orders: { method: 'post', url: '/api/game/orders' },
  // 游戏转账
  transfer: { method: 'post', url: '/api/game/transfer' },
  // 游戏转账信息
  transferInfo: { method: 'post', url: '/api/game/transferInfo' },
  // 进入游戏
  enter: { method: 'post', url: '/api/game/enter' }
}
