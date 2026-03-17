<script setup lang="ts">
import { vSwipe } from '@utils/directives/v-swipe'

const props = withDefaults(
  defineProps<{
    listProps: any
    loading?: boolean
    isEmpty?: boolean
    isEnd?: boolean
    hasTabs?: boolean
    scrollHandler?: (e: number) => void
  }>(),
  {
    hasTabs: true
  }
)

const emit = defineEmits<{
  swipe: [e: 'left' | 'right']
}>()
const placeholderRef = useTemplateRef('placeholder')
const listRef = useTemplateRef('list')
const stickyRef = useTemplateRef('sticky')
const isReady = ref(false)
watchEffect(() => {
  if (props.listProps?.loading && !isReady.value) {
    setTimeout(() => {
      isReady.value = true
    }, 100)
  }
})

const { scrollTop } = useScrollTop(listRef, props.scrollHandler)

function resetScroll() {
  const scrollHeight = placeholderRef.value!.offsetTop + (stickyRef.value?.offsetHeight ?? 0)
  if (scrollHeight > 0 && scrollTop.value >= scrollHeight) {
    listRef.value?.scrollTo(scrollHeight)
  }
}

function scrollTo(e: number) {
  listRef.value?.scrollTo(e)
}
defineExpose({
  resetScroll,
  scrollTo
})

function onSwipe(d: 'left' | 'right') {
  emit('swipe', d)
}
</script>

<template>
  <dx-page-container :scroll-top="scrollTop">
    <template #default="{ height }">
      <scroll-list v-bind="listProps" ref="list">
        <div />
        <dx-spin v-show="!isReady" />
        <slot name="header" />
        <!-- 站位计算滚动高度用 -->
        <div ref="placeholder" />
        <div v-swipe="onSwipe" :style="{ minHeight: `${height}px` }">
          <div v-if="hasTabs" ref="sticky" class="tabs-stricky-bar">
            <slot name="tabs" />
          </div>
          <dx-spin v-show="props.loading" />
          <dx-empty v-show="props.isEmpty && isReady && !props.loading" class="mt-3" />
          <slot name="list" />

          <dx-end-tip v-show="isEnd && !isEmpty" />
        </div>
      </scroll-list>
    </template>
  </dx-page-container>
</template>

<style lang="postcss" scoped>
.tabs-stricky-bar {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
  padding: 6px 0;
  background-color: var(--dx-container-color);
}
</style>
