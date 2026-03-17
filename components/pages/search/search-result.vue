<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()
// 状态
const __ = useNuxtApp()
const activeTab = defineModel<number>('active')

const params = ref({
  kwy: props.text
})

function onTrack(data: any) {
  __.$Tracker.trackKeywordSearch({
    keyword: props.text,
    search_result_count: data.count
  })
}
</script>
<template>
  <dx-tabs v-model:active="activeTab" class="dx-tabs first-no-padding primary-tabs">
    <van-tab title="视频">
      <dx-hoc-list :on-track :api="__.$Api.Search.searchtags" :params="params">
        <template #item="{ item, index, items }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'video',
              click_item_type_name: '视频',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <stack-link :key="item.id" track :list="items" :data="item" :index="index">
              <div class="search-videoItem">
                <div class="search-videoCover flex-shrink-0">
                  <dx-image :src="item.cover_thumb_url" />
                  <span class="duration">{{ item.duration_str }}</span>
                  <dx-pay-type :coins="item.coins" class="absolute right-0.5 top-0.5 z-10"></dx-pay-type>
                </div>
                <div class="search-videoInfo flex-1 overflow-hidden">
                  <p class="line-clamp-2 text-base1" style="word-break: break-all; white-space: normal">
                    {{ item.title }}
                  </p>
                  <div class="dx dx-flex dx-align-center">
                    <img v-lazyLoad="item.user.avatar_url" class="avatar" />
                    <span class="ml-0.5">{{ item.user.nickname }}</span>
                  </div>
                  <div>
                    <span>{{ $Utils.formatNumber(item.rating) }}次播放</span>
                  </div>
                </div>
              </div>
            </stack-link>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="片库">
      <dx-hoc-list :on-track class="dx-grid-2" :api="__.$Api.Search.original" :params="params">
        <template #item="{ item, items, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'original',
              click_item_type_name: '片库',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <video-card
              :key="item.id"
              :index="index"
              :list="items"
              :mv-type="2"
              :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, rating: item.play_count, ...item }"
            ></video-card>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="帖子">
      <dx-hoc-list
        :on-track
        :api="__.$Api.Community.search"
        :params="{
          word: props.text
        }"
      >
        <template #item="{ item, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'community',
              click_item_type_name: '帖子',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <post-item :key="item.id" show-original :item="item"></post-item>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>

    <van-tab title="用户">
      <dx-hoc-list :on-track class="dx-grid-1" :api="__.$Api.Search.searchUser" :params="params">
        <template #item="{ item, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'user',
              click_item_type_name: '用户',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <div :key="item.uid" class="search-userItem">
              <div class="search-row searchreuslt">
                <dx-avatar :img="item.avatar_url" class="radius-50 userItem-avatarbox" :uid="item.uid" />
                <div class="userItem-info">
                  <p>{{ item.nickname }}</p>
                  <div class="userItem-signnatrue">
                    <span>{{ item.person_signnatrue }}</span>
                  </div>
                  <div>
                    <span>粉丝: {{ item.fans_count }}</span>
                    <span>作品: {{ item.videos_count }}</span>
                  </div>
                </div>
              </div>
              <btn-follow :uid="item.uid" :attention="item.is_attention">
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
            </div>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="动漫">
      <dx-hoc-list :on-track class="dx-grid-2" api="api/cartoon/search" :params="{ word: props.text }">
        <template #item="{ item, items, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'cartoon',
              click_item_type_name: '动漫',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <video-card
              track
              :list="items"
              :index="index"
              :mv-type="3"
              :show-duration="false"
              :item="{ cover_thumb_url: item.cover_full, ...item, rating: item.play_count }"
            ></video-card>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="漫画">
      <dx-hoc-list :on-track class="dx-grid-2" :api="__.$Api.Search.searchComics" :params="params">
        <template #item="{ item, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'comic',
              click_item_type_name: '漫画',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <comics-item :key="item.id" :item="item"></comics-item>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="男色">
      <dx-hoc-list :on-track class="dx-grid-2" :api="__.$Api.Search.searchImage" :params="params">
        <template #item="{ item, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'image',
              click_item_type_name: '男色',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <comics-item :key="item.id" page="images" :item="item"></comics-item>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="小说">
      <dx-hoc-list :on-track class="dx-grid-2" :api="__.$Api.Search.searchStory" :params="params">
        <template #item="{ item, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'story',
              click_item_type_name: '小说',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <comics-item :key="item.id" page="story" :item="item"></comics-item>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
    <van-tab title="黄游">
      <dx-hoc-list :on-track class="dx-grid-2" api="/api/porngame/search" :params="{ word: props.text }">
        <template #item="{ item, index }">
          <report-click-item
            :data="{
              event: 'keyword_click',
              keyword: props.text,
              click_item_type_key: 'porngame',
              click_item_type_name: '黄游',
              click_item_id: item.id,
              click_position: index
            }"
          >
            <game-item :key="item.id" :item="item"></game-item>
          </report-click-item>
        </template>
      </dx-hoc-list>
    </van-tab>
  </dx-tabs>
</template>
