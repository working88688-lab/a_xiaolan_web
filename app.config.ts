/**
 * 环境配置
 */
export default defineAppConfig({
  //
  title: 'Xblue',

  // 页面路
  pages: [
    // 首页
    {
      name: 'home',
      path: `/home`,
      meta: { keepalive: true, bottom: true, trackPageName: '首页' }
    },

    // 落地页
    {
      name: 'splash',
      path: `/splash`,
      meta: {
        trackPageName: '启动页'
      }
    },
    {
      path: `/`,
      relace: true,
      redirect: () => {
        return '/splash'
      }
    },

    // 搜索
    {
      name: 'search',
      path: `/search`,
      meta: { keepalive: true, trackPageName: '搜索' }
    },

    // 登陆
    {
      name: 'login',
      path: `/login`
    },

    // 原创
    {
      name: 'original',
      path: `/original`,
      meta: { bottom: true, keepalive: true, trackPageName: '片库' }
    },

    {
      name: 'daily-hot',
      path: '/home/daily',
      meta: { keepalive: true, trackPageName: '今日热点' }
    },
    {
      name: 'cate',
      path: '/home/cate',
      meta: { keepalive: true, title: '', trackPageName: '发现精彩' }
    },

    // 我的
    {
      name: 'my',
      path: `/my`,
      meta: { bottom: true, keepalive: true, trackPageName: '我的' }
    },
    //  应用中心
    {
      name: 'app-center',
      path: `/app-center`,
      meta: { title: '应用中心' }
    },
    //  设置
    {
      name: 'setting',
      path: `/setting`,
      meta: {
        theme: {
          page: {
            backgroundColor: '#f4f5f6'
          }
        },
        title: '设置'
      }
    },
    {
      name: 'feedback',
      path: `/my/feedback`,
      meta: {
        theme: {
          page: {
            backgroundColor: '#f4f5f6'
          }
        },
        title: '有奖反馈'
      }
    },
    {
      name: 'notice',
      path: `/my/notice`,
      meta: {
        keepalive: true,
        trackPageName: '我的消息'
      }
    },
    {
      name: 'creative',
      path: `/creative`,
      meta: { keepalive: true, trackPageName: '创作达人' }
    },
    {
      name: 'fans',
      path: `/fans`,

      meta: { title: '粉丝', keepalive: true }
    },

    {
      name: 'player',
      path: `/player`,

      meta: { keepalive: true, trackPageName: '视频详情' }
    },
    {
      name: 'original-detail',
      path: `/original-detail`,

      meta: { keepalive: true, trackPageName: '视频详情' }
    },

    {
      name: 'forum-detail',
      path: `/forum-detail`,

      meta: { keepalive: true, trackPageName: '论坛详情' }
    },
    {
      name: 'community',
      path: `/community`,

      meta: { bottom: true, keepalive: true, trackPageName: '社区' }
    },
    {
      name: 'darkweb',
      path: `/darkweb`,

      meta: { bottom: true, keepalive: true, trackPageName: '暗网' }
    },
    {
      name: 'dark-card',
      path: `/dark-card`,

      meta: { title: '', keepalive: true, trackPageName: '暗网分类' }
    },
    {
      name: 'my-collect',
      path: `/my/collect`,

      meta: { title: '我的收藏', keepalive: true }
    },
    {
      name: 'mybuy',
      path: `/my/buy`,

      meta: { title: '我的购买', keepalive: true }
    },
    {
      name: 'myinvite',
      path: `/myinvite`,

      meta: {
        title: '邀请好友',
        theme: {
          page: {
            background: '#F8FAFF'
          }
        },
        nav: {
          rightTitle: '我的邀请',
          to: '/invite-records'
        }
      }
    },
    {
      name: 'invite',
      path: `/invite`,
      meta: {
        trackPageName: '邀请好友'
      }
    },
    {
      name: 'invite-records',
      path: `/invite-records`,

      meta: { title: '我的邀请' }
    },
    {
      name: 'promotion',
      path: `/promotion`,

      meta: { title: '推广方法' }
    },
    {
      name: 'revenue',
      path: `/revenue`,
      meta: {
        trackPageName: '收益明细'
      }
    },
    {
      name: 'publish-post',
      path: `/post/publish-post`,
      meta: {
        keepalive: true,
        trackPageName: '发布帖子'
      }
    },
    {
      name: 'post-rule',
      path: `/post/rule`,
      meta: {
        keepalive: true,
        title: '发布规则'
      }
    },
    {
      name: 'choice-file',
      path: `/post/choice`,
      meta: {
        keepalive: true,
        trackPageName: '选择视频'
      }
    },
    {
      name: 'publish-success',
      path: `/post/publish-success`,
      meta: {
        trackPageName: '发帖成功'
      }
    },
    {
      name: 'resource-cate',
      path: `/home/resource-filter`,

      meta: { title: '', keepalive: true, trackPageName: '漫画分类' }
    },
    {
      name: 'cartoon-cate',
      path: `/home/cartoon-cate`,

      meta: { title: '动漫', keepalive: true }
    },
    {
      name: 'query',
      path: `/query`,

      meta: { title: '', keepalive: true }
    },

    {
      name: 'sysnotice',
      path: `/sysnotice`,

      meta: {
        title: '系统消息',
        theme: {
          page: {
            backgroundColor: '#f4f5f6'
          }
        }
      }
    },
    {
      name: 'renewal',
      path: `/renewal`,
      meta: {
        keepalive: true,
        trackPageName: '会员中心'
      }
    },
    {
      name: 'charge-record',
      path: `/charge-record`,

      meta: {
        title: '充值记录',
        theme: {
          page: {
            backgroundColor: '#f4f5f6'
          }
        }
      }
    },
    {
      name: 'customer',
      path: `/customer`,

      meta: {
        theme: {
          page: {
            backgroundColor: 'black'
          }
        },
        trackPageName: '客服中心'
      }
    },
    {
      name: 'coin-recharge',
      path: `/coin-recharge`,
      meta: {
        trackPageName: '金币充值'
      }
    },
    {
      name: 'coin-record',
      path: `/coin-record`,

      meta: { title: '金币明细' }
    },
    {
      name: 'mycard',
      path: `/my/card`,

      meta: { title: '我的卡券' }
    },
    {
      name: 'mypost',
      path: `/mypost`,

      meta: { keepalive: true, trackPageName: '我的帖子' }
    },
    {
      name: 'post-detail',
      path: `/post-detail`,
      meta: {
        trackPageName: '社区详情'
      }
    },
    {
      name: 'income',
      path: `/income`,
      meta: { keepalive: true, trackPageName: '收入详情' }
    },
    {
      name: 'withdraw-record',
      path: `/withdraw-record`,

      meta: {
        title: '提现记录',
        theme: {
          page: {
            backgroundColor: '#f4f5f6'
          }
        }
      }
    },
    {
      name: 'afilm',
      path: `/my/afilm`,

      meta: { title: '我的求片', keepalive: true }
    },
    {
      name: 'afilm-detail',
      path: `/afilm-detail`,

      meta: { title: '详情', trackPageName: '求片详情' }
    },
    {
      name: 'push-film',
      path: `/push-film`,

      meta: { title: '我的推片', keepalive: true }
    },
    {
      name: 'comics',
      path: `/comics`,
      meta: {
        trackPageName: '漫画详情'
      }
    },
    {
      name: 'category',
      path: `/category`,

      meta: { title: '小蓝片库', keepalive: true }
    },
    {
      name: 'story',
      path: `/story`,
      meta: {
        trackPageName: '小说'
      }
    },
    {
      name: 'images',
      path: `/images`,
      meta: {
        trackPageName: '男色'
      }
    },
    {
      name: 'syscomment',
      path: `/syscomment`,

      meta: { title: '评论' }
    },
    {
      name: 'syslike',
      path: `/syslike`,

      meta: { title: '喜欢' }
    },
    {
      name: 'userdetail',
      path: `/userdetail`,

      meta: { keepalive: true, trackPageName: 'UP主页' }
    },
    {
      name: 'follow',
      path: `/follow`,

      meta: { title: '关注', keepalive: true }
    },
    {
      name: 'myedit',
      path: `/myedit`,

      meta: { title: '编辑资料' }
    },
    {
      name: 'rank',
      path: `/home/rank`,

      meta: { keepalive: true, trackPageName: '排行榜' }
    },
    {
      name: 'video-hot',
      path: `/home/hot`,

      meta: { keepalive: true, title: '原创视频' }
    },
    {
      name: 'collect',
      path: `/collect`,

      meta: { keepalive: true, title: '男集' }
    },
    {
      name: 'collection-detail',
      path: `/collect/detail`,
      meta: { keepalive: true, title: '合集详情' }
    },

    {
      name: 'post-auth',
      path: `/post/auth`,
      meta: {
        trackPageName: '原创博主认证'
      }
    },
    {
      name: 'work',
      path: `/my/work`,
      meta: {
        keepalive: true,
        trackPageName: '我的作品'
      }
    },
    {
      name: 'income-detail',
      path: `/my/income-detail`,
      meta: {
        title: '收益明细'
      }
    },
    {
      name: 'forum',
      path: `/community/forum`,
      meta: {
        title: '',
        keepalive: true,
        trackPageName: '社区论坛'
      }
    },
    {
      name: 'home-resource',
      path: '/home/resource',
      meta: {
        keepalive: true,
        trackPageName: '色界'
      }
    },
    {
      name: 'home-anime',
      path: '/home/anime',
      meta: {
        keepalive: true,
        trackPageName: '男漫'
      }
    },
    {
      name: 'Tag',
      path: '/tag',
      meta: {
        keepalive: true,
        trackPageName: '标签'
      }
    },
    {
      name: 'checkin',
      path: '/checkin',
      meta: {
        keepalive: true,
        theme: {
          page: {
            backgroundColor: 'transparent',
            backgroundImage: 'none'
          }
        },
        trackPageName: ''
      }
    },
    {
      name: 'chat-room',
      path: '/chat/room',
      meta: {
        trackPageName: '聊天室'
      }
    },
    {
      name: 'live',
      path: '/home/live',
      meta: {
        keepalive: true,
        title: '直播',
        trackPageName: '直播'
      }
    },
    {
      name: 'male-beauty-category',
      path: '/home/male-beauty-category',
      meta: {
        keepalive: true,
        title: '男色',
        trackPageName: '男色'
      }
    },
    {
      name: 'live-player',
      path: '/player/live',
      meta: {
        keepalive: true,
        trackPageName: '直播详情'
      }
    },
    {
      name: 'game-detail',
      path: '/game/detail',
      meta: {
        keepalive: true,
        title: '',
        nav: {
          icon: 'share2',
          to: '/invite'
        },
        trackPageName: '黄游详情'
      }
    },
    {
      name: 'watched',
      path: '/my/watched',
      meta: { keepalive: true, title: '浏览记录' }
    },
    {
      name: 'publish-video',
      path: '/publish/video',
      meta: {
        keepalive: true,
        trackPageName: '发布视频'
      }
    },
    {
      name: 'video-rule',
      path: '/publish/video-rule',
      meta: {
        keepalive: true,
        title: '上传规则'
      }
    },
    {
      name: 'check-line',
      path: '/error/check-line',
      meta: {
        trackPageName: '线路检查'
      }
    },
    {
      name: 'timeout',
      path: '/error/timeout',
      meta: {
        trackPageName: '线路超时'
      }
    },
    {
      name: 'tiktok',
      path: '/tiktok',
      meta: {
        bottom: true,
        keepalive: true,
        trackPageName: '短视频'
      }
    },
    {
      name: 'discover-list',
      path: '/home/discover-list',
      meta: {
        keepalive: true,
        title: '发现精彩'
      }
    },
    {
      name: 'short-player',
      path: '/short-player',
      meta: { keepalive: true, trackPageName: '短视频播放' }
    },
    {
      name: 'search-result',
      path: '/search/result',
      meta: { keepalive: true, trackPageName: '搜索结果' }
    },
    {
      name: 'ai-index',
      path: '/ai/index',
      meta: {
        keepalive: true,
        title: 'AI科技',
        nav: {
          rightTitle: '我的记录',
          to: '/ai/record?_index=1'
        },
        trackPageName: 'AI科技'
      }
    },
    {
      name: 'ai-face',
      path: '/ai/face',
      meta: {
        keepalive: true,
        title: '图片换脸',
        nav: {
          rightTitle: '我的记录',
          to: '/ai/record?_index=1'
        }
      }
    },
    {
      name: 'ai-undress',
      path: '/ai/undress',
      meta: {
        keepalive: true,
        title: 'AI去衣',
        nav: {
          rightTitle: '我的记录',
          to: '/ai/record?_index=2'
        },
        trackPageName: 'AI去衣'
      }
    },
    {
      name: 'ai-magic',
      path: '/ai/magic',
      meta: {
        keepalive: true,
        title: 'AI魔法',
        nav: {
          rightTitle: '我的记录',
          to: '/ai/record?_index=3'
        },
        trackPageName: 'AI魔法'
      }
    },
    {
      name: 'replace-face',
      path: '/ai/replace',
      meta: {
        title: '',
        keepalive: true,
        trackPageName: '图片换脸',
        nav: {
          rightTitle: '我的记录',
          to: '/ai/record?_index=1'
        }
      }
    },
    {
      name: 'ai-record',
      path: '/ai/record',
      meta: {
        keepalive: true,
        title: '我的记录',
        trackPageName: '我的记录'
      }
    },
    {
      name: 'preview-face',
      path: '/ai/preview-face',
      meta: {
        title: '',
        trackPageName: '换脸预览'
      }
    },
    {
      name: 'webview',
      path: '/webview',
      meta: {
        trackPageName: 'webview',
        title: ''
      }
    }
  ],

  lines: ['https://api-xiaolan.iiwwdfn.cc/pwa.php'],
  // 接口配置
  api: {
    baseURL: 'https://api-xiaolan.iiwwdfn.cc/pwa.php',
    withCredentials: false,
    timeout: 50000,
    version: '4.9.7',
    contentType: 'application/x-www-form-urlencoded'
  },

  // 底部菜单
  navtar: {
    menu: [
      {
        title: '首页',
        value: 'home',
        icon: '/images/tabbar/index.png',
        iconselect: '/images/tabbar/indexActive.png',
        router: `/home`
      },
      {
        title: '短视频',
        value: 'tiktok',
        icon: '/images/tabbar/tiktok.png',
        iconselect: '/images/tabbar/tiktokActive.png',
        router: `/tiktok`
      },
      {
        title: '片库',
        value: 'original',
        icon: '/images/tabbar/original.png',
        iconselect: '/images/tabbar/originalActive.png',
        router: `/original`
      },
      {
        title: '社区',
        value: 'community',
        icon: '/images/tabbar/community.png',
        iconselect: '/images/tabbar/communityActive.png',
        router: `/community`
      },
      {
        title: '我的',
        value: 'my',
        icon: '/images/tabbar/user.png',
        iconselect: '/images/tabbar/userActive.png',
        router: `/my`
      }
    ]
  },

  tokenKey: '___USER__OAUTHID'
})
