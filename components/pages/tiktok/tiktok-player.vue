<script setup lang="ts">
import type { CommentItem, VideoItem } from '@types'
import type { Swiper as SwiperClass } from 'swiper'

import { Pagination, Virtual } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'

import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/virtual'

const props = withDefaults(
  defineProps<{
    active?: boolean
    index?: number
    items?: VideoItem[]
  }>(),
  {
    index: 0
  }
)

const emit = defineEmits<{
  load: []
}>()

type SwiperInstance = InstanceType<typeof SwiperClass>

let swiperRef: SwiperInstance | null = null
const activeIndex = defineModel<number>('playIndex', {
  default: 0
})

function setSwiperRef(swiper: SwiperInstance) {
  swiperRef = swiper
}

function onChange(swiper: SwiperInstance) {
  activeIndex.value = swiper.activeIndex
}
const modules = [Pagination, Virtual]
const __ = useNuxtApp()

function onReachEnd() {
  emit('load')
}

let searchHistory: string[] = []
function saveHistory(tag: string) {
  searchHistory.push(tag)

  localStorage.setItem(SEARCH_HISTORY_KEY, searchHistory.toString())
}
onActivated(() => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY)
  if (history) {
    searchHistory = [...history.split(',')]
  }
})

// 评论
// const { value: showComment, open } = useBoolean()

// const commentState = reactive<{ id: number | string; num: number }>({
//   id: '',
//   num: 0
// })
// function openCommentDialog(item: VideoItem) {
//   commentState.id = item.id
//   commentState.num = item.comment
//   open()
// }

// const submitRef = useTemplateRef('submitRef')
// function onReply(item: CommentItem) {
//   submitRef.value?.onReply(item)
// }

// const listRef = useTemplateRef('list')
// function refresh_comments() {
//   listRef.value?.refresh_data()
// }

const key = ref()
onBeforeMount(() => {
  nextTick(() => {
    setTimeout(() => {
      key.value = Math.random()
    }, 0)
  })
})
</script>

<template>
  <div class="van-safe-area-bottom container">
    <Swiper v-if="items?.length && key" direction="vertical" :add-slides-after="1" :add-slides-before="1"
      :modules="modules" :slides-per-view="1" :centered-slides="true" :space-between="0" virtual cache
      :initial-slide="props.index" class="mySwiper" @swiper="setSwiperRef" @slide-change="onChange"
      @reach-end="onReachEnd">
      <SwiperSlide v-for="(item, index) in items" :key="item.id" :virtual-index="index">
        <tiktok-detail :id="item.id" :data="item" :poster="item.cover_thumb_url"
          :active="props.active && activeIndex === index" @save-history="saveHistory" />
      </SwiperSlide>
    </Swiper>

    <!-- <van-popup v-model:show="showComment" teleport="body" position="bottom" :style="{ width: '100%', height: '60%' }">
      <div class="flex h-full flex-col">
        <h2 class="p-1 text-default">精彩评论({{ commentState.num }})</h2>
        <div class="scroll-container px-1">
          <dx-hoc-list ref="list" api="api/comments/list" :params="{ id: commentState.id }">
            <template #item="{ item }">
              <video-comment-item :key="item.id" :item="item" api="api/comments/liking" @reply="onReply" />
            </template>
</dx-hoc-list>
</div>
<video-comment :id="commentState.id" ref="submitRef" @comment="refresh_comments" />
</div>
</van-popup> -->
  </div>
</template>

<style lang="postcss" scoped>
.swiper {
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: #000;
}

.container {
  background-color: #000;
}
</style>
