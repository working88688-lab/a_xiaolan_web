<template>
  <div :key="key" class="container">
    <dx-navbar
      class="my-nav-bar !text-white"
      :border="false"
      title="创作达人"
      left-arrow
      fixed
      @click-left="$router.back"
    ></dx-navbar>
    <div v-if="key" ref="list" class="scroll-container is-scroll tablent_list">
      <community-tablent-tab :tabs="tablentDetail?.tab"></community-tablent-tab>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from '@types'
const __ = useNuxtApp()

const { data: tablentDetail, loading } = useMyFetch<{
  member: UserInfo
  post_list: any
  tab: any[]
}>({
  api: __.$Api.Community.rankConf,
  immediate: true
})

const wrapperRef = useTemplateRef('list')
const { scrollTop } = usePosition(wrapperRef)

const { key } = useKeepAlive({
  reset() {
    scrollTop.value = 0
  }
})
</script>

<style lang="less" scoped>
@import '@styles/creative.less';

.container {
  background-image: linear-gradient(#cb4aed, #3d28a8, #332094);
}
.title {
  color: #222222 !important;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  width: 100%;
  color: #6d6d6c !important;
  overflow: hidden;
  white-space: normal;
  height: 36px;
}
.tablent_list_mv_item {
  background: #fef3f0;
  padding: 12px;
}

.video {
  clear: both;
  height: 36px;
  display: flex;
}
</style>
