// 路由鉴权中间件：未登录用户访问受保护页面时跳转至登录页
// 白名单路由前缀：无需登录即可访问
const PUBLIC_PATHS = [
  '/login',
  '/home',
  '/original',
  '/search',
  '/splash',
  '/error',
  '/comics',
  '/community',
  '/images',
  '/tiktok',
  '/story',
  '/category',
  '/tag',
  '/game',
  '/afilm-detail',
  '/original-detail',
  '/forum-detail',
  '/userdetail',
  '/post-detail',
  '/player',
  '/short-player',
  '/webview',
  '/app-center',
  '/dark-card',
  '/darkweb',
  '/invite'
]

export default defineNuxtRouteMiddleware(to => {
  const isPublic = PUBLIC_PATHS.some(prefix => to.path === prefix || to.path.startsWith(`${prefix}/`))
  if (isPublic) return

  const __ = useNuxtApp()
  if (!__.$Store.user.isLogin) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
