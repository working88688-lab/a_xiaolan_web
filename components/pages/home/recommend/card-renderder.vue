<script lang="tsx">
import type { RecTabItem, VideoItem } from '@types'
import type { PropType } from 'vue'

import { vTouchStopHorizontal } from '@utils/directives/v-touch-stop-horizontal'

import VideoCard from '@components/my/video-card.vue'

import Swiper from '@components/pages/home/recommend/card-swiper.vue'

export default defineComponent({
  directives: { custom: vTouchStopHorizontal },
  props: {
    item: {
      type: Object as PropType<RecTabItem>,
      default: () => { }
    },
    replaceApi: {
      type: Function
    }
  },
  emits: ['replace'],
  setup(props, { emit }) {
    const item = props.item

    const loading = ref(false)
    const _replaceApi = async (id: number | string) => {
      if (props.replaceApi) {
        try {
          loading.value = true
          const res = await props.replaceApi({
            id
          })

          emit('replace', res.data.list)
        } catch (error) {
        } finally {
          loading.value = false
        }
      }
    }

    const to =
      item.type === 5
        ? navigate(
          item.type,
          `/tag?_type=home&${format_url_params({
            construct_id: item.id,
            has_sort: item.has_tab,
            title: item.title
          })}`
        )
        : `/tag?_type=home&${format_url_params({
          construct_id: item.id,
          has_sort: item.has_tab,
          title: item.title
        })}`
    const renderTitle = () => {
      const cellSlots = {
        title: () => {
          return (
            <div class='flex items-center whitespace-nowrap'>
              {item.icon && <dx-image class='mr-0.5 !h-[26px] !w-[26px]' src={item.icon}></dx-image>}
              <span class='mr-0.5 text-base7'>{item.title}</span>
              <span class='text-mini text-base3'>{item.sub_title}</span>
            </div>
          )
        }
      }
      return (
        <van-cell
          v-slots={cellSlots}
          class='!sticky left-0 top-[-1px] z-10'
          value='查看更多'
          is-link
          border={false}
          to={to}
        ></van-cell>
      )
    }
    //  2 x 2
    const renderTwoRowTwoCol = (count = 4) => {
      return (
        <>
          {renderTitle()}
          <div class='dx-grid-2 mb-1 pb-0.5'>
            {props.item.list.slice(0, count).map(item => {
              return <VideoCard key={item.id} item={item} lines></VideoCard>
            })}
            {props.item.has_hyh === 1 && (
              <div class='col-span-2 grid grid-cols-2 gap-1'>
                <dx-button
                  color='#F3F8FF'
                  loading={loading.value}
                  loadingText='加载中...'
                  onClick={() => _replaceApi(props.item.id)}
                >
                  <div class='flex-center text-normal text-base7'>
                    <nuxt-icon name='refresh' class='mr-0.5' filled></nuxt-icon>
                    换一换
                  </div>
                </dx-button>

                <dx-button color='#F3F8FF' to={to}>
                  <div class='flex-center text-normal text-base7'>
                    <nuxt-icon name='menu' class='mr-0.5' filled></nuxt-icon>
                    查看更多
                  </div>
                </dx-button>
              </div>
            )}
          </div>
        </>
      )
    }

    const rendeThereRowTwoCol = () => renderTwoRowTwoCol(6)

    // 横屏水平滚动
    const renderHorizontalSwiper = () => {
      return (
        <div class='mb-1'>
          {renderTitle()}
          <div class='px-1.5'>
            <Swiper class='horizontal-swiper' list={item.list}></Swiper>
          </div>
        </div>
      )
    }

    // 一大，4小横向滚动
    const renderStyleOne = () => {
      return (
        <div class='mb-1'>
          {renderTitle()}
          <div class='px-1.5'>
            <VideoCard class='mb-1' item={item.list[0]}></VideoCard>
            <Swiper class='style-one-swiper' list={item.list.slice(1, item.list.length)}></Swiper>
          </div>
        </div>
      )
    }

    // 一大，四小
    const renderBigStyle = () => {
      return (
        <div class='mb-1'>
          {renderTitle()}
          <div class='px-1.5'>
            <VideoCard class='mb-1' item={item.list[0]}></VideoCard>
            <div class='mb-1 grid grid-cols-2 gap-1 pb-0.5'>
              {props.item.list.slice(0, 4).map(item => {
                return <VideoCard key={item.id} item={item} lines></VideoCard>
              })}

              <div class='col-span-2 grid grid-cols-2 gap-1'>
                <dx-button
                  color='#F3F8FF'
                  loading={loading.value}
                  loadingText='加载中...'
                  onClick={() => _replaceApi(props.item.id)}
                >
                  <div class='flex-center text-normal text-base7'>
                    <nuxt-icon name='refresh' class='mr-0.5' filled></nuxt-icon>
                    换一换
                  </div>
                </dx-button>

                <dx-button color='#F3F8FF' to={to}>
                  <div class='flex-center text-normal text-base7'>
                    <nuxt-icon name='menu' class='mr-0.5' filled></nuxt-icon>
                    查看更多
                  </div>
                </dx-button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    const renderMap = {
      0: renderTwoRowTwoCol,
      1: renderStyleOne,
      2: renderBigStyle,
      3: rendeThereRowTwoCol,
      4: renderHorizontalSwiper,
      5: renderTwoRowTwoCol
    }
    return () => {
      return renderMap[item.show_style]?.()
    }
  }
})
</script>

<style lang="postcss" scoped>
.horizontal-swiper {
  --swiper-width: 320px;
}

.style-one-swiper {
  --swiper-width: 144px;
}
</style>
