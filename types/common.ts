import type { UserInfo, VideoItem } from '@types'

export interface TagItem extends MediaItem {
  rating: number
  title: string
}

export interface HotTagItem {
  id: number
  name: string
  img_url_full: string
}

export interface MediaItem {
  id: number
  cover_thumb_url: string
  duration_str: string
  rating: number
  title: string
  uid: number
  pid: number
  created_str: string
  created_at: number
  type: number
  media_url_full: string
  cover_url_full: string
  tags: string
  duration: number
  video_type_id: number
  video_tag_key: string
  video_type_name: string
}

export interface TabItem {
  name: string
  type: string | number
  api: string
  current: boolean
  cover_full?: string
  key: string
  id: number
  h5_url: string
  params?: {
    [key: string]: any
  }
  list?: TabItem[]
}
export interface IconItem {
  icon: string
  key: string
  name: string
  type: string
}

export interface CommentItem {
  id: number
  comment: string
  createdAt: string
  createdAtStr: string
  hasLike: boolean
  likes: number
  mvID: number
  user: UserInfo
  child: CommentItem[]
  created_at: string
  comments: CommentItem[]
  like_num: number
  is_like: 0 | 1
}

export interface SaoItem {
  id: number
  tips: string
}

export interface SelectTab {
  key: string
  value: string
}

export interface ForumData {
  id: number
  intro: string
  view_num: number
  follow_num: number
  thumb_full: string
  name: string
  post_num: number
  girl_num: number
  is_follow: 0 | 1
}

export interface QiupianData {
  detail: {
    id: number
    uuid: string
    title: string
    img: string
    coins: number
    total_coins: number
    created_at: number
    status: number
    like: number
    reply: number
    is_match: number
    is_back: number
    is_top: number
    is_finish: number
    created_at_format: string
    images: string[]
    mv_info: any
    is_like: false
    created_str: string
    img_list: string[]
    status_str: string
    is_match_str: string
    member: {
      uuid: string
      uid: number
      nickname: string
      thumb: string
      followed_count: number
      auth_status: number
      avatar_url: string
      expired_str: string
      is_vip: 0 | 1
      is_attention: number
      vvLevel: number
    }
  }
  append_list: any[]
  append_ct: number
  append_sum: number
  count_down: {
    expire_at: number
    now: number
  }
}

export interface QiupianRecommend {
  id: number
  find_id: number
  uuid: string
  status: number
  is_accept: 0 | 1
  coins: number
  mvs: VideoItem[]
  comment_list: QiupianRecommend[]
  created_str: string
  like_num_str: string
  reply_num_str: string
  is_like: 0 | 1
  status_str: string
  is_accept_str: string
  member: UserInfo
  comment: string
  showComment: boolean
}

export interface NewTabItem {
  tab_id: number
  tab_name: string
  tags_ary: string[]
}

export interface AdItem {
  type: number
  img_url: string
  url: string
  id: number
  expired_date: string
  title: string
  is_expired: boolean
  advertise_code: string
  advertise_location_code: string
  page_key: string
  page_name: string
  ad_slot_name: string
  ad_type: string
  creative_id: string
}

export interface RecTabItem {
  has_tab: 0 | 1
  icon: string
  id: number
  nag_id: number
  show_max: number
  show_style: 0 | 1
  sub_title: string
  title: string
  type: 0 | 1 | 2 | 3 | 4 | 5
  has_hyh: 0 | 1
  list: Array<VideoItem>
}

export interface Ai {
  id: number
  coins: number
  thumb: string
  face_thumb: string
  ground: string
  type: 1 | 2
  title: string
  face_thumb_w: number
  face_thumb_h: number
  ground_w: number
  ground_h: number
  thumb_w: number
  thumb_h: number

  strip_thumb: string
  strip_thumb_h: number
  strip_thumb_w: number
  is_favorite: 0 | 1
  is_like: 0 | 1
  like_count: number
}
