<script setup lang="ts">
import type { PostItem, UserInfo, VideoItem } from '@types'
import { useEventListener, useThrottleFn } from '@vueuse/core'

const __ = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()
const uid = ref()
const postSearch = ref('')
const videoSearch = ref('')
const likeSearch = ref('')
const buySearch = ref('')
const isMyDetail = computed(() => {
  return Number(route.query.id) === userStore.u?.uid
})
const active = ref(0)
const follow = computed(() => {
  return userInfo.value?.is_attention === 1
})
const {
  data: userInfo,
  loading,
  execute
} = useMyFetch<UserInfo>({
  api: __.$Api.User.getOtherUserInfo
})
const {
  listData: posts,
  loading: postLoading,
  isEmpty: postEmpty,
  isEnd: postEnd,
  execute: postMore,
  refresh: postRefresh,
  reset: postReset
} = useFetchList<PostItem>({
  api: __.$Api.User.userlistPost,
  fields: 'post',
  startRefreshEmptyData: true
})
const {
  listData: videos,
  loading: videoLoading,
  isEmpty: videoEmpty,
  isEnd: videoEnd,
  execute: videoMore,
  refresh: videoRefresh,
  reset: videosReset
} = useFetchList<VideoItem>({
  api: __.$Api.User.userVideos,
  startRefreshEmptyData: true
})

const {
  listData: likes,
  loading: likeLoading,
  isEmpty: likeEmpty,
  isEnd: likeEnd,
  execute: likeMore,
  refresh: likeRefresh,
  reset: likeReset
} = useFetchList<VideoItem>({
  api: '/api/users/likes',
  startRefreshEmptyData: true
})

const {
  listData: buys,
  loading: buyLoading,
  isEmpty: buyEmpty,
  isEnd: buyEnd,
  execute: buyMore,
  refresh: buyRefresh,
  reset: buyReset
} = useFetchList<VideoItem>({
  api: '/api/users/buys',
  startRefreshEmptyData: true
})

const fetchMap = {
  '0': () =>
    likeMore({
      uid: route.query.id,
      kwy: likeSearch.value
    }),
  '1': () =>
    buyMore({
      uid: route.query.id,
      kwy: buySearch.value
    }),
  '3': () =>
    postMore({
      aff: route.query.id,
      kwy: postSearch.value
    }),
  '2': () =>
    videoMore({
      uid: route.query.id,
      kwy: videoSearch.value
    })
}

const onRender = (type: keyof typeof fetchMap) => {
  if (uid.value) {
    fetchMap[type]?.()
  }
}

const clearMap = {
  '0': () =>
    likeRefresh({
      uid: route.query.id
    }),
  '1': () =>
    buyRefresh({
      uid: route.query.id
    }),

  '3': () =>
    postRefresh({
      aff: route.query.id
    }),
  '2': () =>
    videoRefresh({
      uid: route.query.id
    })
}
const onClear = (type: keyof typeof clearMap) => {
  likeSearch.value = ''
  buySearch.value = ''
  postSearch.value = ''
  videoSearch.value = ''
  clearMap[type]?.()
}

const searchMap = {
  '0': () =>
    likeRefresh({
      uid: route.query.id,
      kwy: likeSearch.value
    }),
  '1': () =>
    buyRefresh({
      uid: route.query.id,
      kwy: buySearch.value
    }),

  '2': () =>
    videoRefresh({
      kwy: videoSearch.value,
      uid: route.query.id
    }),
  '3': () =>
    postRefresh({
      aff: route.query.id,
      kwy: postSearch.value
    })
}
const onSearch = (type: keyof typeof searchMap) => {
  searchMap[type]?.()
}

const back = () => {
  uid.value = ''
  likeSearch.value = ''
  buySearch.value = ''
  postSearch.value = ''
  videoSearch.value = ''
  active.value = 0
  postReset()
  videosReset()
  likeReset()
  buyReset()
}
onActivated(() => {
  window.addEventListener('popstate', back)
  if (!uid.value || (uid.value && uid.value !== route.query.id)) {
    back()
    uid.value = route.query.id
    execute({
      to_uid: uid.value
    })
    scroll_top.value = 0
  }
})

onDeactivated(() => {
  setTimeout(() => {
    window.removeEventListener('popstate', back)
  }, 0)
})

const list_ref = useTemplateRef('list')
const scroll_top = ref(0)
const scroll_handler = useThrottleFn((e: Event) => {
  scroll_top.value = (e.target as HTMLDivElement).scrollTop
}, 20)

useEventListener(list_ref, 'scroll', scroll_handler, {
  passive: true
})

const is_show_bg = computed(() => {
  return scroll_top.value >= 80
})
</script>
<template>
  <div v-if="uid" :key="uid" class="container">
    <dx-navbar
      :title="is_show_bg ? userInfo?.nickname : ''"
      class="transition-all duration-200"
      :class="is_show_bg ? 'bg-white' : 'transparent'"
      :border="false"
    ></dx-navbar>

    <scroll-list ref="list" :is-ready="!loading" class="mt-[-50px]">
      <div class="homepage-user-header">
        <div class="user-info-header">
          <img class="background-bg" src="~/assets/image/homepage_bg.png" />
          <div class="user-info-detail">
            <div class="avatar"><img :key="userInfo?.avatar_url" v-lazyLoad="userInfo?.avatar_url" /></div>
            <div class="flex-1">
              <div class="nickname">{{ userInfo?.nickname }}</div>
              <div class="vip-info">
                <vip-icon :data="userInfo"></vip-icon>
                <div v-if="userInfo?.auth_level >= 4" class="auth-level">
                  <img src="~/assets/image/creator.png" />
                  <span>制片人LV.{{ userInfo?.auth_level }}</span>
                </div>
              </div>
              <div class="uid">ID:{{ userInfo?.uid }}</div>
            </div>
          </div>
        </div>
        <div class="number_info">
          <div v-link="`/fans?uid=${userInfo?.uid}`" class="number_item cursor-pointer">
            <div class="number">{{ $Utils.formatNumber(userInfo?.fans_count ?? 0, 'en') }}</div>
            <div class="title">粉丝</div>
          </div>
          <div class="number_item">
            <div class="number">{{ userInfo.followed_count }}</div>
            <div class="title">关注</div>
          </div>
          <div class="number_item">
            <div class="number">{{ $Utils.formatNumber(userInfo?.fabulous_count ?? 0, 'en') }}</div>
            <div class="title">点赞</div>
          </div>
        </div>
        <div v-if="userInfo?.person_signnatrue" class="rz_text">
          <div class="flex-1" v-html="userInfo.person_signnatrue.replaceAll('\n', '<br/>')"></div>
        </div>
        <div class="user_page_box">
          <dx-tabs
            v-model:active="active"
            class="dx-tabs first-no-padding"
            line-width="20px"
            shrink
            sticky
            @rendered="onRender"
          >
            <van-tab title="收藏">
              <div class="container">
                <van-search
                  v-model="likeSearch"
                  class="my-search"
                  show-action
                  shape="round"
                  placeholder="请输入标题查找作品"
                  clear-trigger="always"
                  @search="onSearch('0')"
                  @clear="onClear('0')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('0')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="likeLoading"
                    :is-end="likeEnd"
                    :is-empty="likeEmpty"
                    :pullup="fetchMap['0']"
                  >
                    <div class="grid grid-cols-2 gap-1 px-1">
                      <video-card
                        v-for="(item, index) in likes"
                        :key="item.id"
                        :index="index"
                        :item="item"
                      ></video-card>
                    </div>
                  </scroll-list>
                </div>
              </div>
            </van-tab>
            <van-tab title="购买">
              <div class="container">
                <van-search
                  v-model="buySearch"
                  class="my-search"
                  show-action
                  shape="round"
                  placeholder="请输入标题查找作品"
                  clear-trigger="always"
                  @search="onSearch('1')"
                  @clear="onClear('1')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('1')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="buyLoading"
                    :is-end="buyEnd"
                    :is-empty="buyEmpty"
                    :pullup="fetchMap['1']"
                  >
                    <div class="grid grid-cols-2 gap-1 px-1">
                      <video-card v-for="(item, index) in buys" :key="item.id" :index="index" :item="item"></video-card>
                    </div>
                  </scroll-list>
                </div>
              </div>
            </van-tab>
            <van-tab title="视频">
              <div class="container">
                <van-search
                  v-model="videoSearch"
                  class="my-search"
                  show-action
                  shape="round"
                  clear-trigger="always"
                  placeholder="请输入标题查找作品"
                  @search="onSearch('2')"
                  @clear="onClear('2')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('2')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="videoLoading"
                    :is-end="videoEnd"
                    :is-empty="videoEmpty"
                    :pullup="fetchMap['2']"
                  >
                    <div class="grid grid-cols-2 gap-1 px-1">
                      <video-card
                        v-for="(item, index) in videos"
                        :key="item.id"
                        :list="videos"
                        :index="index"
                        :item="item"
                      ></video-card>
                    </div>
                  </scroll-list>
                </div>
              </div>
            </van-tab>
            <van-tab title="帖子">
              <div class="container">
                <van-search
                  v-model="postSearch"
                  class="my-search"
                  show-action
                  shape="round"
                  placeholder="请输入标题查找作品"
                  clear-trigger="always"
                  @search="onSearch('3')"
                  @clear="onClear('3')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('3')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="postLoading"
                    :is-end="postEnd"
                    :is-empty="postEmpty"
                    :pullup="fetchMap['3']"
                  >
                    <div class="dx-list">
                      <post-item v-for="item in posts" :key="item.id" show-original :item="item"></post-item>
                    </div>
                  </scroll-list>
                </div>
              </div>
            </van-tab>
          </dx-tabs>
        </div>
      </div>
    </scroll-list>

    <div v-if="!isMyDetail" class="absolute bottom-3 left-0 right-0">
      <div class="grid grid-cols-2 gap-3">
        <btn-follow
          :key="userInfo.uid"
          class="place-self-end"
          :attention="follow ? 1 : 0"
          :uid="userInfo.uid"
          use-toast
        >
          <template #default="{ text, follow: _follow }">
            <dx-button color="linear-gradient(to right, #fd7023,  #fecf42)" class="w-[120px]">
              <van-icon :name="_follow ? 'success' : 'plus'" />
              {{ text }}
            </dx-button>
          </template>
        </btn-follow>

        <dx-button :to="`/chat/room?uid=${userInfo.uid}&name=${userInfo.nickname}`" class="w-[120px] place-self-start">
          <van-icon name="chat" />
          聊天
        </dx-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dx-tabs {
  :deep(.van-tab__text) {
    font-size: 14px;
  }
  :deep(.van-tabs__wrap) {
    top: 0px;
  }
}
.transparent {
  color: #fff;
}
.homepage-user-header {
  width: 100%;
  .user-info-header {
    position: relative;
    width: 100%;
    min-height: 4.3rem;

    .background-bg {
      position: absolute;
      top: 0;
      width: 100%;
    }

    .user-info-detail {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 0.3rem;
      display: flex;
      flex-direction: row;
      align-items: center;

      .avatar {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        border: 2px solid white;
        overflow: hidden;
        margin-right: 0.3rem;
        margin-bottom: -0.4rem;
      }

      .nickname {
        font-size: 0.4rem;
        color: white;
      }

      .uid {
        font-size: 0.32rem;
        color: white;
        padding-bottom: 0.1rem;
      }

      .vip-info {
        margin: 4px 0;
        display: flex;
        flex-direction: row;
        align-items: center;

        .vip-level {
          // height: 0.45rem;
          margin-right: 0.2rem;
        }

        .auth-level {
          display: flex;
          flex-direction: row;
          align-items: center;
          color: white;
          font-style: oblique;
          border-radius: 35px;
          padding-right: 0.2rem;
          font-size: 10px;
          background-image: linear-gradient(to right, #fe9ba8, #da3a82);

          img {
            width: 0.4rem;
            margin-right: 0.1rem;
          }
        }
      }
    }
  }

  .number_info {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 0.5rem;
    padding: 0.32rem;

    .number_item {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-right: 0.5rem;

      .number {
        font-size: 0.5rem;
        font-weight: bold;
        color: #333;
      }

      .title {
        color: #999999;
        font-size: 0.4rem;
        // margin-top: 0.266rem;
      }
    }
  }
}

.rz_text {
  display: flex;
  color: #777;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 0.32rem;
  font-size: 12px;
  margin-bottom: 12px;
}
.user_page_box {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--van-nav-bar-height));
  width: 100%;
  overflow: hidden;
}
.my-search {
  :deep(.van-cell) {
    font-size: 12px;
  }
}
.btn-search {
  font-size: 14px;
  color: #428af7;
}
</style>
