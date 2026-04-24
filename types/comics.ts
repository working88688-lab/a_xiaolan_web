export type SeryItem = {
  episode: number
  from: number
  id: number
  pid: number
}

export interface ComicData extends BaseCard {
  author: string
  rating: number
  tags_list: string[]
  description: string
  series: SeryItem[]
  is_like: 0 | 1
  favorites: number
  coins: number
  is_pay: 0 | 1
  is_finish: 0 | 1
  sub_tips: string
  newest_series: string
  media_id?: string
  comic_type_id?: string
  comic_type_name?: string
  comic_tag_key?: string
  comic_tag_name?: string
  recommend_trace_id?: string
}

export type StoryItem = {
  created_at: string
  series: number
  id: number
  story_id: number
  title: string
  url_full: string
}
export interface StoryData extends BaseCard {
  author: string
  rating: number
  tags_list: string[]
  desc: string
  series: StoryItem[]
  is_like: 0 | 1
  favorites: number
  coins: number
  is_pay: 0 | 1
  is_finish: 0 | 1
  update_time: string
  now_total: string
  media_id?: string
  novel_type_id?: string
  novel_type_name?: string
  novel_tag_key?: string
  novel_tag_name?: string
  recommend_trace_id?: string
}
export type ImageItem = {
  id: number
  picture_id: number
  img_height: string
  img_width: string
  img_url_full: string
}
export interface ImageData extends BaseCard {
  author: string
  rating: number
  tags_list: string[]
  desc: string
  series: ImageItem[]
  is_like: 0 | 1
  favorites: number
  coins: number
  is_pay: 0 | 1
  is_finish: 0 | 1
  update_time: string
  total: string
  has_right: boolean
}

export interface ComicItem {
  from: number
  id: number
  img_height: string
  img_url: string
  img_url_full: string
  img_width: string
  m_id: number
  s_id: number
}

export interface BaseCard {
  id: number
  thumb_full: string
  title: string
}
