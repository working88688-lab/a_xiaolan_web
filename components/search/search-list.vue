<!-- 
    desc: 搜索历史
    date: 2024.03.28
-->
<template>
  <scroll-list :loading="loading" class="search-list text-left">
    <div class="search-box mt-0.5">
      <div class="mb-1 flex items-center justify-between text-left">
        <div class="search-title">搜索历史</div>
        <div class="search-clear" @click="onClearHistory">清除</div>
      </div>
      <div class="search-row history">
        <div v-for="item in props.list" :key="item" class="search-item1" @click="onSearch(item)">{{ item }}</div>
      </div>
      <dx-empty v-if="!props.list?.length" :size="['4rem', '2.34rem']" description="您还没有搜索过哟～"></dx-empty>
    </div>
    <div class="tag-list">
      <div class="ranking_box search-box">
        <p class="title">热搜总榜</p>

        <div v-for="(item, index) in state.rank_list" :key="index" class="ranking_item" @click="onSearch(item.work)">
          <div class="search_tag">
            <div class="num">
              <img v-if="index < 3" :src="iconRanking(index)" />
              <template v-else>
                {{ index + 1 }}
              </template>
            </div>
            {{ item.work }}
          </div>
          <div class="search_num">{{ $Utils.formatNumber(item.num) }}</div>
        </div>
      </div>
      <div class="search-box">
        <div class="search-title mb-1">热门标签</div>
        <div class="search-row">
          <div v-for="item in state.hotSearch" :key="item" class="search-item1" @click="onSearch(item)">
            {{ item }}
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in state.recommend"
        :key="index"
        class="search-box"
        :style="{ paddingTop: 10, paddingRight: 14, paddingBottom: 20 }"
      >
        <div class="search-title mb-1">{{ item.title }}</div>
        <div class="search-row">
          <div v-for="sItem in item.data" :key="sItem" class="search-item1" @click="onSearch(sItem)">
            {{ sItem }}
          </div>
        </div>
      </div>
    </div>
  </scroll-list>
</template>

<script setup lang="ts">
import ranking1 from '~/assets/image/discover/ranking_1.png'
import ranking2 from '~/assets/image/discover/ranking_2.png'
import ranking3 from '~/assets/image/discover/ranking_3.png'
const props = defineProps<{
  list?: string[]
}>()

const __ = useNuxtApp()

const emit = defineEmits<{
  clear: []
  search: [e: string]
}>()

const iconRanking = (index: number) => {
  let icon
  switch (index) {
    case 0:
      icon = ranking1
      break
    case 1:
      icon = ranking2
      break
    default:
      icon = ranking3
      break
  }
  return icon
}

const onClearHistory = () => {
  if (props.list?.length) {
    __.$Alert({
      message: '确定删除搜索历史？',
      showCancelButton: true,
      theme: 'default'
    })
      .then(() => {
        emit('clear')
      })
      .catch(() => {})
  }
}

const onSearch = (val: string) => {
  emit('search', val)
}

const { data: state, loading } = useMyFetch<{
  hotSearch: any[]
  recommend: any[]
  rank_list: any[]
}>({
  api: __.$Api.Search.recommends,
  immediate: true
})
</script>

<style lang="postcss" scoped>
.search-list {
  --van-empty-description-font-size: 12px;
}
</style>
