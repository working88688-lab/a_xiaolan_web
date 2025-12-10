<script setup lang="ts">
import BScroll from '@better-scroll/core'

import ScrollBar from '@better-scroll/scroll-bar'

const props = withDefaults(
  defineProps<{
    betterOption?: Record<any, any>
    scrollbar?: boolean
  }>(),
  {
    betterOption: () => ({}),
    scrollbar: false
  }
)

BScroll.use(ScrollBar)

// 变量
let scrollerInstance: InstanceType<typeof BScroll> | null = null
const scrollRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

const { isDesktop } = useDevice()
const horizontalRef = useTemplateRef('horizontal')
function initScroll() {
  if (scrollRef.value) {
    const option = {
      probeType: 0,
      click: true,
      useTransition: true,
      bounce: {
        left: false,
        right: false
      },
      scrollbar: props.scrollbar
        ? {
            fade: false,
            customElements: [horizontalRef.value],
            interactive: false
          }
        : false,
      scrollX: true,
      scrollY: false,
      eventPassthrough: 'vertical',
      bindToWrapper: !isDesktop,
      stopPropagation: true,
      ...props.betterOption
    }

    scrollerInstance = new BScroll(scrollRef.value, option)
  }
}
function refresh() {
  scrollerInstance?.refresh()
}
function scrollTo(x: number, y: number) {
  scrollerInstance?.scrollTo(x, y)
}

function scrollToElement(el: HTMLElement, time: number, offsetX: number, offsetY: number) {
  scrollerInstance?.scrollToElement(el, time, offsetX, offsetY)
}

onMounted(async () => {
  await nextTick()
  initScroll()
})

onBeforeUnmount(() => {
  scrollerInstance?.destroy()
  scrollerInstance = null
})

// 兜底，防止某些极端情况better-scroll计算还是有问题，交给用户手动去刷新一次
defineExpose({
  refresh,
  scrollTo,
  scrollToElement
})
</script>

<template>
  <div ref="scrollRef" class="dx-scroll-wrapper">
    <div ref="contentRef" class="dx-scroll-content">
      <slot />
    </div>
    <div
      v-show="props.scrollbar"
      ref="horizontal"
      :class="{
        '!hidden': !props.scrollbar
      }"
      class="custom-horizontal-scrollbar"
    >
      <div class="custom-horizontal-indicator" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.dx-scroll-wrapper {
  font-size: 14px;
  position: relative;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  touch-action: pan-y;
  .custom-horizontal-scrollbar {
    position: absolute;
    left: 50%;
    bottom: 1px;
    width: 50px;
    height: 4px;
    border-radius: 50px;
    transform: translateX(-50%) translateZ(0);
    background-color: rgba(204, 204, 204, 0.7);
  }
  .custom-horizontal-indicator {
    height: 100%;
    width: 14px;
    border-radius: 50px;
    background-color: var(--dx-primary-color);
  }
}
</style>
