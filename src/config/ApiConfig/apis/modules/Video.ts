export default {
  // 发布上传视频
  upload: { method: 'post', url: '/api/mv/upload', showSuccess: true },
  // 上传前配置
  preUpload: { method: 'post', url: '/api/mv/preUpload' },
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
  // 作品-所有
  all: { method: 'post', url: '/api/works/all' },
  // 作品-已发布
  published: { method: 'post', url: '/api/works/release' },
  // 待审核
  wait: { method: 'post', url: '/api/works/wait' },
  // 作品-审核中
  pending: { method: 'post', url: '/api/works/pending' },
  // 已拒绝
  reject: { method: 'post', url: '/api/works/reject' },
  // 作品-未通过
  rejected: { method: 'post', url: '/api/works/rejected' },
  // 待审核作品列表
  submit: { method: 'post', url: '/api/works/submit' },
  // 删除作品（逻辑删除）
  delete: { method: 'post', url: '/api/works/delete', showSuccess: true },
  // 删除待审核未通过的视频
  delSubmit: { method: 'post', url: '/api/works/delSubmit', showSuccess: true },
  // 重新上架作品
  reUpShelves: { method: 'post', url: '/api/works/reUpShelves', showSuccess: true },
  // 获取下架原因配置列表
  hideReasons: { method: 'post', url: '/api/works/hideReasons' },
  // 下架视频
  downShelves: { method: 'post', url: '/api/works/downShelves', showSuccess: true },
  // 已下架
  hide: { method: 'post', url: '/api/works/hide' },
  // 视频详情推荐
  detail_recommend: { method: 'post', url: '/api/mv/detail_recommend' },
  // 视频收益明细
  videoIncomeList: { method: 'post', url: '/api/videoincome/videoIncomeList' },
  // 视频观看记录
  watching: { method: 'post', url: '/api/mv/watching' }
}
