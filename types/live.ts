export interface RouteItem {
  label: string
  url: string
}

export interface LiveItem {
  id: number
  cover: string
  thumb: string
  view_count: number
  username: string
  hls: RouteItem[]
  use_hls?: RouteItem
  type: 1 | 2
  is_pay: 0 | 1
  is_like: 0 | 1
  is_favorite: 0 | 1
  favorite_count: number
  like_count: number
  intro: string
  coins: number
  show: 'off' | 'public'

  comment_ct: number
}
