export default {
  // 投诉列表
  report_type: { method: 'post', url: '/api/mv/report_type' },
  // 投诉
  report_push: { method: 'post', url: '/api/mv/report_push' },
  // 视频详情
  detail: { method: 'post', url: '/api/mv/detail480' },
  // 视频点赞
  liking: { method: 'post', url: '/api/mv/liking' },
  // 购买视频
  buy: { method: 'post', url: '/api/chargeVideo/buy', showSuccess: true, throwError: false },
  // 检查券
  checkByTicket: { method: 'post', url: '/api/userbuy/checkByTicket', showSuccess: true },
  // 评论列表
  comments: { method: 'post', url: '/api/comments/list' },
  // 点赞评论
  likingComments: { method: 'post', url: '/api/comments/liking' },
  // 视频论文骚话
  saoTalk: { method: 'post', url: '/api/comments/saoTalk' },
  // 视频-发表评论
  createsaoTalk: { method: 'post', url: '/api/comments/create', showSuccess: true },
  // 广告统计
  adsclick: { method: 'post', url: '/api/system/adsclick' },
  // 上架zhong
  release: { method: 'post', url: '/api/works/release' },
  // 待审核
  wait: { method: 'post', url: '/api/works/wait' },
  // 已拒绝
  reject: { method: 'post', url: '/api/works/reject' },
  // 已下架
  hide: { method: 'post', url: '/api/works/hide' },
  // 视频详情推荐
  detail_recommend: { method: 'post', url: '/api/mv/detail_recommend' },
  // 视频收益明细
  videoIncomeList: { method: 'post', url: '/api/videoincome/videoIncomeList' },
  // 视频观看记录
  watching: { method: 'post', url: '/api/mv/watching' }
}
