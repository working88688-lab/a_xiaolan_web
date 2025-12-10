export default defineNuxtRouteMiddleware((to, from) => {
  if (to.meta?.keepalive) {
    const __ = useNuxtApp()

    __.$Store.history.addKeepaLive(to.name)
  }
})
