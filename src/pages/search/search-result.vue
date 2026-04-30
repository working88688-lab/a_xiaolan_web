<!--
    desc: 搜索结果
    date: 2024.03.28
-->
<script setup lang="ts">
const search_ref = ref()

const searchValue = ref()
const route = useRoute()
const router = useRouter()
const __ = useNuxtApp()
const searchTriggerTick = ref(0)

function normalizeKeyword(val: string) {
  return String(val ?? '').trim()
}

function canSearchKeyword(val: string) {
  const keyword = normalizeKeyword(val)
  // 与 /search 页面保持一致：不允许单个字符（含单个汉字）搜索
  if (keyword.length < 2) {
    __.$Toast('至少两位搜索关键字')
    return { ok: false as const, keyword }
  }
  return { ok: true as const, keyword }
}

function onSearch(value: string) {
  const { ok, keyword } = canSearchKeyword(value)
  if (!ok) return
  searchValue.value = keyword
  // 同关键词反复点击也要强制刷新请求
  searchTriggerTick.value += 1
  // 同步 URL，便于回退与分享；_t 保证同词重复搜索也触发路由更新
  router
    .replace({
      path: '/search/result',
      query: {
        ...route.query,
        keyword,
        _index: String(activeTab.value ?? 0),
        _t: String(Date.now())
      }
    })
    .catch(() => {})
}

const { key, activeTab } = useKeepAlive({
  reset: () => {
    searchValue.value = ''
  },
  active: () => {
    const value = route.query.keyword
    searchValue.value = value

    nextTick(() => {
      search_ref.value?.set_value(value)
    })
    const _index = Number(route.query._index)
    if (activeTab.value !== _index) {
      activeTab.value = _index
    }
  }
})

watch(
  () => route.query.keyword,
  value => {
    const keyword = normalizeKeyword(String(value ?? ''))
    if (!keyword) return
    searchValue.value = keyword
    nextTick(() => {
      search_ref.value?.set_value(keyword)
    })
  }
)

onMounted(() => {
  nextTick(() => {
    search_ref.value?.set_value(route.query.keyword)
  })
})

function onTrack(data: any) {
  __.$Tracker.trackKeywordSearch({
    keyword: searchValue.value,
    search_result_count: data.count
  })
}
</script>

<template>
  <div :key="key" class="container">
    <div class="flex items-center py-1">
      <van-icon class="py-1 pl-1" name="arrow-left" size="0.6rem" @click="$router.go(-2)" />
      <app-search ref="search_ref" class="flex-1" @search="onSearch" />
    </div>

    <div v-if="key && searchValue" class="scroll-container">
      <dx-tabs :key="`${searchValue}-${searchTriggerTick}`" v-model:active="activeTab" class="first-no-padding dx-tabs text-lg" shrink>
        <van-tab title="视频">
          <dx-hoc-list :on-track class="dx-grid-1" api="api/search/mv" :params="{ kwy: searchValue, show_type: 0 }">
            <template #item="{ item, index, items }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'video',
                click_item_type_name: '视频',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <video-item :key="item.id" :item />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>
        <van-tab title="短视频">
          <dx-hoc-list :on-track class="dx-grid-3" api="api/search/mv" :params="{ show_type: 1, kwy: searchValue }">
            <template #item="{ item, items, index, page }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'short',
                click_item_type_name: '短视频',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <video-tiktok-item :key="item.id" api="api/search/mv" show-title :list="items" :index="index"
                  :item="item" field-path="data.list" :params="{
                    page: page.page,
                    show_type: 1,
                    kwy: searchValue
                  }"
                />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>
        <van-tab title="片库">
          <dx-hoc-list :on-track class="dx-grid-2" api="api/original/search" :params="{ kwy: searchValue }">
            <template #item="{ item, items, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'original',
                click_item_type_name: '片库',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <video-card :key="item.id" :index="index" :list="items" :show-type="false" :mv-type="2"
                  :show-duration="false"
                  :item="{ cover_thumb_url: item.cover_full, rating: item.play_count, ...item }"
                />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>
        <van-tab title="帖子">
          <dx-hoc-list
            :on-track
            class="grid grid-cols-1 gap-1"
            api="api/community/search"
            :params="{
              word: searchValue
            }"
          >
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'community',
                click_item_type_name: '帖子',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <post-item :key="item.id" show-author show-original :item="item" />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>
        <van-tab title="用户">
          <dx-hoc-list :on-track class="dx-grid-1" api="api/search/user" :params="{ kwy: searchValue }">
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'user',
                click_item_type_name: '用户',
                click_item_id: item.uid,
                click_position: index + 1
              }">
                <nuxt-link :key="item.uid" :to="`/userdetail?id=${item.uid}`" class="flex items-center">
                  <div class="mr-1 flex flex-1 items-center overflow-hidden">
                    <dx-avatar
                      class="mr-0.5 flex-shrink-0"
                      :img="item?.avatar_url"
                      :uid="item?.uid"
                      :aff="item?.aff"
                      :size="1.3"
                    />
                    <div class="flex-1 overflow-hidden">
                      <p class="text-default">
                        {{ item.nickname }}
                      </p>
                      <div class="my-0.5 truncate text-sm text-base2">
                        <span>{{ item.person_signnatrue }}</span>
                      </div>
                      <div class="text-sm text-base2">
                        <span>粉丝: {{ item.fans_count }}</span>
                        <span>作品: {{ item.videos_count }}</span>
                      </div>
                    </div>
                  </div>
                  <btn-follow
                    class="flex-shrink-0"
                    :uid="item.uid"
                    use-default-style
                    :attention="item.is_attention"
                    @click.stop
                  >
                    <template #default="{ follow, text: _text }">
                      <div
                        :class="{
                          'search-isLike': follow,
                          'search-like': !follow
                        }"
                      >
                        {{ _text }}
                      </div>
                    </template>
                  </btn-follow>
                </nuxt-link>
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>

        <van-tab title="动漫">
          <dx-hoc-list :on-track class="dx-grid-2" api="api/cartoon/search" :params="{ word: searchValue }">
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'cartoon',
                click_item_type_name: '动漫',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <video-card :key="item.id" :show-type="false" :mv-type="3" lines :show-duration="false"
                  :item="{ cover_thumb_url: item.cover_full, rating: item.play_count, ...item }" />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>

        <van-tab title="漫画">
          <dx-hoc-list :on-track class="dx-grid-2" api="api/manhua/search" :params="{ kwy: searchValue }">
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'comic',
                click_item_type_name: '漫画',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <comics-item :key="item.id" :item="item" />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>

        <van-tab title="男色">
          <dx-hoc-list :on-track class="dx-grid-2" api="api/image/search" :params="{ kwy: searchValue }">
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'image',
                click_item_type_name: '美男',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <comics-item :key="item.id" page="images" :item="item" />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>

        <van-tab title="小说">
          <dx-hoc-list :on-track class="dx-grid-2" api="api/story/search" :params="{ kwy: searchValue }">
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'story',
                click_item_type_name: '小说',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <comics-item :key="item.id" page="story" :item="item" />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>

        <van-tab title="黄游">
          <dx-hoc-list :on-track class="dx-grid-2" api="api/porngame/search" :params="{ word: searchValue }">
            <template #item="{ item, index }">
              <report-click-item :data="{
                event: 'keyword_click',
                keyword: searchValue,
                click_item_type_key: 'porngame',
                click_item_type_name: '黄游',
                click_item_id: item.id,
                click_position: index + 1
              }">
                <game-item :key="item.id" :item="item" />
              </report-click-item>
            </template>
          </dx-hoc-list>
        </van-tab>
      </dx-tabs>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
:deep(.van-tab) {
  padding: 0 10px;
}

:deep(.item-bg) {
  margin-bottom: 0;
}
</style>
