export default {
  //获取用户信息
  info: { method: 'post', url: '/api/users/getBaseInfo' },
  //关注、取关操作
  updateFollow: { method: 'post', url: '/api/users/following' },
  // 邀请码绑定
  invitation: { method: 'post', url: '/api/users/invitation', showError: false },
  //登录
  login: { method: 'post', url: '/api/users/login_account' },
  //注册
  register: { method: 'post', url: '/api/users/register_account' },
  // 兑换码绑定
  exchange: { method: 'post', url: '/api/system/exchange' },
  //修改个人信息
  updateInfo: { method: 'post', url: '/api/member/update' },
  // 消息中心
  notices: { method: 'post', url: '/api/message/mine' },
  //我的粉丝
  fansList: { method: 'post', url: '/api/users/fans' },
  //我的收藏-视频
  mycVides: { method: 'post', url: '/api/users/likes' },
  //我的收藏-合集
  // mycCombine: { method: 'post', url: '/api/usertopic/likeOfTopic' },
  //我的收藏-漫画
  mycManhua: { method: 'post', url: '/api/manhua/my_liking' },
  //我的收藏- 美图
  mycImage: { method: 'post', url: '/api/image/my_liking' },
  //我的收藏- 小说
  mycStory: { method: 'post', url: '/api/story/my_liking' },
  //我的收藏- 帖子
  mycPost: { method: 'post', url: '/api/community/favorit_post' },
  //帖子点赞
  likePost: { method: 'post', url: '/api/community/like_post' },
  //我的购买-视频
  buyedVideo: { method: 'post', url: '/api/chargeVideo/maiguo' },
  //我的购买-漫画
  buyedManhua: { method: 'post', url: '/api/manhua/my_buy' },
  //我的购买-美图
  buyedImgage: { method: 'post', url: '/api/image/my_buy' },
  //我的购买-小说
  buyedStory: { method: 'post', url: '/api/story/my_buy' },
  //我的购买-视频
  buyedPost: { method: 'post', url: '/api/community/buy_post' },
  //我的邀请
  myInvite: { method: 'post', url: '/api/users/yqzq' },
  //系统消息
  sysnotice: { method: 'post', url: '/api/message/list' },
  //充值列表
  chargeList: { method: 'post', url: '/api/product/list' },
  // 充值记录
  chargeRecord: { method: 'post', url: '/api/users/orders' },
  // 提交反馈
  feedSave: { method: 'post', url: '/api/helper/feedSave' },
  // 在线反馈列表
  feedList: { method: 'post', url: '/api/helper/feedList' },
  // 支付订单
  createP: { method: 'post', url: '/api/p/createP', showError: false },
  // 金币明细
  consume_log: { method: 'post', url: '/api/users/consume_log', showError: false },
  // 我的卡券
  myMvTicket: { method: 'post', url: '/api/users/myMvTicket', showError: false },

  // 我的帖子
  myPost: { method: 'post', url: '/api/community/my_post', showError: false },
  // 我的帖子收益
  postProfit: { method: 'post', url: '/api/videoincome/postProfit' },
  // 我的视频收益
  videoProfit: { method: 'post', url: '/api/videoincome/videoProfit' },
  // 我的视频最新作品收益
  newestProfit: { method: 'post', url: '/api/videoincome/newest' },
  // 我的视频最热作品收益
  hottestProfit: { method: 'post', url: '/api/videoincome/hottest' },
  // 我的最热收益
  incomeList: { method: 'post', url: '/api/community/incomeList' },
  // 收益明细
  userMoney: { method: 'post', url: '/api/proxy/userMoney' },
  // 我的账户
  getAccount: { method: 'post', url: '/api/p/getAccount' },
  // 新增账户
  addAccount: { method: 'post', url: '/api/p/addAccount', showSuccess: true },
  // 删除账户
  delAccount: { method: 'post', url: '/api/p/delAccount', showSuccess: true },
  // 我的提现列表
  myWithDrawList: { method: 'post', url: '/api/users/myWithDrawList' },
  // 我的喜欢
  myFindList: { method: 'post', url: '/api/find/myFindList' },
  // 我的喜欢
  myLook: { method: 'post', url: '/api/find/myLook' },
  // 我的推荐
  myReply: { method: 'post', url: '/api/find/myReply' },
  // 获取其他用户消息
  getOtherUserInfo: { method: 'post', url: '/api/users/getUserHome' },
  // 我的关注
  myFollowed: { method: 'post', url: '/api//users/followed' },
  // 用户视频
  userVideos: { method: 'post', url: '/api/users/videos' },
  // 用户合集
  // userlistOfTopics: { method: 'post', url: '/api/usertopic/listOfTopic' },
  // 用户帖子
  userlistPost: { method: 'post', url: '/api/community/listPost' },
  // 修改个人信息
  update: { method: 'post', url: '/api/users/personal' },
  // 合集详情
  // listmvOfTopic: { method: 'post', url: '/api/usertopic/listmvOfTopic' },
  // 合集-喜欢
  // toggle_like: { method: 'post', url: '/api/usertopic/toggle_like' },
  // 邀请记录
  userInviteList: { method: 'post', url: '/api/proxy/userInviteList' },
  // 用户提现
  withdraw: { method: 'post', url: '/api/proxy/withdraw', showSuccess: true },
  // 购买合集
  buy_collect: { method: 'post', url: '/api/topic/buy', showSuccess: true },
  // 图文收益明细
  unlockList: { method: 'post', url: '/api/community/unlockList', showSuccess: true },
  // 私信-好友列表
  chat_friends: { method: 'post', url: '/api/message/friends' },

  friendMessage: { method: 'post', url: '/api/message/friendMessage' },
  chat: { method: 'post', url: '/api/message/chat', showSuccess: true },
  chat_product: { method: 'post', url: '/api/message/product' },
  chat_buy: { method: 'post', url: '/api/message/buy' },
  chat_remove_friend: { method: 'post', url: '/api/message/removeFriend' }
}
