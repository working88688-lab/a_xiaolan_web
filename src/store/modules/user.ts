import type { LoginData } from '@types'
import { defineStore } from 'pinia'

type LoginInfn = {
  data: LoginData
}

const userStore = defineStore('user', {
  // 初始状态
  state: () => ({
    // 登录状态
    isLogin: false,

    // 用户Token
    token: '',

    // 用户信息
    u: {
      aff_code: '', // 用户aff/我的邀请码
      auth_level: 0, // 认证身份
      auth_status: 0, // 用户状态{1,待审核,2:未通过,3:禁用,4:正常}
      avatar_url: '', // 用户头像
      coins: 0, // 金币
      expired_at: 0,
      expired_str: '', // vip过期时间(是vip才会有vip过期日期)
      fabulous_count: 0, // 发布视频数
      fans_count: 0, // 粉丝数
      followed_count: 0, // 关注数
      invite_by_code: '', // 被邀请人code
      invited_by: 0,
      invited_num: 0,
      is_attention: 0,
      exp: 0,
      is_recommend: 0,
      is_reg: 0, // 用来判定是否登录/注册{0: 未登录, 1: 已登录}
      is_vip: 0, // 是否会员
      level: 0, // 会员等级
      likes_count: 0, // 自己获取的点赞数量
      message_tip: 0, // 我的通知  0 没有
      my_ticket_number: 0,
      nickname: '', // 用户昵称
      person_signnatrue: '', // 用户签名/个人信息描述
      share_text: '', // 分享文本
      share_url: '', // 分享链接
      today_mv_score: 0, // 今日视频收入
      today_tui_coins: 0, // 今日推广收入
      token: '', // 用户token
      chat_token: '',
      total_tui_coins: '0.00',
      tui_coins: '0.00',
      uid: 0,
      username: '', // 可以用来判定是否登录/注册{null: 未登录, !null: 已登录}
      validate: 0,
      videos_count: 0,
      today_post_score: 0,
      vip_level: 0,
      votes: '0.00',
      girl_auth: 0,
      post_auth: 0,
      build_id: ''
    },
    // TA邀请码
    incode: null
  }),

  persist: {
    storage: localStorage,
    pick: ['isLogin', 'u', 'token', 'incode']
  },

  // 派生状态
  getters: {},

  // 提交状态
  actions: {
    // 前端更新用户信息
    updateUserInfo(key: string, value: any) {
      // @ts-ignore
      this.u[key] = value
    },
    //获取用户信息
    info() {
      const _this = this
      const __ = useNuxtApp()
      return new Promise((resolve, reject) => {
        __.$Api.User.info()
          .then(({ data }) => {
            const globalStore = useGlobalStore()
            _this.u = { ..._this.u, ...data }
            globalStore.setConfigByKeys({
              uid: data.uid,
              share_url: data.share_url,
              isBindMobile: data.username,
              can_aw: data.can_aw,
              can_aw_tips: data.can_aw_tips,
              new_can_aw_tips_title: data.new_can_aw_tips_title,
              new_can_aw_tips_vip: data.new_can_aw_tips_vip
            })
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 用户登录
    login(info: LoginInfn) {
      const { data } = info
      // let _chatToken = ''
      const _this = this
      const __ = useNuxtApp()
      return new Promise((resolve, reject) => {
        __.$Api.User.login(data)

          // 1. 设置TOKEN
          .then(({ data: { token, uid } }) => {
            if (token) {
              __.$Store.$reset()

              _this.token = token
              _this.u.uid = uid
              _this.isLogin = true
              __.$WebSDK.setUid(uid)
            } else {
              reject({ msg: '@用户登录失败' })
            }
          })

          // 2. 获取信息
          .then(() => {
            return useGlobalStore().synch()
          })

          // 3. 设置信息
          .then(() => {
            resolve(this.u)
          })

          .catch(err => {
            reject(err)
          })
      })
    },

    // 用户注册
    register({ data }) {
      const _this = this
      const __ = useNuxtApp()
      return new Promise((resolve, reject) => {
        __.$Api.User.register(data)

          // 1. 设置TOKEN
          .then(({ data: { token } }) => {
            if (token) {
              __.$Store.$reset()
              _this.token = token
              _this.isLogin = true
            } else {
              reject('用户凭证(token)获取失败')
            }
          })

          // 2. 获取信息
          .then(() => {
            return useGlobalStore().synch()
          })
          .then(() => {
            resolve(true)
          })

          .catch(err => {
            console.log('err: ', err)
            reject(err)
          })
      })
    },

    // 用户修改
    update({ data }) {
      const _this = this
      const __ = useNuxtApp()
      return new Promise((resolve, reject) => {
        __.$Api.User.update(data)

          // 2. 获取信息
          .then(() => __.$Api.User.info())

          // 3. 设置信息
          .then(({ data }) => {
            _this.u = { ..._this.u, ...data }
            resolve(data)
          })

          .catch(err => {
            reject(err)
          })
      })
    },

    // 用户退出
    logout(redirect?: string) {
      //isAgain 是否是重新登录
      const _this = this
      const __ = useNuxtApp()
      const globalStore = useGlobalStore()
      return new Promise(resolve => {
        __.$Oauth.reset()
        __.$Store!.$reset()
        __.$WebSDK.setUid('')
        localStorage.removeItem('user')
        globalStore.synch().then(() => {
          __.$Replace(redirect ? redirect : '/home')
        })

        if (!_this.u) {
          resolve(true)
        }
      })
    }
  }
})

export default userStore
