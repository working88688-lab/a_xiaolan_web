export type RankTabType = 'up' | 'income' | 'hz'

export type RankType = 'day' | 'month' | 'week'

export interface RankItem {
  uid: number
  aff: number
  avatar_url: string
  nickname: string
  videos_count: number
  is_attention: 0 | 1
  is_vip: 0 | 1
  likes_count: number
  votes: number
  val: number
}
