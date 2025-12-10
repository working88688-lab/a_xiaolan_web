<template>
  <van-popup
    v-bind="$attrs"
    position="bottom"
    :lock-scroll="false"
    :style="{ width: '100%', height: '60%' }"
    @click-overlay="onClose"
    @open="onOpen"
  >
    <div class="container">
      <div class="directory-filter-new">
        <div class="flex">
          {{ props.data!.title }}
          <div class="decs">
            {{ props.data!.is_finish == 1 ? props.data!.update_time : `连载中·更新至${props.data!.now_total}话` }}
          </div>
        </div>
        <div class="sort">
          <div
            :class="{
              active: sort === 0
            }"
            @click="onChangeFilter(0)"
          >
            正序
          </div>
          <div
            :class="{
              active: sort === 1
            }"
            @click="onChangeFilter(1)"
          >
            倒序
          </div>
        </div>
      </div>
      <div class="scroll-container">
        <scroll-list v-model:loading="loading">
          <div class="reader-directory-list">
            <div class="dx-list">
              <story-icon
                v-for="(item, _index) in series"
                :key="_index"
                :data="props.data"
                :index="item.series"
                :item="item"
                @click="onSelect(item, _index)"
              />
            </div>
          </div>
        </scroll-list>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import type { StoryData, StoryItem } from '@types'

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

const showDirectory = ref(false)
const series = ref([...(props.data?.series ?? [])])
const sort = ref(0)
const loading = ref(false)
const onClose = () => {
  emit('update:show', false)
}

const onChangeFilter = (type: 0 | 1) => {
  sort.value = type
  series.value.sort((a, b) => {
    if (type === 0) {
      return a.series - b.series
    }
    return b.series - a.series
  })

  series.value = [...series.value]
}
const onSelect = async (item: StoryItem, index: number) => {
  showDirectory.value = false
  emit('select', item, index)
}
const onOpen = () => {
  sort.value = 0
  series.value = [...(props.data?.series ?? [])]
}
</script>

<style lang="less" scoped>
.directory-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.dx-list {
  padding: 12px;
}

.directory-filter-new {
  padding: 0.4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  .flex {
    flex: 1;
    font-size: 0.4rem;
    .decs {
      font-size: 0.35rem;
      color: #666666;
    }
  }
  .sort {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.4rem;

    > div {
      padding: 0 0.15rem;
      &.active {
        color: #008afb;
      }
      &:nth-child(1) {
        border-right: 1px solid #e3e4e5;
      }
    }
  }
}
</style>
