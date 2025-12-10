<script lang="tsx">
import comicsfreeicon from '~/assets/image/comics/comics_free.png'
import comicsvipicon from '~/assets/image/comics/comics_vip.png'
import comicsBuyIcon from '~/assets/image/comics/needbuy.png'
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: undefined
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    renderIcon(_index: number) {
      const data = this.$props.data
      const index = _index

      if (data.series.length == 1) {
        if (data.coins > 0) {
          return <img class='icon' src={comicsBuyIcon} />
        } else {
          return <img class='icon' src={comicsvipicon} />
        }
      }

      if (data.series.length > 1 && data.series.length < 5) {
        if (data.coins > 0) {
          return <img class='icon' src={comicsBuyIcon} />
        } else {
          return <img class='icon' src={comicsvipicon} />
        }
      }

      if (data.series.length >= 5 && data.series.length < 10) {
        if (index > 0) {
          if (data.coins > 0) {
            return <img class='icon' src={comicsBuyIcon} />
          } else {
            return <img class='icon' src={comicsvipicon} />
          }
        } else {
          return <img class='icon' src={comicsfreeicon} />
        }
      }

      if (data.series.length >= 10) {
        if (index > 2) {
          if (data.coins > 0) {
            return <img class='icon' src={comicsBuyIcon} />
          } else {
            return <img class='icon' src={comicsvipicon} />
          }
        } else {
          return <img class='icon' src={comicsfreeicon} />
        }
      }

      return null
    }
  },

  render() {
    const index = this.$props.index || -1

    return (
      <div
        class={{
          'directory-item': true,
          'is-selected': this.$props.selected
        }}
      >
        <div>第{index}话</div>
        {this.renderIcon(index)}
      </div>
    )
  }
})
</script>
<style lang="less" scoped>
.directory-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 0.36rem;
  padding: 0.4rem 0.1rem;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  &:last-child {
    border: none;
  }
  .title {
    flex: 1;
    padding: 0 0.2rem;
  }
  .icon {
    height: 0.4rem;
  }
  &.is-selected {
    background: linear-gradient(to left, #6de6fb, #428af7);
    color: white;
  }
}
.directory-item {
  text-align: center;
  color: #333333;
  background-color: #f6f7f8;
  border: 0.5px solid #e3e4e5;
  border-radius: 5px;
  padding: 0.25rem 0;
  font-size: 0.36rem;
  position: relative;

  .icon {
    position: absolute;
    right: 0;
    top: -0.2rem;
    height: 0.4rem;
    width: 36px;
  }
}
</style>
