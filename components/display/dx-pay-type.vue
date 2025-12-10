<script lang="tsx">
export default defineComponent({
  props: {
    coins: {
      type: Number,
      default: 0
    }
  },

  setup(props) {
    return () => (
      <span class={`rounded-sm px-0.5 text-mini text-white ${props.coins ? 'is-coin' : 'is-vip'}`}>
        {props.coins ? '金币' : 'VIP'}
      </span>
    )
  }
})
</script>

<style lang="postcss" scoped>
.is-vip {
  background: linear-gradient(to right, rgb(96, 205, 255), rgb(74, 168, 255));
}

.is-coin {
  background: linear-gradient(to right, rgb(255, 126, 96), rgb(255, 74, 74));
}
</style>
