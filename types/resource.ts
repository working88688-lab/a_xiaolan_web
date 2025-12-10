import type { AdItem, UserInfo } from '@types'

export interface Game {
  name: string
  tags: string
  desc: string
  thumb: string
  type: 0 | 1 | 2
  id: number | string
  coins: number
  favorite_ct: number
  like_count: number
  view_count: number
  buy_fake: number
  comment_count: number
  intro: string
  play_intro: string
  is_pay: 0 | 1
  is_like: 0 | 1
  is_favorite: 0 | 1
  is_hot: 0 | 1
  hide_content: Array<{
    name: string
    val: string
  }>
  download_url: string
  medias: Array<{
    cover: string
  }>
}

export interface GameDetail {
  detail: Game
  next?: Game
  previous?: Game
  ads: AdItem[]
  free_num: number
  recommend_list: Game[]
}

export interface Novel {
  author: string
  name: string
  tags: string
  chapter_count: number
  description: string
  thumbnail: string
  is_end: 0 | 1
  type: 0 | 1 | 2
  id: number | string
  coins: number
  favorite_ct: number
  like_count: number
  view_count: number
  comment_count: number
  is_pay: 0 | 1
  is_like: 0 | 1
  is_favorite: 0 | 1
  word_count: number
  updated_at: string
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
}

export interface Picture {
  id: number
  coins: number
  view_count: number
  works_num: number
  comment_num: number
  thumb: string
  title: string
  is_pay: 0 | 1
  is_type: 0 | 1 | 2
  refresh_at: string
  tags: string
  user: UserInfo
}

export interface PictureItem {
  id: number
  picture_id: number
  coins: number
  img_url: string
  is_pay: 0 | 1
  title: string
  is_type: 0 | 1
  order: number
  img_height: string
  img_width: string
  _scale?: number
}

export interface AudioItem {
  id: number
  thumbnail: string
  author: string
  is_like: 0 | 1
  is_favorite: 0 | 1
  like_count: number
  is_pay: 0 | 1
  is_recommend: 0 | 1
  type: number
  name: string
  view_count: number
  chapter_count: number
  favorite_count: number
  coins: number
}

export interface AudioChapter {
  id: number
  audio_id: number
  coins: number
  is_pay: 0 | 1
  chapter: number
  m3u8: string
  name: string
  type: 0 | 1 | 2
  duration: number
}

export interface NovelChapter {
  id: number
  novel_id: number
  coins: number
  is_pay: 0 | 1
  chapter: number
  name: string
  type: 0 | 1 | 2
  content: string
}

export interface CartoonItem {
  id: number
  title: string
  cover_full: string
  is_favorite: 0 | 1
  is_series: 0 | 1
  like_count: number
  pay_count: number
  play_count: number
}
