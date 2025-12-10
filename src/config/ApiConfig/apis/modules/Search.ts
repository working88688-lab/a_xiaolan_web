export default {
  // 搜索(视频)
  searchtags: { method: 'post', url: '/api/search/mv' },
  // 搜索原创
  original: { method: 'post', url: '/api/original/search' },
  // 搜索用户
  searchUser: { method: 'post', url: '/api/search/user' },
  // 推荐列表
  recommends: { method: 'post', url: '/api/search/index' },
  // 漫画
  searchComics: { method: 'post', url: '/api/manhua/search' },
  // 美图
  searchImage: { method: 'post', url: '/api/image/search' },
  // 小说
  searchStory: { method: 'post', url: '/api/story/search' }
}
