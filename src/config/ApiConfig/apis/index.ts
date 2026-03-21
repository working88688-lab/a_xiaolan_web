/**
 * desc: 接口配置
 * date: 2023.03.20
 */
import Checkin from './modules/Checkin'
import Comics from './modules/Comics'
import Community from './modules/Community'
import Darkweb from './modules/Darkweb'
import Discover from './modules/Discover'
import Home from './modules/Home'
import Images from './modules/Images'
import Search from './modules/Search'
import Story from './modules/Story'
import User from './modules/User'
import Video from './modules/Video'
import collect from './modules/collect'
import original from './modules/original'

export default {
  // 模块接口引用
  Checkin,
  Home,
  User,
  Search,
  Video,
  Discover,
  Comics,
  Story,
  Images,
  Community,
  Darkweb,
  original,
  collect,

  // 公用接口区域
  globalConfig: { method: 'post', url: '/api/home/getConfig', mapping: {} },
  uploadImage: { method: 'uploadImage', url: `/imgUpload.php`, mapping: {} },
  uploadVideo: { method: 'uploadvideo', url: '/', mapping: {} }
}
