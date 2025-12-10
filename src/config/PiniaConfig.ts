import Store from '~/src/store'

/**
 * desc: 全局数据状态配置
 * date: 2023.04.24
 */
export default defineNuxtPlugin(nuxtApp => {
  console.log(`【${process.client ? 'CSR' : 'SSR'}】@初始化数据状态完成~`)

  return {
    provide: {
      // 初始状态
      Store: Store(),
      // 全局变量
      GlobalObject: {
        // 资源临时缓存器
        _CACHE_IMAGES_MAPS: {},
        // 图片预览分组
        _IMAGE_PREVIE_GROUPS: new Map(),
        // 图片解密调度
        _IMAGE_DECRY_SCHEDULER: {},

        _BASE_URL: ''
      }
    }
  }
})
