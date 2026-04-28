// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import minimist from 'minimist'
const args = minimist(process.argv.slice(2))
const isDebugMode = args.mode === 'debug' || process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  debug: isDebugMode,

  router: {
    options: {
      hashMode: true
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '小蓝轻量版',
      short_name: '小蓝轻量版',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      prefer_related_applications: false,
      start_url: '.',
      icons: [
        {
          src: '/logo.png',
          sizes: '128x128',
          type: 'image/png'
        }
      ]
    },
    devOptions: {
      enabled: true
    },
    injectRegister: false,
    client: {
      registerPlugin: false
    }
  },
  ssr: false,
  devtools: { enabled: false },
  // 设置别名
  alias: {
    '@': fileURLToPath(new URL('.', import.meta.url)),
    '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
    '@plugins': fileURLToPath(new URL('./src/plugins', import.meta.url)),
    '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
    '@styles': fileURLToPath(new URL('./assets/styles', import.meta.url)),
    '@components': fileURLToPath(new URL('./components', import.meta.url)),
    '@types': fileURLToPath(new URL('./types', import.meta.url)),
    '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    '@utils': fileURLToPath(new URL('./utils', import.meta.url))
  },

  // 组件导入
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  // 安装模块
  modules: [
    '@vant/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/device',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-icons',
    '@vite-pwa/nuxt'
    // '@nuxtjs/i18n',
  ],

  // 国际化  有需求再引入
  // i18n: {
  //   vueI18n: '~/src/plugins/i18nPlugin'
  // },

  // 全局样式
  css: ['@styles/index.less', '@styles/vant.less', '@styles/common.less'],

  // 安装插件
  plugins: [
    // 基础配置
    { src: '@config/VantConfig' },
    { src: '@plugins/encryDecryPlugin' },
    { src: '@config/PiniaConfig' },
    { src: '@plugins/decryWorker' },
    { src: '@plugins/localStoragePlugin', mode: 'client' },
    { src: '@config/ResizeConfig', mode: 'client' },

    // 接口配置
    { src: '@config/ApiConfig/utils/crypto' },
    { src: '@config/ApiConfig/utils/oauth' },
    { src: '@config/ApiConfig/http/index' },
    { src: '@config/ApiConfig' },
    { src: '@plugins/report-plugin', mode: 'client' },
    { src: '@plugins/web-sdk-plugin', mode: 'client' },
    { src: '@config/ApiConfig/global' },

    // 工具配置
    { src: '@config/DirectConfig', mode: 'client' },
    { src: '@config/ImageDecryp' },
    { src: '@plugins/utilPlugin' },
    { src: '@plugins/emitterPlugin' },
    { src: '@plugins/imageCompimagePlugin', mode: 'client' },
    { src: '@plugins/analyticsPlugin' },
    // { src: '@plugins/testPlugin.ts' },

    // 初始启动器
    { src: '@config/NuxtInitConfig' }

    // { src: '@plugins/errorPlugin' }
  ],

  // 模板配置
  app: {
    head: {
      title: '小蓝视频',
      htmlAttrs: {
        lang: 'en',
        id: 'mobile',
        style: 'font-size: 37.5px;'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover'
        },
        {
          name: 'description',
          content:
            '小藍視頻,小蓝视频,男男做爱,男男a片,男男性爱,男男色情,男男av,gay,gay做爱,gay片,gay视频,gay色情片,gay成人片,色0,bl色情,男同做爱,男生自慰,父子乱伦,精牛,肌肉男,彩虹旗,blued,无需翻墙的男同社區APP，千萬哥哥們的交心軟件！性爱虐恋 剧情影视 激情钙片 同城交友 同志 猛男 小鲜肉 军警 制服  大骚鸡 这里应有尽有！更多精彩尽在小蓝片！。下载小蓝片app安卓及IOS版本，请认准小蓝片官网！'
        },
        {
          name: 'keywords',
          content:
            '小藍視頻,小蓝视频,男男做爱,男男a片,男男性爱,男男色情,男男av,gay,gay做爱,gay片,gay视频,gay色情片,gay成人片,色0,bl色情,男同做爱,男生自慰,父子乱伦,精牛,肌肉男,彩虹旗,blued'
        },
        { name: 'og:title', content: '小蓝视频' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'index,follow' },
        { name: 'referrer', content: 'same-origin' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        // { rel: 'sitemap', type: 'application/xml', href: 'https://haij.cc/sitemap.xml' }
      ]
      // script: [
      //   {
      //     src: 'https://cdn.jsdelivr.net/npm/eruda'
      //   },
      //   {
      //     innerHTML: `eruda.init()`,
      //     type: 'text/javascript'
      //   }
      // ]
    }
  },

  // 钩子处理
  hooks: {},

  vite: {
    esbuild: {
      drop: isDebugMode ? [] : ['console', 'debugger']
    },
    optimizeDeps: {
      exclude: ['@jsquash/jpeg']
    },
    plugins: [
      {
        name: 'vite-plugin-glob-transform',
        transform(code: string, id: string) {
          if (id.includes('nuxt-icons')) {
            return code.replace(/as:\s*['"]raw['"]/g, 'query: "?raw", import: "default"')
          }
          return code
        }
      }
    ]
  },

  build: {
    analyze: {
      title: 'Rollup Visualizer',
      open: true,
      gzipSize: true
    }
  },

  postcss: {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*', '!border-top-width', '!border-bottom-width', '!border', '!border-top', '!border-bottom'],
        minPixelValue: 2
      },
      tailwindcss: {},
      autoprefixer: {},
      'postcss-import': {},
      'tailwindcss/nesting': {}
    }
  },
  imports: {
    dirs: [
      `${fileURLToPath(new URL('./src/store', import.meta.url))}`,
      `${fileURLToPath(new URL('./database', import.meta.url))}`
    ],
    presets: [
      {
        from: 'dayjs',
        imports: ['dayjs']
      }
    ]
  },
  nitro: {
    compressPublicAssets: {
      gzip: true
    }
    // prerender: {
    //   routes: ['/home', '/original']
    // }
  }
})
