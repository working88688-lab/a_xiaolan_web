export default {
  // 社区首页
  getHomeData: { method: 'post', url: '/api/community/home' },
  // 社区首页排名
  rankConf: { method: 'post', url: '/api/community/rankConf' },
  // 社区首页 日、周、月榜
  rank: { method: 'post', url: '/api/community/rank' },
  // 社区论坛
  topics: { method: 'post', url: '/api/community/topics' },
  // 社区论坛 关注
  follow: { method: 'post', url: '/api/community/toggle_follow_topic' },
  // 社区求片
  qiupian: { method: 'post', url: '/api/find/home' },
  // 社区求片-想看
  wantLook: { method: 'post', url: '/api/find/wantLook' },
  // 社区求片-图文
  tuwen: { method: 'post', url: '/api/tab/tuwen' },
  // 帖子详情
  postDetail: { method: 'post', url: '/api/community/post_detail_by_id' },
  // 帖子详情-评论列表
  postDetailComments: { method: 'post', url: '/api/community/list_commentsnew' },
  // 帖子详情-发表评论
  createComment: { method: 'post', url: '/api/community/commentnew', showSuccess: true },
  // 帖子详情-付币
  unlock_post: { method: 'post', url: '/api/community/unlock_post', showSuccess: true, throwError: false },
  // topic详情
  topic_detail: { method: 'post', url: '/api/community/topic_detail' },

  // topic最新-精华详情
  list_post_by_topic_id: { method: 'post', url: '/api/community/list_post_by_topic_id' },
  // 求片详情
  filmDetail: { method: 'post', url: '/api/find/detail' },
  // 求片详情-推荐
  replyByFind: { method: 'post', url: '/api/find/replyByFind' },
  // 求片详情-点赞
  praiseReply: { method: 'post', url: '/api/find/praiseReply' },
  // 求片详情-追加赏金
  appendCoins: { method: 'post', url: '/api/find/appendCoins', showSuccess: true },
  // 求片详情-打赏
  reward: { method: 'post', url: '/api/find/reward', showSuccess: true },
  // 求片详情-采纳
  myAccept: { method: 'post', url: '/api/find/myAccept' },
  // 求片详情-评论
  commentReply: { method: 'post', url: '/api/find/commentReply' },
  // 求片详情-评论  点赞
  praiseCommentReply: { method: 'post', url: '/api/find/praiseCommentReply' },
  // 求片详情-评论更多
  commentByReply: { method: 'post', url: '/api/find/commentByReply' },
  // 求片详情-平台片源
  mvList: { method: 'post', url: '/api/find/mvList' },
  // 求片详情-推片
  replyMv: { method: 'post', url: '/api/find/reply', showSuccess: true },
  // 求片详情-追加赏金列表
  appendDetail: { method: 'post', url: '/api/find/appendDetail', showSuccess: true },
  // 社区漫画-搜索
  manhuaFilter: { method: 'post', url: '/api/manhua/filter' },
  // 社区美图-搜索
  imageFilter: { method: 'post', url: '/api/image/newfilter' },
  // 社区小说-搜索,
  storyFilter: { method: 'post', url: '/api/story/filter' },

  // 社区漫画-搜索
  manhuaClass: { method: 'post', url: '/api/manhua/cat_list' },
  // 社区美图-搜索
  imageClass: { method: 'post', url: '/api/image/cat_list' },
  // 社区小说-搜索,
  storyClass: { method: 'post', url: '/api/story/cat_list' },

  // 社区小说-搜索,
  topicsss: { method: 'post', url: '/api/community/topics' },

  // 发帖,
  createPost: { method: 'post', url: '/api/community/post' },
  // 求片发帖,
  createFindPost: { method: 'post', url: '/api/find/create' },
  // 发帖规则,
  pre_post_data: { method: 'post', url: '/api/community/pre_post_data' },
  // 原创认证信息
  auth_info: { method: 'post', url: '/api/auth/post_info' },
  // 原创认证申请
  auth_apply: { method: 'post', url: '/api/auth/apply', showSuccess: true, throwError: false },
  // 视频热榜
  commentTop1: { method: 'post', url: '/api/topvideo/commentTop1' },
  // 帖子点赞
  like_comment: { method: 'post', url: '/api/community/like_comment' },
  // 搜索帖子
  search: { method: 'post', url: '/api/community/search' },
  // 匹配首页配置
  talkConf: { method: 'post', url: '/api/talk/config' },
  // 匹配用户
  talkMatch: { method: 'post', url: '/api/talk/match' },
  // 修改匹配设置
  talkSetting: { method: 'post', url: '/api/talk/setting', showSuccess: true },
  // 获取聊天Token
  talkToken: { method: 'post', url: '/api/talk/token' },
  // 获取聊天用户信息
  talkUserInfo: { method: 'post', url: '/api/talk/userInfo' },
  // 获取聊天用户信息（剩余条数/是否超时等）
  talkInfo: { method: 'post', url: '/api/talk/talk_info' },
  // 聊天时长产品列表
  talkProductList: { method: 'post', url: '/api/talk/product_list' },
  // 购买聊天时长（扣金币）
  talkBuyTime: { method: 'post', url: '/api/talk/buy_time', showSuccess: true },
  // 聊天功能配置
  talkChatConf: { method: 'post', url: '/api/talk/chatConf' },
  // 聊天地区列表
  talkRegions: { method: 'post', url: '/api/talk/regions' },
  // 聊天时长产品列表
  talkProducts: { method: 'post', url: '/api/talk/products' },
  // 购买聊天时长
  talkBuy: { method: 'post', url: '/api/talk/buy', showSuccess: true },
  // 提交聊天举报
  talkReport: { method: 'post', url: '/api/talk/report', showSuccess: true },
  // 聊天举报原因列表
  talkReportReasons: { method: 'post', url: '/api/talk/reportReasons' },

  // 同圈匹配-个人资料
  usersmatchMyprofile: { method: 'post', url: '/api/usersmatch/myprofile' },
  // 同圈匹配-更新个人资料
  usersmatchUpdateProfile: { method: 'post', url: '/api/usersmatch/update_profile', showSuccess: true },
  // 同圈匹配-我想匹配的资料
  usersmatchMyExpectProfile: { method: 'post', url: '/api/usersmatch/myexpectprofile' },
  // 同圈匹配-更新我想匹配的资料
  usersmatchUpdateExpectProfile: { method: 'post', url: '/api/usersmatch/update_expect_profile', showSuccess: true },
  // 同圈匹配-开始匹配
  usersmatchMatch: { method: 'post', url: '/api/usersmatch/match' },
  // 同圈匹配-选择匹配详情
  usersmatchGetMatchInfo: { method: 'post', url: '/api/usersmatch/get_match_info' },
  // 同圈匹配-提交匹配结果
  usersmatchSubmitMatch: { method: 'post', url: '/api/usersmatch/submit_match', showSuccess: true },
  // 匹配卡商品列表
  matchGoods: { method: 'post', url: '/api/usersmatch/match_goods' },
  // 购买匹配卡
  buyMatchGoods: { method: 'post', url: '/api/usersmatch/buy_match_goods', showSuccess: true }
}
