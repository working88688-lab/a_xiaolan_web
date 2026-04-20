/**
 * desc: 基础数据管理
 * date: 2024.03.28
 */
import type { TabItem } from '@types'
import type { GlobalState } from '@types'

const globalStore = defineStore('global', {
  // 初始状态
  state: (): GlobalState => ({
    reportType: [],
    // 全局配置
    config: {} as GlobalState['config'],
    affCode: '', // 渠道参数
    hasShowHomeNotice: false, // 是否已经展示首页弹框
    navbarTitle: '' //全局导航栏标题，优先显示这个，没有就展示页面路由自带的标题
  }),
  getters: {
    mv_short_find_tab(): any {
      return this.config.mv_short_find_tab?.map(item => ({ name: item.sort, title: item.name }))
    },
    mv_find_tab(): any {
      return this.config.mv_find_tab?.map(item => ({ name: item.sort, title: item.name }))
    },
    mv_nag_tab(): any {
      return this.config.mv_nag_tab?.map(item => ({ name: item.sort, title: item.name }))
    },
    mv_original_tab(): any {
      return this.config.mv_original_tab?.map(item => ({ name: item.sort, title: item.name }))
    },
    post_tab(): any {
      return this.config.post_tab?.map(item => ({ name: item.sort, title: item.name }))
    },
    cartoon_tab(): any[] {
      return this.config.cartoon_tab?.map(item => ({ name: item.sort, title: item.name }))
    },
    dy_tab(): TabItem[] {
      return this.config.dy_tab
    },
    ai_tab(): Array<{ name: string; sort: number }> {
      return this.config.ai_tab
    },
    mv_tag_tab(): any {
      return this.config.mv_tag_tab?.map(item => ({ name: item.sort, title: item.name }))
    }
  },
  // 提交状态
  actions: {
    setNavbarTitle(title?: string) {
      this.navbarTitle = title
    },
    // 更新首页弹框状态
    updateHomeNoticeStatus() {
      this.hasShowHomeNotice = true
    },
    // 设置渠道参数
    setAffCode(affCode: string) {
      this.affCode = affCode
    },
    // set globalConfig value by key
    setConfigByKey<T extends keyof GlobalState['config']>(key: T, value: GlobalState['config'][T]) {
      this.config[key] = value
    },
    // set globalConfig value by keys
    setConfigByKeys<T extends keyof GlobalState['config']>(config: Partial<GlobalState['config']>) {
      Object.keys(config).forEach(key => {
        this.config[key as unknown as T] = config[key as unknown as T]
      })
    },

    async synch() {
      const parallel = !!window.localStorage.getItem('user')
      try {
        const __ = useNuxtApp()

        if (parallel) {
          const [{ data }] = await Promise.all([__.$Api.globalConfig(), __.$Store.user.info()])
          this.setConfigByKeys(data)
          localStorage.setItem('_github_url_', this.config.github_url)
          return data
        } else {
          const { data } = await __.$Api.globalConfig()
          await __.$Store.user.info()
          this.setConfigByKeys(data)
          localStorage.setItem('_github_url_', this.config.github_url)
          return data
        }
      } catch (error) {}
    },

    async getReports() {
      const __ = useNuxtApp()
      const res = await __.$Api.Video.report_type()
      this.reportType = [...res.data]
    }
  }
})

export default globalStore
