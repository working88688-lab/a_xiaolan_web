export default {
  //  合集列表
  list: { method: 'post', url: '/api/topic/list' },
  //  合集视频列表
  mvlist: { method: 'post', url: '/api/topic/mvlist' },
  //  合集点赞
  toggle_like: { method: 'post', url: '/api/topic/toggle_like' },
  //  购买合集
  buy: { method: 'post', url: '/api/topic/buy', showSuccess: true, throwError: false },
  //  我购买的合集
  my_buy: { method: 'post', url: '/api/topic/my_buy' },
  //  我收藏的合集
  my_like: { method: 'post', url: '/api/topic/my_like' }
}
