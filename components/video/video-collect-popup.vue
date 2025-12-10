<template>
  <van-popup
    close-on-click-overlay
    close-on-popstate
    position="bottom"
    :style="{ height: '68%', width: '100%' }"
    :lock-scroll="false"
    :overlay="false"
    teleport="body"
    v-bind="$attrs"
    @click-overlay="onClose"
  >
    <div class="container">
      <div class="video-detail-buyLayer1-title">
        <span></span>
        <span class="tag-list-title truncate">{{ title }}</span>
        <span class="btn-close" @click="onClose">关闭</span>
      </div>
      <div class="scroll-container">
        <scroll-list>
          <div class="grid grid-cols-2 gap-1 px-1">
            <video-card
              v-for="(item, index) in list"
              :key="index"
              :index="index"
              :list="list"
              replace
              :item="item"
            ></video-card>
          </div>
        </scroll-list>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'
const props = defineProps<{
  title?: string
  list?: VideoItem[]
}>()

const emit = defineEmits<{
  'update:show': [e: boolean]
}>()

const __ = useNuxtApp()

const onClose = () => {
  emit('update:show', false)
}

useDectivted(onClose)
</script>

<style lang="postcss" scoped>
.video-detail-buyLayer1-title {
  font-size: 0.45rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin: 0.4rem 0;
  display: flex;
  padding: 0 12px;
  justify-content: space-between;
  .btn-close {
    font-size: 12px;
    color: #ccc;
    padding: 4px;
  }
}
.tag-list-title {
  max-width: 260px;
}
</style>
