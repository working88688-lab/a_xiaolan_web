/**
 * 路由管理器
 */

import type { RouterConfig } from '@nuxt/schema'
import { routerHandler } from '@plugins/routerPlugin'
import { createWebHashHistory } from 'vue-router'

export default <RouterConfig>{
  history: base => (process.client ? createWebHashHistory(base) : null),
  routes: _routes => routerHandler(useAppConfig().pages)
}
