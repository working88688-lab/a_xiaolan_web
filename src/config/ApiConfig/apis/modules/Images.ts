export default {
  // 小说详情
  detail: { method: 'post', url: '/api/image/detail' },
  // 漫画推荐
  recommend: { method: 'post', url: '/api/image/recommend' },
  // 漫画喜欢
  liking: { method: 'post', url: '/api/image/liking', showSuccess: true },
  // 阅读漫画
  read: { method: 'post', url: '/api/image/read' },
  // 购买漫画
  buy: { method: 'post', url: '/api/image/buy' }
}
