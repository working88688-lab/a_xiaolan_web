<script lang="tsx">
export default defineComponent({
  setup() {
    const _route = useRoute()
    const globalStore = useGlobalStore()

    const title = computed(() => {
      return globalStore.navbarTitle ? globalStore.navbarTitle : ((_route.meta.title as unknown as string) ?? '')
    })
    const { backgroundColor } = _route.meta.nav || {}

    const slots = {
      right: () => {
        if (_route.meta.nav) {
          const { to, icon, rightTitle } = _route.meta.nav

          return (
            <nuxt-link to={to}>{icon ? <nuxt-icon class='text-4xl' name={icon}></nuxt-icon> : rightTitle}</nuxt-link>
          )
        }
      },
      title: () => {
        return title.value
      }
    }
    return () => (
      <div class='nav-top-bar'>
        <dx-navbar
          style={{ backgroundColor }}
          v-slots={slots}
          title={title.value}
          border={false}
          left-arrow
        ></dx-navbar>
      </div>
    )
  }
})
</script>
