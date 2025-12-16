import type { AdItem, TabItem } from '@types'
export type SortType = {
  name: string
  sort: string
}
export interface GlobalState {
  config: {
    maintain_tips?: string
    activity_thumb?: string
    activity_url?: string
    uid?: number
    share_url?: string
    isBindMobile?: string
    index_ads_thumb?: string
    index_ads_url?: string
    tg?: string
    can_aw?: 0 | 1
    can_aw_tips?: string
    pop_ads_v2?: Array<AdItem>

    mv_find_tab: SortType[]
    mv_nag_tab: SortType[]
    mv_original_tab: SortType[]
    cartoon_tab: SortType[]
    post_tab: SortType[]
    r2Key: string
    r2URL: string
    r2CompleteURL: string
    seo_description: string
    seo_title: string
    seo_keywords: string
    pwa_download_url: string
    pwa_apk: string
    floating_ads: AdItem[]
    github_url: string
    ads_screen: Array<{
      index_ads_thumb: string
      index_ads_type: number
      index_ads_url: string
    }>
    apps: Array<AdItem>

    dy_tab: TabItem[]

    activity?: {
      content: string
      jump_type: 0 | 1 | 2 // 0 VIP页面 1 外部跳转链接 2 内部跳转链接
      jump_val: string
      time_left: number
    }
    search_hot_keywords: string
    ai_tab: any[]
    click_app_id?: string
    click_transit_path: string
  }
  affCode: string
  hasShowHomeNotice: boolean
  navbarTitle?: string
  reportType: string[]
}

export interface SortTab {
  name: string
  title: string
  default?: boolean
}
