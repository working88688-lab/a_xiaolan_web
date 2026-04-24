<template>
  <van-popup
    v-bind="$attrs"
    position="right"
    :lock-scroll="false"
    :style="{ width: '100% !important', height: '100%' }"
    teleport="body"
    class="story-reader-popup"
  >
    <div class="container">
      <div :class="['header', hide ? 'active' : '']">
        <div class="left" @click="onClose"><img src="~/assets/image/comics/arrow_back.png" /></div>
        <div class="title">{{ props.data?.title ?? '漫画阅读' }}</div>
        <div class="right"></div>
      </div>
      <div :class="['comisc-share-action', hide ? 'active' : '']">
        <div class="action" @click="onLikeComics">
          <img :src="props.data?.is_like === 1 ? DetailLikeActiveIcon : collectAction" />
        </div>
      </div>
      <div class="scroll-container" @touchmove="onTouchMove" @click="toggleHide">
        <scroll-list
          v-model:loading="loading"
          full-loading
          :is-empty="isEmpty"
          empty-tip="该漫画无法查看，没有漫画数据或需要权限"
        >
          <img v-for="(item, _index) in comicsList" :key="item.id" v-lazyLoad="item.img_url_full" alt="" />
        </scroll-list>
      </div>
      <div :class="['comisc-swiper', hide ? 'active' : '']">
        <div class="reader-bottom">
          <div class="action" @click="showDirectory = true">
            <div class="icon"><img src="~/assets/image/comics/directory_action.png" /></div>
            <div class="text">目录</div>
          </div>
          <div class="action" @click="handlePrev">
            <div class="icon"><img src="~/assets/image/comics/prev_action.png" /></div>
            <div class="text">上一章</div>
          </div>
          <div class="action" @click="handleNext">
            <div class="icon"><img src="~/assets/image/comics/next_action.png" /></div>
            <div class="text">下一章</div>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showDirectory"
      position="right"
      :lock-scroll="false"
      :style="{ width: '70%', height: '100%' }"
      teleport="body"
    >
      <div class="directory-container">
        <div class="directory-header">
          <div class="title">目录</div>
          <div class="close" @click="showDirectory = false">
            <img src="~/assets/image/comics/close.png" />
          </div>
        </div>
        <div class="scroll-container">
          <scroll-list>
            <div class="reader-directory-list">
              <div class="dx-list">
                <episode-icon
                  v-for="(item, _index) in props.data?.series"
                  :key="_index"
                  :data="props.data"
                  :index="item.episode"
                  :selected="item.episode === props.sid"
                  @click="onSelect(item, _index)"
                />
              </div>
            </div>
          </scroll-list>
        </div>
      </div>
    </van-popup>
  </van-popup>
</template>

<script setup lang="ts">
import type { ComicData, ComicItem, SeryItem } from '@types'
import { onSaveHistory } from '@utils/graphichistory'
import { useDebounceFn } from '@vueuse/core'
import collectAction from '~/assets/image/comics/collect_action.png'
import DetailLikeActiveIcon from '~/assets/image/comics/detail_like_active.png'

const props = defineProps<{
  data?: ComicData
  sid?: number
}>()
const emit = defineEmits<{
  'update:show': [e: boolean]
  like: [e?: any]
  select: [e: SeryItem, f: number]
  'update:history': [e?: any]
}>()

const showDirectory = ref(false)
const __ = useNuxtApp()
const hide = ref(false)
const comicsList = ref<ComicItem[]>([])
const current = computed(() => {
  return props.data?.series.findIndex(item => item.episode === props.sid) ?? -1
})

const isEmpty = ref(false)

function getComicTrackBase() {
  return {
    media_id: props.data?.media_id ?? '',
    comic_id: String(props.data?.id ?? ''),
    comic_title: props.data?.title ?? '',
    comic_type_id: props.data?.comic_type_id ?? '',
    comic_type_name: props.data?.comic_type_name ?? '',
    recommend_trace_id: props.data?.recommend_trace_id ?? '',
    comic_tag_key: props.data?.comic_tag_key ?? '',
    comic_tag_name: props.data?.comic_tag_name ?? '',
    page_no: props.sid ?? 0,
    read_progress: 0
  }
}

const onClose = () => {
  __.$Tracker.trackComicEvent({
    ...getComicTrackBase(),
    comic_behavior_key: 'comic_close',
    comic_behavior_name: '关闭'
  })
  emit('update:show', false)
}
const loading = ref(false)
const onRead = async () => {
  const params = {
    id: props.data!.id,
    s_id: props.sid
  }
  try {
    comicsList.value = []
    loading.value = true
    const { data } = await __.$Api.Comics.read(params)
    comicsList.value = [...data.data]
    const _isEmpty = data.data?.length === 0
    isEmpty.value = _isEmpty
    if (_isEmpty) {
      __.$Toast('该漫画无法查看，没有漫画数据或需要权限')
    } else {
      onSaveHistory(params)
      emit('update:history')
      __.$Tracker.trackComicEvent({
        ...getComicTrackBase(),
        comic_behavior_key: 'comic_view',
        comic_behavior_name: '阅读'
      })
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}
const onLikeComics = async () => {
  emit('like')
}
const toggleHide = () => {
  hide.value = !hide.value
}
const onSelect = async (item: SeryItem, index: number) => {
  showDirectory.value = false
  emit('select', item, index)
}
const onTouchMove = useDebounceFn(() => {
  if (!hide.value) {
    hide.value = true
  }
}, 50)
const handlePrev = async () => {
  if (props.data!.series.length > 0) {
    const seriesList = props.data!.series
    const newsNumb = current.value - 1
    if (seriesList.length === 1) {
      if (typeof seriesList[newsNumb] === 'undefined') {
        __.$Toast('该漫画只有一章')
      } else {
        const indexsData = seriesList[newsNumb]
        emit('select', indexsData, newsNumb)
      }
    } else {
      if (newsNumb >= 0) {
        if (typeof seriesList[newsNumb] === 'undefined') {
          __.$Toast('已经是第一章了哦')
        } else {
          const indexsData = seriesList[newsNumb]
          emit('select', indexsData, newsNumb)
        }
      } else {
        __.$Toast('已经是第一章了哦')
      }
    }
  }
}
const handleNext = async () => {
  if (props.data!.series?.length > 0) {
    const seriesList = props.data!.series
    const newsNumb = current.value + 1
    if (seriesList.length == 1) {
      if (typeof seriesList[newsNumb] === 'undefined') {
        __.$Toast('该漫画只有一章')
      } else {
        const indexsData = seriesList[newsNumb]
        emit('select', indexsData, newsNumb)
      }
    } else {
      if (newsNumb >= 0) {
        if (typeof seriesList[newsNumb] === 'undefined') {
          __.$Toast('已经是最后一章了哦')
        } else {
          const indexsData = seriesList[newsNumb]
          emit('select', indexsData, newsNumb)
        }
      } else {
        __.$Toast('已经是最后一章了哦')
      }
    }
  }
}
watch(
  () => props.sid,
  () => {
    onRead()
  }
)
</script>

<style lang="postcss" scoped>
@import '~/assets/styles/reader.css';
</style>
