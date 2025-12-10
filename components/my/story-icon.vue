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
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    renderIcon(_index: number) {
      const { data, index = 0 } = this.$props
      const seriesList = data.series
      const coins = data.coins

      if (seriesList.length == 1 || (seriesList.length > 1 && seriesList.length <= 5)) {
        if (coins > 0) {
          return <img class='icon' src={comicsBuyIcon} />
        } else {
          return <img class='icon' src={comicsvipicon} />
        }
      }

      if (seriesList.length > 5 && seriesList.length < 10) {
        if (index > 0 && index <= 1) {
          return <img class='icon' src={comicsfreeicon} />
        } else {
          if (coins > 0) {
            return <img class='icon' src={comicsBuyIcon} />
          } else {
            return <img class='icon' src={comicsvipicon} />
          }
        }
      }

      if (seriesList.length >= 10) {
        if (index > 0 && index <= 2) {
          return <img class='icon' src={comicsfreeicon} />
        } else {
          if (coins > 0) {
            return <img class='icon' src={comicsBuyIcon} />
          } else {
            return <img class='icon' src={comicsvipicon} />
          }
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
        <div class='flex-1'>{this.$props.item.title}</div>
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
  align-items: center;
  position: relative;
  font-size: 0.36rem;
  padding: 0.4rem 0.1rem;
  border-bottom: 1px solid #ebebeb;
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
  text-align: left;
  color: #333333;
  border-bottom: 0.5px solid #e3e4e5;
  border-radius: 5px;
  padding: 16px 4px;
  font-size: 0.36rem;
  position: relative;
  cursor: pointer;
  .icon {
    height: 0.4rem;
    width: 36px;
  }
}
</style>
