/**
 * 路由管理
 */

// 生成
export const routerHandler = (baseRoutes: any) => {
  let routers: any = []
  const get_path = (_path: string) => {
    const paths = _path.split('/')
    return {
      file_path: paths.slice(1).filter(item => item)
    }
  }
  // 页面处理
  for (const route of baseRoutes) {
    const { name, path, meta } = route
    const { file_path } = get_path(path)

    if (name && path) {
      routers = [
        ...routers,
        {
          name,
          path,
          component: () => {
            const [tabName, moduleName] = file_path

            if (file_path.length === 0) {
              return import(`~/src/pages/${name as string}.vue`).then(r => r.default || r)
            }
            if (file_path.length === 1) {
              return import(`~/src/pages/${tabName}.vue`).then(r => r.default || r)
            }
            if (file_path.length === 2) {
              return import(`~/src/pages/${tabName}/${name}.vue`).then(r => r.default || r)
            }

            return import(`~/src/pages/${tabName}/${moduleName}/${name}.vue`).then(r => r.default || r)
          },
          meta: { ...meta, layout: 'mobile' }
        }
      ]
    }

    if (!name && path) {
      routers = [...routers, route]
    }
  }

  // 404
  routers.push({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import(`~/src/pages/error.vue`).then(r => r.default || r),
    meta: { layout: 'mobile', keepalive: false, bottom: true, top: false }
  })

  return routers
}
