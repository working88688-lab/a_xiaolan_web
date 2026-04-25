import type { BannerItem, MediaItem } from '@types'

export interface IncomeItem {
  can_withdraw: number
  total_post_coins: number
  today_post_coins: number
  rate: number
}

export interface HotItem extends MediaItem {
  medias?: Array<{ cover_url_full: string }>
  coins?: string
  reward_amount?: string
  reward_num: string
  favirute_num: string
}

export interface AcountInfo {
  account_bank?: string
  account?: number
  name?: string
  uid?: number
  id?: number
  addtime?: number
}

export interface UserInfo {
  uid: number
  // 部分接口返回中没有 aff 字段，所以改为可选，避免类型不匹配
  aff?: number
  avatar_url: string
  nickname: string
  person_signnatrue: string
  // 个人标签数组（客态视角用户主页用）
  tags_ary?: string[]
  is_attention: 0 | 1
  /** 部分列表（如粉丝列表）用该字段表示当前用户是否已关注对方 */
  is_followed?: 0 | 1
  is_vip: 0 | 1
  vip_level: number
  expired_str: string
  auth_level: number
  fans_count: number
  fabulous_count: number
  followed_count: number
  thumb?: string
  user_thumb?: string
  coins: number
  auth_status: number
  videos_count: number
  post_auth: 0 | 1
}

export interface CollectItem extends MediaItem {
  id: number
  like: number
  video_count: number
  is_top: 0 | 1
  image_url: string
  like_count: number
  title: string
}

export interface PostItem {
  id: number
  user: UserInfo
  created_at: string
  is_follow: 0 | 1
  content: string
  medias: MediaItem[]
  is_like: 0 | 1
  comment_num: number
  topic: {
    name: string
    id: number
  }
  view_num: number
  like_num: number
  is_best: 0 | 1
  title: string
  contact: string
  is_pay: 0 | 1
  price: number
  post_auth: 0 | 1
  cityname: string
  type: number
}

export interface ForumItem {
  id: number
  post_num: number
  view_num: number
  follow_num: number
  name: string
  bg_thumb_full: string
  is_follow: 0 | 1
  girl_num: number
}
