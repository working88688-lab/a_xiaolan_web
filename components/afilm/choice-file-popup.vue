<template>
  <van-popup
    teleport="body"
    v-bind="$attrs"
    position="right"
    :lock-scroll="false"
    :style="{ width: '100%', height: '100%' }"
    @open="onOpen"
    @closed="onClosed"
  >
    <div class="container">
      <dx-navbar
        class="my-nav-bar"
        right-text="搜索"
        :border="false"
        title="选择视频"
        left-arrow
        @click-left="onClose"
        @click-right="onSearch"
      ></dx-navbar>
      <div class="seach_input_box">
        <input v-model="kwy" placeholder="输入标题名称搜索" />
      </div>
      <div class="scroll-container">
        <scroll-list v-model:loading="loading" :pullup="onOpen" :is-empty="isEmpty" :is-end="isEnd">
          <select-video
            v-for="(item, index) in listData"
            :key="index"
            :index="index"
            :data="item"
            type="select"
            :is-select="selectIds.includes(item.id)"
            @select="onSelect(item)"
          ></select-video>
        </scroll-list>
      </div>
      <div class="select_fot">
        <span>已选择{{ selects.length }}个视频</span>
        <div @click="triggerSelect">完成</div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'
const props = defineProps<{
  type: 'all' | 'my'
}>()
const emit = defineEmits<{
  'update:show': [e: boolean]
  delete: [e: VideoItem]
  select: [e: VideoItem[]]
}>()

const __ = useNuxtApp()
const kwy = ref('')
const selects = ref<VideoItem[]>([])
const selectIds = computed(() => {
  return selects.value.map(item => item.id)
})

const onClose = () => {
  emit('update:show', false)
  nextTick(() => {
    kwy.value = ''
  })
}

const { listData, execute, loading, isEnd, isEmpty, refresh } = useFetchList<VideoItem>({
  api: __.$Api.Community.mvList,
  startRefreshEmptyData: true
})

const onOpen = () => {
  return execute({
    type: props.type,
    kwy: kwy.value
  })
}

const onSearch = () => {
  if (!loading.value) {
    refresh({
      type: props.type,
      kwy: kwy.value
    })
  }
}

const onSelect = (item: VideoItem) => {
  const index = selectIds.value.indexOf(item.id)
  if (index >= 0) {
    selects.value.splice(index, 1)
  } else {
    if (selects.value.length >= 10) {
      return __.$Toast('最多只能选择10个')
    }
    selects.value.push(item)
  }
}
const onClosed = () => {
  selects.value = []
  listData.value = []
  isEnd.value = false
}
const triggerSelect = () => {
  emit('select', [...selects.value])
  onClose()
}
</script>

<style lang="less" scoped>
.select_fot {
  height: 1.6rem;
  background: #4d4d4d;
  padding: 0 0.32rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 0.4rem;

  div {
    width: 1.867rem;
    height: 0.75rem;
    border-radius: 0.375rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: #fd5c18;
  }
}
.seach_input_box {
  border-radius: 0.4rem;
  margin: 0.32rem;
  background: #404040;

  input {
    width: 100%;
    height: 30px;
    outline: none;
    border: none;
    text-align: center;
    background: none;
    color: #ffffff;
    font-size: 14px;
  }
}
</style>
