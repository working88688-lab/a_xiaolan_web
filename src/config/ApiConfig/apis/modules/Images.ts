export default {
  // 图片列表
  list: { method: 'post', url: '/api/image/list' },
  // 小说详情
  detail: { method: 'post', url: '/api/image/detail' },
  // 我的图片点赞列表
  like_list: { method: 'post', url: '/api/image/like_list' },
  // 漫画推荐
  recommend: { method: 'post', url: '/api/image/recommend' },
  // 漫画喜欢
  liking: { method: 'post', url: '/api/image/liking', showSuccess: true },
  // 阅读漫画
  read: { method: 'post', url: '/api/image/read' },
  // 购买漫画
  buy: { method: 'post', url: '/api/image/buy' }
}
