export default {
  // 应用中心
  appcenter: { method: 'post', url: '/api/system/appcenter' },
  // tabs
  tab: { method: 'post', url: '/api/tabnew/index' },
  // 首页Tab栏目标签列表（新口径）
  tabIndex: { method: 'post', url: '/api/tab/index' },
  // 落地页广告
  getConfig: { method: 'post', url: '/api/home/getConfig' },
  // 首页分类
  getCategory: { method: 'post', url: '/api/tab/category' },
  // 分类内容
  getCategoryContent: { method: 'post', url: '/api/mv/listOfTag' },
  // 首页分类
  getNewCategory: { method: 'post', url: '/api/mv/listOfTagNew' },
  // 应用统计
  appclick: { method: 'post', url: '/api/system/appclick' },

  list_tab_mv: { method: 'post', url: '/api/tabnew/list_tab_mv' },

  construct_list: { method: 'post', url: '/api/tabnew/construct_list' },

  new_mv_tag: { method: 'post', url: '/api/tabnew/listOfTag' },
  // 关注页推荐用户列表（未关注任何人时展示，按视频总播放量排序）
  recommendUsers: { method: 'post', url: '/api/recommend/recommendUsers' }
}
