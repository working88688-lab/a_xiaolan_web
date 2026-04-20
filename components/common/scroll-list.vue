<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    pullup?: () => Promise<any>
    pullDownRefresh?: () => Promise<any>
    isEmpty?: boolean
    emptyTip?: string
    loadingTip?: string
    betterOption?: Record<any, any>
    isEnd?: boolean // 是否已经加载结束
    endText?: string // 结束提示语
    position?: 'position' | 'static'
    isReady?: boolean // 是否准备好列表内容
    fullLoading?: boolean // 是否全屏展示loading
    color?: string // 字体颜色
    loadingColor?: string //loading颜色
    active?: boolean // 当前 滚动条是否激活，没激活无需refresh
    showEnd?: boolean
    showEmpty?: boolean
    center?: boolean
    disabled?: boolean
    disabledRefresh?: boolean
  }>(),
  {
    pullup: undefined,
    pullDownRefresh: undefined,
    isEmpty: false,
    emptyTip: '什么都没有，好空虚啊',
    loadingTip: '正在获取数据',
    betterOption: () => ({}),
    isEnd: false,
    endText: '~~我也是有底线的~~',
    position: 'position',
    isReady: true,
    fullLoading: false,
    color: '#777',
    loadingColor: '#1989fa',
    active: true,
    showEnd: true,
    showEmpty: true,
    center: false,
    disabled: false
  }
)

const loading = defineModel('loading', { type: Boolean, default: false })
const refreshing = ref(false)
const error = defineModel('error', { type: Boolean, default: false })

const wrapperRef = ref()
const placeholderRef = ref()
const _refresh = () => {
  props.pullDownRefresh?.().finally(() => {
    refreshing.value = false
    // loading.value = false
  })
}

const scrollTo = (top: number) => {
  wrapperRef.value.scrollTop = top
}
const scrollToEnd = () => {
  placeholderRef.value.scrollIntoView({
    block: 'end'
  })
}
const getScrollTop = () => {
  return wrapperRef.value?.scrollTop
}
const _load = () => {
  loading.value = true
  props
    .pullup?.()
    .catch(() => {
      error.value = true
    })
    .finally(() => {
      nextTick(() => {
        loading.value = false
      })
    })
}

usePosition(wrapperRef)
defineExpose({
  getScrollTop,
  scrollTo,
  scrollToEnd
})
</script>
<template>
  <div
    ref="wrapperRef"
    style="height: 100%; overflow: auto"
    class="scroller"
    :class="{ 'is-loading': loading, 'is-empty': props.isEmpty && center }"
  >
    <van-pull-refresh
      v-model="refreshing"
      class="scroller-refresh"
      pulling-text="继续下拉可刷新页面"
      loosing-text="可以松手了"
      loading-text="正在获取数据"
      :disabled="!props.pullDownRefresh || props.disabledRefresh"
      @refresh="_refresh"
    >
      <template #pulling>
        <div class="pull-down flex-center text-primary">
          <nuxt-icon class="text-3xl" name="arrow-down"></nuxt-icon>
          下拉可刷新页面
        </div>
      </template>
      <template #loosing>
        <div class="pull-up flex-center text-primary">
          <nuxt-icon class="text-3xl" name="arrow-up"></nuxt-icon>
          释放即可刷新
        </div>
      </template>
      <div
        v-show="loading && !props.pullup && !refreshing"
        class="loading-container"
        data-loading="1"
        :class="{
          'is-full': props.fullLoading
        }"
      >
        <van-loading size="24px" class="loading-icon" type="spinner" />
        <span class="loading-text">{{ props.loadingTip }}</span>
      </div>
      <van-list
        v-model:error="error"
        :loading="loading"
        :disabled="props.disabled || !props.pullup"
        :immediate-check="false"
        :finished="props.isEnd"
        @load="_load"
      >
        <slot></slot>
        <template #loading>
          <div v-show="!refreshing" class="loading-container">
            <van-loading size="24px" class="loading-icon" type="spinner" />
            <span class="loading-text">{{ props.loadingTip }}</span>
          </div>
        </template>

        <template #finished>
          <slot v-if="props.isEnd && !props.isEmpty && showEnd && !refreshing" name="finished">
            <div class="end-tip">{{ props.endText }}</div>
          </slot>
        </template>

        <dx-empty
          v-if="props.isEmpty && !loading && !refreshing && showEmpty"
          :image-size="['8.6rem', '5rem']"
          :description="error ? '' : props.emptyTip"
        >
          <template #empty>
            <slot name="empty"></slot>
          </template>
        </dx-empty>

        <div ref="placeholderRef" class="custom-list-placeholder"></div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style lang="less" scoped>
.scroller-refresh {
  min-height: 100%;
}

:deep(.van-pull-refresh) {
  overflow: visible;
}

.scroller {
  --van-loading-text-color: var(--dx-primary-color);
  --van-loading-spinner-color: var(--dx-primary-color);
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: auto;

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    color: var(--dx-primary-color);

    &.is-full {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }

    .loading-text {
      margin-left: 4px;
    }
  }

  .end-tip {
    text-align: center;
    padding: 12px 0;
    color: #999;
  }
}
</style>
