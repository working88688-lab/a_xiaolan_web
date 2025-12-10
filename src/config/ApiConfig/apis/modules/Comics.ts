export default {
  // 漫画详情
  detail: { method: 'post', url: '/api/manhua/detail' },
  // 漫画推荐
  recommend: { method: 'post', url: '/api/manhua/recommend' },
  // 漫画喜欢
  liking: { method: 'post', url: '/api/manhua/liking', showSuccess: true },
  // 阅读漫画
  read: { method: 'post', url: '/api/manhua/read' },
  // 购买漫画
  buy: { method: 'post', url: '/api/manhua/buy' }
}
