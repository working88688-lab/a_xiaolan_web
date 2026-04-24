import type { AdItem, UserInfo } from '@types'

export interface VideoItem {
  play_url: string
  comment: number
  user: UserInfo
  is_like: 0 | 1
  is_pay: 0 | 1
  is_aw: 0 | 1
  like: number
  id: number
  cover_thumb_url: string
  duration_str: string
  rating: number
  title: string
  uid: number
  created_str: string
  created_at: number
  preview_video: string
  coins: number
  tags_list: string[]
  preview_tip: string
  count_pay: number
  is_series: 0 | 2 // 0 电影 2 电视剧
  isAd?: boolean
  img_url?: string
  url?: string
  tags: string
  duration: number
  video_type_id: number
  video_tag_key: string
  video_type_name: string
  media_id?: string
  video_content_type?: string
  recommend_trace_id?: string
}

export interface VideoData {
  detail: VideoItem
  ads: AdItem[]
  recommend: VideoItem[]
  topic_info?: {
    id: number
    title: string
  }
}

export interface VideoEpisode {
  id: number
  name: string
  selected: boolean
  sort: number
}

export interface OriginalItem {
  coins: number
  com_count: number
  cover_full: string
  created_at: string
  id: number
  is_like: 0 | 1
  is_pay: 0 | 1
  is_free: 0 | 1
  play_count: number
  source: string
  preview_video: string
  tags: string[]
  title: string
  video_id: number
  like_count: number
  videos: Array<VideoEpisode>
  duration: number
  video_type_id: number
  video_tag_key: string
  video_type_name: string
}

export interface OriginalData {
  detail: OriginalItem
  ads: AdItem[]
  recommend: OriginalItem[]
  topic_info?: {
    id: number
    title: string
  }
}

export interface OriginalCommentItem {
  id: number
  user: UserInfo
  content: string
  created_at: string
  is_like: 0 | 1
  like_num: number
}

export interface CollectInfo {
  id: number
  desp: string
  image_url: string
  is_like: 0 | 1
  is_pay: 0 | 1
  title: string
  user: UserInfo
  like_count: number
  video_count: number
  origin_coins: number
  coins: number
}

export interface CollectDetail {
  info: CollectInfo
  list: VideoItem[]
}
