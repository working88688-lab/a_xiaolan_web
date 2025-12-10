export default {
  // 应用中心
  appcenter: { method: 'post', url: '/api/system/appcenter' },
  // tabs
  tab: { method: 'post', url: '/api/tabnew/index' },
  // 落地页广告
  getConfig: { method: 'post', url: '/api/home/getConfig' },
  // 首页分类
  getCategory: { method: 'post', url: '/api/tab/category' },
  // 分类内容
  getCategoryContent: { method: 'post', url: '/api/mv/listOfTag' },
  // 首页分类
  categoryNew: { method: 'post', url: '/api/tab/categoryNew' },
  // 首页分类
  getNewCategory: { method: 'post', url: '/api/mv/listOfTagNew' },
  // 应用统计
  appclick: { method: 'post', url: '/api/system/appclick' },

  // 新视频热榜
  hot_rank: { method: 'post', url: '/api/tabnew/hotRank' },

  list_tab_mv: { method: 'post', url: '/api/tabnew/list_tab_mv' },

  construct_list: { method: 'post', url: '/api/tabnew/construct_list' },

  new_mv_tag: { method: 'post', url: '/api/tabnew/listOfTag' },

  report: { method: 'post', url: '/api/home/report', showSuccess: false, showError: false, throwError: false }
}
