<script lang="tsx">
import type { BannerItem } from '@types'
import type { PropType } from 'vue'
import ScrollView from '@components/common/scroll-x-view.vue'
import { vTouchStopHorizontal } from '@utils/directives/v-touch-stop-horizontal'

export default defineComponent({
  directives: {
    myTouch: vTouchStopHorizontal
  },

  props: {
    list: {
      type: Array as PropType<BannerItem[]>,
      default: () => []
    }
  },
  setup(props, { slots }) {
    const col = computed(() => {
      if (props.list) {
        return Math.max(Math.ceil(props.list.length / 2), 5)
      }

      return 0
    })

    const rearrangeArray = computed(() => {
      const arr = [...props.list]
      const firstRow = []
      const secondRow = []
      for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
          firstRow.push(arr[i])
        } else {
          secondRow.push(arr[i])
        }
      }
      // 修改原数组内容
      for (let i = 0; i < arr.length; i++) {
        if (i < firstRow.length) {
          arr[i] = firstRow[i]
        } else {
          arr[i] = secondRow[i - firstRow.length]
        }
      }

      return arr
    })
    const scrollRef = useTemplateRef<InstanceType<typeof ScrollView>>('scroll')

    watch(
      () => props.list,
      async () => {
        await nextTick()
        scrollRef.value?.refresh()
      }
    )

    const { config } = storeToRefs(useGlobalStore())

    const renderIconSwiper = () => {
      return (
        <div
          class='icon-container'
          style={{
            '--col-num': col.value,
            '--gap-num': col.value - 1
          }}
          v-myTouch
        >
          <ScrollView ref='scroll' scrollbar={props.list?.length > 10}>
            <div class='icon-container-scrollbar flex flex-wrap'>
              {rearrangeArray.value.map(item => {
                return (
                  <dx-ad-link key={item.id} class='icon-ad-container' data={item}>
                    <div class='flex-col-center'>
                      <div class='img-container overflow-hidden rounded-sm'>
                        <dx-image fit='fill' src={item.img_url} alt={item.title} />
                      </div>
                      <span class='mt-0.5 max-w-full truncate text-mini'>{item.title}</span>
                    </div>
                  </dx-ad-link>
                )
              })}
            </div>
          </ScrollView>
        </div>
      )
    }

    return () => {
      return props.list?.length > 0 ? renderIconSwiper() : null
    }
  }
})
</script>

<style lang="postcss" scoped>
.icon-container {
  --size: 62px;
  --gap: 11px;

  width: 100%;
  .icon-container-scrollbar {
    gap: 0 var(--gap);
    width: calc(var(--size) * var(--col-num) + var(--gap-num) * var(--gap));
  }
}
.img-container {
  width: var(--size);
  height: var(--size);
}
.icon-ad-container {
  width: var(--size);
  margin-bottom: var(--gap);
}
</style>
