export default {
  // 原创详情
  detail: { method: 'post', url: '/api/original/detail' },
  // 评论列表
  comment_list: { method: 'post', url: '/api/original/comment_list' },
  // 评论点赞
  like: { method: 'post', url: '/api/original/like' },
  // 发表评论
  comment: { method: 'post', url: '/api/original/comment' },
  // 点赞评论
  like_comment: { method: 'post', url: '/api/original/like_comment' },
  // 购买原创视频
  buy: { method: 'post', url: '/api/original/buy', showSuccess: true, throwError: false },
  // 我的收藏
  like_list: { method: 'post', url: '/api/original/like_list' },
  // 我的购买
  my_buy: { method: 'post', url: '/api/original/my_buy' },
  // 我的购买
  list_tag: { method: 'post', url: '/api/original/list_tag' }
}
