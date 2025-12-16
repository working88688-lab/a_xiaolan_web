<template>
  <van-tabs ref="tabsRef" line-width="0" line-height="0" lazy-render swipeable animated :shrink="center" :class="[
    classNames,
    {
      'zero-line': zeroLine
    }
  ]">
    <template #nav-left>
      <slot name="left"></slot>
    </template>
    <slot></slot>
    <template #nav-right>
      <slot name="right"></slot>
    </template>
    <template #nav-bottom>
      <slot name="bottom"></slot>
    </template>
  </van-tabs>
</template>

<script setup lang="ts">
import { createNamespace } from '@utils/create'
import { useDebounceFn, useEventListener } from '@vueuse/core'
import type { TabsInstance } from 'vant'

const props = defineProps<{
  theme?: 'button'
  center?: boolean
  sticky?: boolean
  static?: boolean
  stopPropagation?: boolean
  gap?: string
}>()

const tabsRef = ref<TabsInstance>()
const [name, bem] = createNamespace('custom-tabs')

const classNames = computed(() => {
  return [bem(props.theme), bem({ center: props.center, sticky: props.sticky, static: props.static })]
})
const attrs = useAttrs()

const zeroLine = computed(() => {
  const w = attrs['line-width']
  return w === 0 || w === '0' || w === '0px'
})
const resize_handler = useDebounceFn(() => {
  tabsRef.value?.resize()
}, 100)
useEventListener(window, 'resize', resize_handler)

const handle_touch_move = (event: Event) => {
  event.stopPropagation()
}

if (props.stopPropagation) {
  onMounted(() => {
    tabsRef.value?.$el.addEventListener('touchmove', handle_touch_move)
  })

  onBeforeUnmount(() => {
    tabsRef.value?.$el.removeEventListener('touchmove', handle_touch_move)
  })
}

defineExpose({
  resize() {
    tabsRef.value?.resize()
  }
})
</script>

<style lang="postcss">
.dx-custom-tabs {
  --van-tabs-nav-background: tranparent;
  --dx-light-blue-color: #e6f4ff;

  .van-tabs__wrap {
    margin-bottom: v-bind(gap);
  }

  .van-tab {
    padding: 0 9px;
  }

  .van-tab {
    transition: transform 0.2s;
  }

  .van-tab--active {
    color: #151515;
    font-weight: 600;
  }

  &__button>.van-tabs__wrap {
    .van-tab {
      padding: 0;
      font-size: 14px;

      .van-tab__text {
        padding: 4px 16px;
        font-size: 13px;
        line-height: 22px;
      }
    }

    .van-tabs__line {
      width: 0;
      height: 0;
    }

    .van-tab--active {
      .van-tab__text {
        color: var(--dx-primary-color);
        background: var(--dx-light-blue-color);
        border-radius: 16px;
      }
    }
  }

  &--static>.van-tabs__wrap {
    .van-tabs__nav {
      /* padding-bottom: 0; */
      align-items: center;
    }
  }

  &.text-lg>.van-tabs__wrap {
    .van-tab__text {
      font-size: 17px;
    }
  }

  &.text-medium>.van-tabs__wrap {
    .van-tab__text {
      font-size: 15px;
    }
  }

  &.text-normal>.van-tabs__wrap {
    .van-tab__text {
      font-size: 14px;
    }
  }

  &.text-mini>.van-tabs__wrap {
    .van-tab__text {
      font-size: 13px;
    }
  }

  &.first-no-padding>.van-tabs__wrap {
    .van-tab:first-child {
      margin-left: -8px;
    }
  }

  &.zero-line {
    .van-tabs__line {
      width: 0;
      height: 0;
    }
  }
}

.dx-custom-tabs--center>.van-tabs__wrap {
  .van-tabs__nav {
    justify-content: center;
  }
}

.dx-custom-tabs--sticky>.van-tabs__wrap {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 111;
}
</style>
