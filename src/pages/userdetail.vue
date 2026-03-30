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

/** 开发环境：在浏览器控制台打印「用户信息」与「标签接口」便于对照 */
const detailDebug = import.meta.env.DEV && import.meta.client
watch(
  userInfo,
  v => {
    if (!detailDebug) return
    console.log('%c========== [userdetail] ① 用户信息 /api/users/getUserHome（useMyFetch.data）==========', 'font-weight:bold;color:#1677ff')
    console.log('完整 userInfo 对象：', v)
    console.log('字段 tags_ary（类型里预留的个人标签名，后端若返回会在这里）：', v?.tags_ary)
  },
  { deep: true, immediate: true }
)

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
  api: 'api/users/videos',
  startRefreshEmptyData: true,
  params: {
    show_type: 0
  }
})

const {
  listData: shorts,
  loading: shortsLoading,
  isEmpty: shortsEmpty,
  isEnd: shortsEnd,
  execute: shortsMore,
  refresh: shortsRefresh,
  reset: shortsReset,
  page
} = useFetchList<VideoItem>({
  api: 'api/users/videos',
  startRefreshEmptyData: true,
  params: {
    show_type: 1
  }
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

/** 他人主页标签：get_userhome_tags */
const homeTagList = ref<{ id: number; name: string }[]>([])

function normalizeUserhomeTagRows(payload: unknown): { id: number; name: string; status?: number | string }[] {
  if (Array.isArray(payload)) return payload as { id: number; name: string; status?: number | string }[]
  if (payload && typeof payload === 'object' && Array.isArray((payload as { list?: unknown }).list)) {
    return (payload as { list: { id: number; name: string; status?: number | string }[] }).list
  }
  return []
}

/** 文档：1 已勾选、2 未选中；仅返回已选列表时可能不带 status */
function shouldShowHomeTag(t: { status?: number | string }) {
  if (t.status === undefined || t.status === null || t.status === '') return true
  return Number(t.status) === 1
}

async function loadUserhomeTags() {
  const raw = route.query.id
  const id = Array.isArray(raw) ? raw[0] : raw
  if (id == null || id === '') {
    homeTagList.value = []
    if (detailDebug) {
      console.log('%c========== [userdetail] ② 标签接口 /api/users/get_userhome_tags（跳过：无 id）==========', 'font-weight:bold;color:#ee0a24')
      console.log({ fullPath: route.fullPath, query: { ...route.query } })
    }
    return
  }
  try {
    const res = await __.$Api.User.getUserhomeTags({ to_uid: String(id) })
    const rows = normalizeUserhomeTagRows(res?.data)
    let picked = rows.filter(shouldShowHomeTag).map(t => ({ id: Number(t.id), name: String(t.name ?? '') }))
    if (picked.length === 0 && rows.length > 0) {
      picked = rows.map(t => ({ id: Number(t.id), name: String(t.name ?? '') }))
      if (detailDebug) {
        console.warn('[userdetail] 按 status 过滤后为空，已回退展示接口返回的全部项', { rows })
      }
    }
    homeTagList.value = picked.filter(t => t.name)

    if (detailDebug) {
      console.log('%c========== [userdetail] ② 标签接口 /api/users/get_userhome_tags ==========', 'font-weight:bold;color:#07c160')
      console.log('请求参数 to_uid：', String(id))
      console.log('整包响应 res（解密后，含 status/msg/data）：', res)
      console.log('res.data（标签接口返回的原始 data，一般为数组）：', res?.data)
      console.log('归一化后的 rows：', rows)
      console.log('页面用于渲染的 homeTagList：', homeTagList.value)
    }
  } catch (err) {
    homeTagList.value = []
    if (detailDebug) {
      console.log('%c========== [userdetail] ② 标签接口 /api/users/get_userhome_tags（请求失败）==========', 'font-weight:bold;color:#ee0a24')
      console.warn(err)
    }
  }
}

watch(
  () => route.fullPath,
  () => {
    loadUserhomeTags()
  },
  { immediate: true }
)

const fetchMap = {
  '2': () =>
    likeMore({
      uid: route.query.id,
      kwy: likeSearch.value
    }),
  '3': () =>
    buyMore({
      uid: route.query.id,
      kwy: buySearch.value
    }),
  '4': () =>
    postMore({
      aff: route.query.id,
      kwy: postSearch.value
    }),
  '0': () =>
    videoMore({
      uid: route.query.id,
      kwy: videoSearch.value
    }),

  '1': () =>
    shortsMore({
      uid: route.query.id,
      kwy: postSearch.value
    })
}

const onRender = (type: keyof typeof fetchMap) => {
  if (uid.value) {
    fetchMap[type]?.()
  }
}

const clearMap = {
  '2': () =>
    likeRefresh({
      uid: route.query.id
    }),
  '3': () =>
    buyRefresh({
      uid: route.query.id
    }),

  '4': () =>
    postRefresh({
      aff: route.query.id
    }),
  '0': () =>
    videoRefresh({
      uid: route.query.id
    }),
  '1': () =>
    shortsRefresh({
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
  '2': () =>
    likeRefresh({
      uid: route.query.id,
      kwy: likeSearch.value
    }),
  '3': () =>
    buyRefresh({
      uid: route.query.id,
      kwy: buySearch.value
    }),

  '0': () =>
    videoRefresh({
      kwy: videoSearch.value,
      uid: route.query.id
    }),
  '4': () =>
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
  shortsReset()
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
  // keepalive 页面从「我的」点头像回来时 fullPath 可能不变，watch 不触发；此处必拉标签
  loadUserhomeTags()
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
      style="--van-nav-bar-z-index: 10"
      :title="is_show_bg ? userInfo?.nickname : ''"
      class="transition-all duration-200"
      :class="is_show_bg ? '!bg-white' : 'transparent'"
      :border="false"
    ></dx-navbar>

    <scroll-list ref="list" :is-ready="!loading" class="mt-[-50px]">
      <div class="homepage-user-header">
        <div class="user-info-header">
          <div class="user-info-detail">
            <div class="avatar"><img :key="userInfo?.avatar_url" v-lazyLoad="userInfo?.avatar_url" /></div>
            <div class="mt-0.5 flex-1">
              <div class="nickname flex items-center">
                <span class="max-w-[140px]">
                  {{ userInfo?.nickname }}
                </span>
                <div class="vip-info ml-1">
                  <vip-icon :data="userInfo"></vip-icon>
                  <div v-if="userInfo?.auth_level >= 4" class="auth-level">
                    <img src="~/assets/image/creator.png" />
                    <span>制片人LV.{{ userInfo?.auth_level }}</span>
                  </div>
                </div>
              </div>

              <div class="uid">ID:{{ userInfo?.uid }}</div>
            </div>
          </div>
          <div v-if="userInfo?.person_signnatrue" class="rz_text">
            简介：
            <div class="flex-1" v-html="userInfo.person_signnatrue.replaceAll('\n', '<br/>')"></div>
          </div>
          <div class="number_info flex items-center justify-between">
            <div class="flex items-center space-x-[25px]">
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

            <div v-if="!isMyDetail && !loading" class="user-action-buttons flex">
              <btn-follow :key="userInfo.uid" :attention="follow ? 1 : 0" :uid="userInfo.uid" use-toast>
                <template #default="{ text }">
                  <dx-button color="linear-gradient(to right, #FF0000,  #FDA03D)">
                    {{ text }}
                  </dx-button>
                </template>
              </btn-follow>

              <dx-button
                v-if="userInfo?.uid"
                color="linear-gradient(to right, #00D0FF,  #3D9DFD)"
                :to="`/chat/room?uid=${userInfo.uid}&name=${userInfo.nickname}`"
              >
                聊天
              </dx-button>
            </div>
          </div>

          <div v-if="!isMyDetail && homeTagList.length" class="user-tags">
            <div v-for="tag in homeTagList" :key="tag.id" class="user-tag">
              {{ tag.name }}
            </div>
          </div>
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
            <van-tab title="视频">
              <div class="container">
                <van-search
                  v-model="videoSearch"
                  class="my-search"
                  show-action
                  shape="round"
                  clear-trigger="always"
                  placeholder="请输入标题查找作品"
                  @search="onSearch('0')"
                  @clear="onClear('0')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('0')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="videoLoading"
                    :pull-down-refresh="clearMap['0']"
                    :is-end="videoEnd"
                    :is-empty="videoEmpty"
                    :pullup="fetchMap['0']"
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
            <van-tab title="短视频">
              <div class="container">
                <scroll-list
                  v-model:loading="shortsLoading"
                  :pull-down-refresh="clearMap['1']"
                  :is-end="shortsEnd"
                  :is-empty="shortsEmpty"
                  :pullup="fetchMap['1']"
                >
                  <div class="grid grid-cols-3 gap-1 px-1">
                    <video-tiktok-item
                      v-for="(item, index) in shorts"
                      :key="item.id"
                      :list="shorts"
                      :index="index"
                      :item="item"
                      show-title
                      api="api/users/videos"
                      :params="{
                        show_type: 1,
                        page: page.page,
                        uid: route.query.id
                      }"
                    ></video-tiktok-item>
                  </div>
                </scroll-list>
              </div>
            </van-tab>
            <van-tab title="收藏">
              <div class="container">
                <van-search
                  v-model="likeSearch"
                  class="my-search"
                  show-action
                  shape="round"
                  placeholder="请输入标题查找作品"
                  clear-trigger="always"
                  @search="onSearch('2')"
                  @clear="onClear('2')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('2')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="likeLoading"
                    :pull-down-refresh="clearMap['2']"
                    :is-end="likeEnd"
                    :is-empty="likeEmpty"
                    :pullup="fetchMap['2']"
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
                  @search="onSearch('3')"
                  @clear="onClear('3')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('3')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="buyLoading"
                    :pull-down-refresh="clearMap['3']"
                    :is-end="buyEnd"
                    :is-empty="buyEmpty"
                    :pullup="fetchMap['3']"
                  >
                    <div class="grid grid-cols-2 gap-1 px-1">
                      <video-card v-for="(item, index) in buys" :key="item.id" :index="index" :item="item"></video-card>
                    </div>
                  </scroll-list>
                </div>
              </div>
            </van-tab>

            <van-tab title="发帖">
              <div class="container">
                <van-search
                  v-model="postSearch"
                  class="my-search"
                  show-action
                  shape="round"
                  placeholder="请输入标题查找作品"
                  clear-trigger="always"
                  @search="onSearch('4')"
                  @clear="onClear('4')"
                >
                  <template #action>
                    <div class="btn-search" @click="onSearch('4')">搜索</div>
                  </template>
                </van-search>
                <div class="scroll-container">
                  <scroll-list
                    v-model:loading="postLoading"
                    :is-end="postEnd"
                    :pull-down-refresh="clearMap['4']"
                    :is-empty="postEmpty"
                    :pullup="fetchMap['4']"
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
  </div>
</template>

<style lang="less" scoped>
.dx-tabs {
  --van-tabs-nav-background: #fff;

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
  --van-tabs-nav-background: #fff;
  width: 100%;

  .user-info-header {
    background-image: url(@/assets/image/user/user-bg.png);
    position: relative;
    width: 100%;
    padding-top: 128px;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      backdrop-filter: blur(3px);
      content: '';
    }

    .user-info-detail {
      width: 100%;
      padding: 0 0.3rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      position: relative;
      z-index: 1;
      background: #fff;
      border-radius: 20px 20px 0 0;

      .avatar {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        border: 2px solid white;
        overflow: hidden;
        margin-right: 0.3rem;
        margin-top: -28px;
      }

      .nickname {
        font-size: 0.4rem;
      }

      .uid {
        font-size: 0.32rem;
        padding-bottom: 0.1rem;
        color: #919191;
        margin-top: 2px;
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
    padding: 4px 12px 12px;
    position: relative;
    z-index: 1;
    background: #fff;
    justify-content: space-between;

    .number_item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .number {
        font-size: 13px;
        font-weight: 500;
        color: #2c2c2c;
      }

      .title {
        color: #919191;
        font-size: 11px;
        // margin-top: 0.266rem;
      }
    }

    .user-action-buttons {
      align-items: baseline;
      gap: 10px;
      :deep(.van-button) {
        height: 24px;
        padding: 3px 10px;
        border-radius: 5px !important;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }

  .user-tags {
    width: 100%;
    padding: 4px 12px 12px;
    display: flex;
    flex-direction: row;
    gap: 5px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    position: relative;
    z-index: 1;

    .user-tag {
      flex-shrink: 0;
      padding: 3px 10px;
      height: 24px;
      line-height: 18px;
      border-radius: 999px;
      background: #e6f4ff;
      font-size: 12px;
      color: #3da7fd;
    }
  }
}

.rz_text {
  display: flex;
  color: #919191;
  flex-direction: row;
  align-items: flex-start;
  font-size: 12px;
  background-color: #fff;
  position: relative;
  z-index: 1;
  padding: 6px 12px 10px;
}

.user_page_box {
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
  color: var(--dx-primary-color);
}

.border-item {
  border: 2px solid rgba(255, 255, 255, 0.4) !important;
  width: 110px;
  border-radius: 50px;
  overflow: hidden;

  :deep(.van-button) {
    width: 100%;
  }

  &:nth-child(1) {
    margin-left: 24px;
  }

  &:nth-child(2) {
    margin-right: 24px;
  }
}
</style>
