<template>
  <van-popup
    v-bind="$attrs"
    position="right"
    :lock-scroll="false"
    :style="{ width: '100% !important', height: '100%' }"
    teleport="body"
    class="story-reader-popup"
    :overlay="false"
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
          :is-ready="!loading"
          empty-tip="该漫画无法查看，没有漫画数据或需要权限"
        >
          <div v-if="story?.url_full && !loading" v-textLoad="story?.url_full" class="dx-list" :style="themes"></div>
        </scroll-list>
      </div>
      <div :class="['comisc-swiper', hide ? 'active' : '']">
        <div class="reader-bottom">
          <div class="action" @click="showSetting = true">
            <div class="icon"><img src="~/assets/image/comics/setting_action.png" /></div>
            <div class="text">设置</div>
          </div>

          <div class="action" @click="handlePrev">
            <div class="icon"><img src="~/assets/image/comics/prev_action.png" /></div>
            <div class="text">上一章</div>
          </div>
          <div class="action" @click="showDirectory = true">
            <div class="icon"><img src="~/assets/image/comics/directory_action.png" /></div>
            <div class="text">目录</div>
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
              <story-icon
                v-for="(item, _index) in props.data?.series"
                :key="_index"
                :data="props.data"
                :index="item.series"
                :item="item"
                :selected="item.series === props.sid"
                @click.stop="onSelect(item, _index)"
              />
            </div>
          </scroll-list>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showSetting" class="story-popup" :overlay="false" :lock-scroll="false" teleport="body">
      <div class="novel-theme">
        <div class="theme-content">
          <div v-for="(item, _index) in theme" :key="_index" class="item" :style="item" @click="onChangeTheme(item)">
            A
          </div>
        </div>
        <div class="theme-fontsize">
          <div v-for="(item, _index) in fontList" :key="_index" class="item" :style="item" @click="onChangeFont(item)">
            A
          </div>
        </div>
      </div>
    </van-popup>
  </van-popup>
</template>

<script setup lang="ts">
import type { StoryData, StoryItem } from '@types'
import { onSaveHistory } from '@utils/graphichistory'
import { useDebounceFn } from '@vueuse/core'
import collectAction from '~/assets/image/comics/collect_action.png'
import DetailLikeActiveIcon from '~/assets/image/comics/detail_like_active.png'

const props = defineProps<{
  data?: StoryData
  sid?: number
}>()
const emit = defineEmits<{
  'update:show': [e: boolean]
  like: [e?: any]
  select: [e: StoryItem, f: number]
  'update:history': [e?: any]
}>()

const __ = useNuxtApp()
const showDirectory = ref(false)
const showSetting = ref(false)
const hide = ref(false)
const story = ref<StoryItem>({} as unknown as StoryItem)
const current = computed(() => {
  return props.data?.series.findIndex(item => item.series === props.sid) ?? -1
})
const theme = [
  {
    color: '#333333',
    backgroundColor: '#f5eacc'
  },
  {
    color: '#333333',
    backgroundColor: '#e6f2e6'
  },
  {
    color: '#333333',
    backgroundColor: '#e4f1f5'
  },
  {
    color: '#999999',
    backgroundColor: '#191b1c'
  }
]
const fontList = [{ fontSize: '0.4rem' }, { fontSize: '0.45rem' }, { fontSize: '0.5rem' }, { fontSize: '0.6rem' }]
const isEmpty = ref(false)
const onClose = () => {
  emit('update:show', false)
  showSetting.value = false
}
const themes = ref({ color: '#333333', backgroundColor: '#f5eacc', fontSize: '0.4rem' })
const loading = ref(false)
const onRead = async () => {
  const params = {
    id: props.data!.id,
    s_id: props.sid
  }
  try {
    story.value = {} as unknown as StoryItem
    loading.value = true
    const { data } = await __.$Api.Story.read(params)
    story.value = {
      ...data
    }
    data
    const _isEmpty = !data
    isEmpty.value = _isEmpty
    if (_isEmpty) {
      __.$Toast('该漫画无法查看，没有漫画数据或需要权限')
    } else {
      onSaveHistory(params, 'story')
      emit('update:history')
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
  onLoadTheme()
}
const onLikeComics = async () => {
  emit('like')
}
const toggleHide = () => {
  hide.value = !hide.value
  showSetting.value = false
}
const onSelect = async (item: StoryItem, index: number) => {
  showDirectory.value = false
  emit('select', item, index)
  //   await nextTick()
  //   onRead()
}
const onTouchMove = useDebounceFn(() => {
  if (!hide.value) {
    hide.value = true
  }
  showSetting.value = false
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
        await nextTick()
        onRead()
      }
    } else {
      if (newsNumb >= 0) {
        if (typeof seriesList[newsNumb] === 'undefined') {
          __.$Toast('已经是第一章了哦')
        } else {
          const indexsData = seriesList[newsNumb]
          emit('select', indexsData, newsNumb)
          await nextTick()
          onRead()
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

const onChangeTheme = value => {
  localStorage.setItem('Blue_Novel_Theme', JSON.stringify({ ...themes.value, ...value }))
  themes.value = {
    ...themes.value,
    color: value.color,
    backgroundColor: value.backgroundColor
  }
}

const onChangeFont = value => {
  localStorage.setItem('Blue_Novel_Theme', JSON.stringify({ ...themes.value, ...value }))
  themes.value = {
    ...themes.value,
    fontSize: value.fontSize
  }
}

const onLoadTheme = () => {
  const blues = localStorage.getItem('Blue_Novel_Theme')
  if (!blues) {
    localStorage.setItem('Blue_Novel_Theme', JSON.stringify(themes.value))
  } else {
    const newObject = JSON.parse(blues)
    if ('color' in newObject) {
      themes.value = {
        ...newObject
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
