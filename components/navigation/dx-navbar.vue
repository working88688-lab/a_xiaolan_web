<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, { slots, attrs }) {
    const router = useRouter()

    const _slots = {
      left: () => {
        return <van-icon class='text-4xl' size='0.6rem' name='arrow-left'></van-icon>
      }
    }
    return () => (
      <van-nav-bar
        v-slots={{ ..._slots, ...slots }}
        {...attrs}
        border={false}
        left-arrow
        onClickLeft={attrs.onClickLeft || router.back}
      ></van-nav-bar>
    )
  }
})
</script>

<style lang="postcss">
.van-nav-bar {
  color: #4d4d4d;
  font-weight: 500;

  .van-nav-bar__title {
    font-weight: 500;
  }
}
</style>
