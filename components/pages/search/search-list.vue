<script setup lang="ts">
import ranking1 from '~/assets/image/discover/ranking_1.png'
import ranking2 from '~/assets/image/discover/ranking_2.png'
import ranking3 from '~/assets/image/discover/ranking_3.png'
import type { AdItem } from '~/types'

const props = defineProps<{
  list?: string[]
}>()

const emit = defineEmits<{
  clear: []
  search: [e: string]
}>()
const __ = useNuxtApp()

function normalizeKeyword(val: unknown) {
  return String(val ?? '').trim()
}

function isDisplayableKeyword(val: unknown) {
  // 不展示单个字符（含单个汉字）
  return normalizeKeyword(val).length >= 2
}

function onClearHistory() {
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

function onSearch(val: string) {
  emit('search', val)
}

const { data: state, loading } = useMyFetch<{
  hotSearch: any[]
  recommend: any[]
  rank_list: any[]
  ads: AdItem[]
}>({
  api: 'api/search/index',
  immediate: true
})

const filteredRankList = computed(() => {
  const list = state.value?.rank_list
  if (!Array.isArray(list)) return []
  return list.filter(it => isDisplayableKeyword(it?.work))
})

const filteredHotSearch = computed(() => {
  const list = state.value?.hotSearch
  if (!Array.isArray(list)) return []
  return list.filter(it => isDisplayableKeyword(it))
})

const filteredRecommend = computed(() => {
  const list = state.value?.recommend
  if (!Array.isArray(list)) return []
  return list
    .map(it => {
      const data = Array.isArray(it?.data) ? it.data.filter((x: any) => isDisplayableKeyword(x)) : []
      return { ...it, data }
    })
    .filter(it => Array.isArray(it.data) && it.data.length > 0 && String(it?.title ?? '').trim() !== '')
})

function iconRanking(index: number) {
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
</script>

<template>
  <scroll-list style="text-align: left">
    <div class="tag-list">
      <div class="search-box">
        <div class="mb-1 flex items-center justify-between" style="text-align: left">
          <div class="text-xl font-medium">搜索记录</div>
          <div class="search-clear cursor-pointer" @click="onClearHistory">
            <nuxt-icon name="search/delete" class="text-xl text-base2"></nuxt-icon>
          </div>
        </div>
        <div class="search-row">
          <div v-for="item in props.list" :key="item" class="search-item1" @click="onSearch(item)">
            {{ item }}
          </div>
        </div>
      </div>
      <div v-if="state.ads?.length" class="px-1">
        <dx-ads :items="state.ads"></dx-ads>
      </div>
      <div class="tag-list">
        <div class="ranking_box search-box">
          <p class="mb-1 text-xl font-medium">热搜排行</p>
          <div class="grid grid-cols-1 gap-1">
            <div
              v-for="(item, index) in filteredRankList"
              :key="index"
              class="flex items-center"
              @click="onSearch(item.work)"
            >
              <div class="flex flex-1 items-center overflow-hidden">
                <div class="mr-1 w-2 flex-shrink-0 text-center">
                  <img v-if="index < 3" :src="iconRanking(index)" />
                  <template v-else>
                    {{ index + 1 }}
                  </template>
                </div>
                <div class="mr-0.5 flex-1 truncate">
                  {{ item.work }}
                </div>
              </div>
              <div class="ml-auto flex-shrink-0 text-[#FFAA00]">
                {{ $Utils.formatNumber(item.num) }}
              </div>
            </div>
          </div>
        </div>
        <div class="search-box">
          <div class="mb-1 text-xl font-medium">热搜标签</div>
          <div class="search-row">
            <div v-for="item in filteredHotSearch" :key="item" class="search-item1" @click="onSearch(item)">
              {{ item }}
            </div>
          </div>
        </div>
        <div
          v-for="(item, index) in filteredRecommend"
          :key="index"
          class="search-box"
          :style="{ paddingTop: 10, paddingRight: 14, paddingBottom: 20 }"
        >
          <div class="mb-1 text-xl font-medium">
            {{ item.title }}
          </div>
          <div class="search-row">
            <div v-for="sItem in item.data" :key="sItem" class="search-item1" @click="onSearch(sItem)">
              {{ sItem }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </scroll-list>
</template>

<style lang="postcss" scoped>
.search-box {
  padding: 10px 12px;
}

.search-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;

  &.searchreuslt {
    flex-wrap: unset;
  }
}

.search-item1 {
  color: var(--dx-primary-color);
  background-color: #e6f4ff;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 50px;
  cursor: pointer;
}

.search-banner {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
