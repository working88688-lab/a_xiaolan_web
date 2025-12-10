<template>
  <div :key="key" class="container">
    <dx-navbar
      class="my-nav-bar"
      right-text="搜索"
      :border="false"
      title="选择视频"
      left-arrow
      @click-right="onSearch"
    ></dx-navbar>
    <div class="seach_input_box">
      <input v-model="kwy" placeholder="输入标题名称搜索" />
    </div>
    <div class="scroll-container">
      <dx-hoc-list
        v-if="key"
        ref="list"
        :use-watch="false"
        :fetch-props="{ usePageSize: true }"
        :api="__.$Api.Community.mvList"
        :params="{ type: route.query._type, kwy: kwy, size: 16 }"
      >
        <template #item="{ item, index }">
          <select-video
            :key="item.id"
            :index="index"
            :data="item"
            type="select"
            :is-select="selectIds.includes(item.id)"
            @select="onSelect(item)"
          ></select-video>
        </template>
      </dx-hoc-list>
    </div>
    <div class="select_fot">
      <span>已选择{{ selects.length }}个视频</span>
      <div @click="triggerSelect">完成</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'

const __ = useNuxtApp()
const kwy = ref('')
const selects = ref<VideoItem[]>([])
const route = useRoute()
const list_ref = useTemplateRef('list')

const router = useRouter()
const dynamicStore = useDynamicStore()
const selectIds = computed(() => {
  return selects.value.map(item => item.id)
})

const onClose = () => {
  nextTick(() => {
    kwy.value = ''
  })
}

const onSearch = () => {
  list_ref.value?.refresh_data({
    type: route.query._type,
    kwy: kwy.value
  })
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

const triggerSelect = () => {
  dynamicStore.setPushVideo([...selects.value])

  router.go(-1)
}

const { key } = useKeepAlive({
  reset() {
    selects.value = []
    kwy.value = ''
  }
})
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
