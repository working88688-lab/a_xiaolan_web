<template>
  <div class="container">
    <div class="scroll-container">
      <dx-tabs
        v-model:active="nav_tab"
        center
        shrink
        swipeable
        line-width="0"
        title-active-color="#333"
        line-height="0"
        class="main-tabs dx-tabs first-no-padding primary-tabs"
      >
        <template #left>
          <van-icon name="arrow-left" class="!absolute left-0 p-1 !text-2xl" @click="__.$Back"></van-icon>
        </template>
        <template #right>
          <publish-popup v-show="nav_tab === 0" class="original-auth-btn !absolute right-0 flex items-center p-1">
            <span class="original-auth-btn">原创认证</span>
          </publish-popup>
        </template>
        <van-tab title="视频">
          <dx-tabs v-model:active="video_tab" class="dx-tabs primary-tabs" animated swipeable>
            <van-tab title="上架中">
              <dx-hoc-list v-if="key" ref="published_list_ref" :filter="filter" :api="publishedListApi">
                <template #item="{ item }">
                  <div
                    class="work-item work-item--clickable"
                    role="button"
                    tabindex="0"
                    @click="onOpenVideoDetail(item)"
                    @keydown.enter.prevent="onOpenVideoDetail(item)"
                    @keydown.space.prevent="onOpenVideoDetail(item)"
                  >
                    <video-item-cover
                      :key="item.id"
                      class="work-cover"
                      :width-px="150"
                      :views="item.rating"
                      :poster="resolveWorkCover(item)"
                    />
                    <div class="work-info">
                      <div class="video-title">
                        {{ item.title }}
                      </div>
                      <div class="work-row">
                        <div class="work-time">{{ item.created_str }}</div>
                        <div class="work-coin">
                          <span class="work-coin-text">{{ item.coins }}金币</span>
                        </div>
                      </div>
                      <div class="work-footer">
                        <div class="work-footer-stats">
                          <div class="work-footer-item">
                            <svg
                              class="work-stat-icon"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.0466 4.30859C17.2219 4.30859 21.5536 10.0235 22.6706 11.6328C22.847 11.8873 22.8459 12.2125 22.6677 12.4658C21.546 14.0603 17.2158 19.6953 12.0466 19.6953C6.87533 19.6951 2.54397 14.019 1.42454 12.417C1.24721 12.163 1.24711 11.8379 1.42454 11.584C2.54406 9.98235 6.87543 4.30878 12.0466 4.30859ZM12.0466 8.76172C10.2572 8.76185 8.80637 10.2125 8.80637 12.002C8.80648 13.7913 10.2573 15.2421 12.0466 15.2422C13.8361 15.2422 15.2867 13.7914 15.2868 12.002C15.2868 10.2124 13.8361 8.76172 12.0466 8.76172Z"
                                fill="#919191"
                              />
                            </svg>
                            <span>{{ $Utils.formatNumber(item.rating) || 0 }}</span>
                          </div>
                          <div class="work-footer-item">
                            <svg
                              class="work-stat-icon"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M12.1692 4.95688C13.0836 3.67641 14.585 3 16.2368 3C19.3828 3 21.9994 5.68213 21.9994 8.87067V8.87186L22 8.87054C22 8.96144 21.9984 9.03027 21.9973 9.08091C21.9956 9.15042 21.9948 9.18565 22 9.19668C21.9881 9.86733 21.8703 10.4214 21.661 11.1536C21.5423 11.285 21.432 11.5326 21.3221 11.8059C21.1487 12.0705 21.0831 12.1987 20.9831 12.4582C20.8811 12.6264 20.7727 12.7955 20.6587 12.9649C19.8181 14.2179 18.6938 15.4649 17.5705 16.5717C15.8123 18.3149 14.0212 19.766 13.242 20.3972C13.0269 20.5715 12.8889 20.6833 12.85 20.7215C12.5739 20.9929 12.2978 20.9997 12.0216 20.9999C12.0143 21 12.007 21 11.9997 21C11.4332 21 11.15 20.7216 10.8668 20.4433C10.8451 20.4221 10.7901 20.3775 10.7061 20.3114C9.84792 19.6897 7.91663 18.1718 6.10195 16.3408C4.71753 14.9563 3.38321 13.3678 2.65302 11.8144C2.36979 11.2577 2.01641 9.93229 2 9.19681C2.00604 9.19092 2.0051 9.15549 2.00323 9.08479C2.00186 9.03304 2 8.96243 2 8.87067C2 5.68068 4.61508 3 7.76254 3C9.41143 3 10.9143 3.67641 12.1692 4.95688Z"
                                fill="#919191"
                              />
                            </svg>
                            <span>{{ item.like_count || 0 }}</span>
                          </div>
                          <div class="work-footer-item">
                            <svg
                              class="work-stat-icon"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M11.3158 2.73116C11.6272 2.21714 12.373 2.21714 12.6844 2.73116L15.2614 6.98546C15.3728 7.16938 15.5536 7.3007 15.7629 7.34982L20.6053 8.48609C21.1904 8.62337 21.4209 9.33264 21.0282 9.78761L17.7785 13.5532C17.638 13.716 17.569 13.9285 17.5869 14.1427L18.0027 19.0993C18.0529 19.6982 17.4496 20.1365 16.8955 19.9037L12.31 17.9766C12.1118 17.8933 11.8884 17.8933 11.6902 17.9766L7.10466 19.9037C6.55063 20.1365 5.94729 19.6982 5.99752 19.0993L6.41326 14.1427C6.43123 13.9285 6.36219 13.716 6.22171 13.5532L2.97197 9.78761C2.57933 9.33264 2.80979 8.62337 3.39486 8.48609L8.2373 7.34982C8.44664 7.3007 8.62739 7.16938 8.7388 6.98546L11.3158 2.73116Z"
                                fill="#919191"
                              />
                            </svg>
                            <span>{{ item.favorite_count || 0 }}</span>
                          </div>
                        </div>
                        <!-- 暂时注释掉 -->
                        <!-- <div class="work-action" @click="onDownShelves(item)">下架</div> -->
                      </div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="待审核">
              <dx-hoc-list v-if="key" ref="pending_list_ref" :api="submitListApi">
                <template #item="{ item }">
                  <div
                    class="work-item work-item--clickable"
                    role="button"
                    tabindex="0"
                    @click="onOpenVideoDetail(item)"
                    @keydown.enter.prevent="onOpenVideoDetail(item)"
                    @keydown.space.prevent="onOpenVideoDetail(item)"
                  >
                    <video-item-cover
                      :key="item.id"
                      class="work-cover"
                      :width-px="150"
                      :views="item.rating"
                      :poster="resolveWorkCover(item)"
                      :show-bottom-meta="false"
                    />
                    <div class="work-info">
                      <div class="video-title">
                        {{ item.title }}
                      </div>
                      <div class="work-row">
                        <div class="work-time">{{ item.created_str }}</div>
                        <div class="work-coin">
                          <span class="work-coin-text">{{ item.coins }}金币</span>
                        </div>
                      </div>
                      <div class="work-footer work-footer--trailing">
                        <button type="button" class="work-delete-btn" @click.stop="onDeletePending(item)">
                          <svg
                            class="work-delete-btn__icon"
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M24.8638 5.25508H20.9864C20.9646 5.10742 20.9181 4.95977 20.847 4.81484L19.8927 2.8543C19.57 2.18984 18.7989 1.75781 17.9431 1.75781H10.0681C9.21221 1.75781 8.44111 2.18984 8.11846 2.8543L7.16143 4.81484C7.09033 4.9625 7.04385 5.11016 7.01924 5.25508H3.09814C2.34619 5.25508 1.73096 5.87031 1.73096 6.62227V7.37695C1.73096 8.12891 2.34619 8.74414 3.09814 8.74414H5.22549V24.8715C5.22549 25.6234 5.84072 26.2387 6.59268 26.2387H21.3474C22.0993 26.2387 22.7146 25.6234 22.7146 24.8715V8.74141H24.8665C25.6185 8.74141 26.2337 8.12617 26.2337 7.37422V6.61953C26.231 5.87031 25.6157 5.25508 24.8638 5.25508ZM10.5548 21.8527C10.5548 22.3422 10.1556 22.7414 9.66611 22.7414C9.17666 22.7414 8.77744 22.3422 8.77744 21.8527V11.3828C8.77744 10.8934 9.17666 10.4941 9.66611 10.4941C10.1556 10.4941 10.5548 10.8934 10.5548 11.3828V21.8527ZM14.9544 21.8527C14.9544 22.3422 14.5552 22.7414 14.0657 22.7414C13.5763 22.7414 13.1771 22.3422 13.1771 21.8527V11.3828C13.1771 10.8934 13.5763 10.4941 14.0657 10.4941C14.5552 10.4941 14.9544 10.8934 14.9544 11.3828V21.8527ZM19.3349 21.8527C19.3349 22.3422 18.9356 22.7414 18.4462 22.7414C17.9567 22.7414 17.5575 22.3422 17.5575 21.8527V11.3828C17.5575 10.8934 17.9567 10.4941 18.4462 10.4941C18.9356 10.4941 19.3349 10.8934 19.3349 11.3828V21.8527Z"
                              fill="#D5D5D5"
                            />
                          </svg>
                          <span class="work-delete-btn__text">删除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="未通过">
              <dx-hoc-list v-if="key" ref="rejected_list_ref" :api="rejectListApi">
                <template #item="{ item }">
                  <div class="work-item-block">
                    <div
                      class="work-item work-item--clickable"
                      role="button"
                      tabindex="0"
                      @click="onOpenVideoDetail(item)"
                      @keydown.enter.prevent="onOpenVideoDetail(item)"
                      @keydown.space.prevent="onOpenVideoDetail(item)"
                    >
                      <video-item-cover
                        :key="item.id"
                        class="work-cover"
                        :width-px="150"
                        :views="item.rating"
                        :poster="resolveWorkCover(item)"
                        :show-bottom-meta="false"
                      />
                      <div class="work-info">
                        <div class="video-title">
                          {{ item.title }}
                        </div>
                        <div class="work-row">
                          <div class="work-time">{{ item.created_str }}</div>
                          <div class="work-coin">
                            <span class="work-coin-text">{{ item.coins }}金币</span>
                          </div>
                        </div>
                        <div class="work-footer work-footer--trailing">
                          <button type="button" class="work-delete-btn" @click.stop="onDeletePending(item)">
                            <svg
                              class="work-delete-btn__icon"
                              width="28"
                              height="28"
                              viewBox="0 0 28 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M24.8638 5.25508H20.9864C20.9646 5.10742 20.9181 4.95977 20.847 4.81484L19.8927 2.8543C19.57 2.18984 18.7989 1.75781 17.9431 1.75781H10.0681C9.21221 1.75781 8.44111 2.18984 8.11846 2.8543L7.16143 4.81484C7.09033 4.9625 7.04385 5.11016 7.01924 5.25508H3.09814C2.34619 5.25508 1.73096 5.87031 1.73096 6.62227V7.37695C1.73096 8.12891 2.34619 8.74414 3.09814 8.74414H5.22549V24.8715C5.22549 25.6234 5.84072 26.2387 6.59268 26.2387H21.3474C22.0993 26.2387 22.7146 25.6234 22.7146 24.8715V8.74141H24.8665C25.6185 8.74141 26.2337 8.12617 26.2337 7.37422V6.61953C26.231 5.87031 25.6157 5.25508 24.8638 5.25508ZM10.5548 21.8527C10.5548 22.3422 10.1556 22.7414 9.66611 22.7414C9.17666 22.7414 8.77744 22.3422 8.77744 21.8527V11.3828C8.77744 10.8934 9.17666 10.4941 9.66611 10.4941C10.1556 10.4941 10.5548 10.8934 10.5548 11.3828V21.8527ZM14.9544 21.8527C14.9544 22.3422 14.5552 22.7414 14.0657 22.7414C13.5763 22.7414 13.1771 22.3422 13.1771 21.8527V11.3828C13.1771 10.8934 13.5763 10.4941 14.0657 10.4941C14.5552 10.4941 14.9544 10.8934 14.9544 11.3828V21.8527ZM19.3349 21.8527C19.3349 22.3422 18.9356 22.7414 18.4462 22.7414C17.9567 22.7414 17.5575 22.3422 17.5575 21.8527V11.3828C17.5575 10.8934 17.9567 10.4941 18.4462 10.4941C18.9356 10.4941 19.3349 10.8934 19.3349 11.3828V21.8527Z"
                                fill="#D5D5D5"
                              />
                            </svg>
                            <span class="work-delete-btn__text">删除</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="work-reason work-reason-below">
                      原因：{{ item.refuse_reason || item.reject_reason || item.remark || 'xxxxxxxx原因文案' }}
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="已下架">
              <dx-hoc-list v-if="key" ref="hide_list_ref" :api="hideListApi">
                <template #item="{ item }">
                  <div class="work-item-block">
                    <div
                      class="work-item work-item--clickable"
                      role="button"
                      tabindex="0"
                      @click="onOpenVideoDetail(item)"
                      @keydown.enter.prevent="onOpenVideoDetail(item)"
                      @keydown.space.prevent="onOpenVideoDetail(item)"
                    >
                      <video-item-cover
                        :key="item.id"
                        class="work-cover"
                        :width-px="150"
                        :views="item.rating"
                        :poster="resolveWorkCover(item)"
                        :show-bottom-meta="false"
                      />
                      <div class="work-info work-info--start">
                        <div class="video-title">
                          {{ item.title }}
                        </div>
                        <div class="work-row">
                          <div class="work-time">{{ item.created_str }}</div>
                          <div class="work-coin">
                            <span class="work-coin-text">{{ item.coins }}金币</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="work-reason work-reason-below">
                      原因：{{
                        item.hide_reason_text || item.reason || item.hide_reason || item.remark || 'xxxxxxxx原因文案'
                      }}
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
          </dx-tabs>
        </van-tab>
      </dx-tabs>
    </div>
    <div v-show="nav_tab === 0" class="px-3 py-1.5">
      <dx-button block class="publish-btn" @click="onGoPublishVideo">发布视频</dx-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const globalStore = useGlobalStore()
const appConfig = useAppConfig()
const router = useRouter()

/** 作品封面多为根相对路径，拼资源域；完整 URL 仍走 dx-image + lazyLoad 解密 */
function getMediaOrigin(): string {
  const thumb = globalStore.config?.activity_thumb || globalStore.config?.index_ads_thumb
  if (thumb) {
    try {
      return new URL(thumb).origin
    } catch {
      /* use api host */
    }
  }
  const base = appConfig.api?.baseURL as string | undefined
  if (base) {
    try {
      return new URL(base).origin
    } catch {
      /* ignore */
    }
  }
  return ''
}

function resolveMediaUrl(path: string | undefined): string {
  if (!path?.trim()) return ''
  const p = path.trim()
  if (/^https?:\/\//i.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p
  if (p.startsWith('//')) {
    if (import.meta.client) return window.location.protocol + p
    return 'https:' + p
  }
  const origin = getMediaOrigin()
  if (!origin) return p
  if (p.startsWith('/')) return origin + p
  return `${origin}/${p}`
}

function resolveWorkCover(item: { cover_thumb_url?: string; cover?: string; thumb?: string }): string {
  return resolveMediaUrl(item.cover_thumb_url || item.cover || item.thumb)
}

const nav_tab = ref(0)

const video_tab = ref(0)
const route = useRoute()
const search_value = ref('')

/*
 * 本地 mock（调 UI 用）：需要时整段改回可执行代码，并恢复 import type { ApiLike, Result }
 * 与 publishedListApi 等处的 USE_MOCK_MY_WORK_UI ? createMockWorkListApi(...) : 写法。
 *
const USE_MOCK_MY_WORK_UI = import.meta.dev

function createMockWorkListApi(rows: any[]): ApiLike {
  return (async (_params?: any) => {
    await new Promise<void>(resolve => setTimeout(resolve, 100))
    const page = Number(_params?.page) || 1
    const list = page > 1 ? [] : rows.map(r => ({ ...r }))
    const body: Result<{ list: any[] }> = {
      data: { list },
      status: 0,
      crypt: false,
      isVV: false,
      msg: '',
      needLogin: false
    }
    return body
  }) as ApiLike
}

const MOCK_PUBLISHED = [
  {
    id: 10001,
    title: '春季旅拍合集 · 上架中示例',
    rating: 128_900,
    cover_thumb_url: 'https://picsum.photos/seed/mw-pub1/240/360',
    created_str: '2026-03-20 14:20',
    coins: 36,
    like_count: 2103,
    favorite_count: 856
  },
  {
    id: 10002,
    title: '这支片子标题故意写长一点用来检查两行省略号展示效果是否还整齐',
    rating: 5420,
    cover_thumb_url: 'https://picsum.photos/seed/mw-pub2/240/360',
    created_str: '2026-03-18 09:10',
    coins: 12,
    like_count: 88,
    favorite_count: 34
  },
  {
    id: 10003,
    title: '教程类 · 低成本布光',
    rating: 89_000_000,
    cover_thumb_url: 'https://picsum.photos/seed/mw-pub3/240/360',
    created_str: '2026-03-01 22:00',
    coins: 0,
    like_count: 12000,
    favorite_count: 4001
  }
]

const MOCK_SUBMIT = [
  {
    id: 20001,
    title: '待审核：刚上传的 Vlog 草稿',
    rating: 0,
    cover_thumb_url: 'https://picsum.photos/seed/mw-sub1/240/360',
    created_str: '2026-03-28 11:05',
    coins: 22,
    like_count: 0,
    favorite_count: 0
  },
  {
    id: 20002,
    title: '待审核第二条',
    rating: 12,
    cover_thumb_url: 'https://picsum.photos/seed/mw-sub2/240/360',
    created_str: '2026-03-27 16:40',
    coins: 15,
    like_count: 0,
    favorite_count: 0
  }
]

const MOCK_REJECT = [
  {
    id: 30001,
    title: '未通过：封面不合规示例',
    rating: 300,
    cover_thumb_url: 'https://picsum.photos/seed/mw-rej1/240/360',
    created_str: '2026-03-10 10:10',
    coins: 8,
    like_count: 2,
    favorite_count: 1,
    reject_reason: '封面含有第三方平台水印，请更换后重新提交'
  },
  {
    id: 30002,
    title: '未通过：分类选错',
    rating: 0,
    cover_thumb_url: 'https://picsum.photos/seed/mw-rej2/240/360',
    created_str: '2026-03-09 08:00',
    coins: 5,
    like_count: 0,
    favorite_count: 0,
    reason: '视频内容与所选分类不符'
  }
]

const MOCK_HIDE = [
  {
    id: 40001,
    title: '已下架 · 可重新上架',
    rating: 9000,
    cover_thumb_url: 'https://picsum.photos/seed/mw-hid1/240/360',
    created_str: '2026-02-01 12:00',
    coins: 60,
    like_count: 120,
    favorite_count: 40,
    hide_reason_text: '用户主动下架',
    can_delete: 0
  },
  {
    id: 40002,
    title: '已下架 · 展示删除按钮',
    rating: 210,
    cover_thumb_url: 'https://picsum.photos/seed/mw-hid2/240/360',
    created_str: '2026-01-15 18:30',
    coins: 3,
    like_count: 5,
    favorite_count: 2,
    hide_reason_text: '违反社区规范，已做下架处理',
    can_delete: 1
  }
]

const publishedListApi = USE_MOCK_MY_WORK_UI ? createMockWorkListApi(MOCK_PUBLISHED) : __.$Api.Video.published
const submitListApi = USE_MOCK_MY_WORK_UI ? createMockWorkListApi(MOCK_SUBMIT) : __.$Api.Video.submit
const rejectListApi = USE_MOCK_MY_WORK_UI ? createMockWorkListApi(MOCK_REJECT) : __.$Api.Video.reject
const hideListApi = USE_MOCK_MY_WORK_UI ? createMockWorkListApi(MOCK_HIDE) : __.$Api.Video.hide
*/

const publishedListApi = __.$Api.Video.published
const submitListApi = __.$Api.Video.wait
const rejectListApi = __.$Api.Video.reject
const hideListApi = __.$Api.Video.hide

const filter = (item: any) => {
  const t = item.title ?? ''
  return String(t).includes(search_value.value)
}
const pending_list_ref = useTemplateRef('pending_list_ref')
const rejected_list_ref = useTemplateRef('rejected_list_ref')
const hide_list_ref = useTemplateRef('hide_list_ref')
const published_list_ref = useTemplateRef('published_list_ref')
const hide_reasons = ref<{ key: string; label: string }[]>([])

const getHideReasonKey = async () => {
  if (hide_reasons.value.length > 0) {
    return hide_reasons.value[0]?.key || 'user'
  }
  try {
    const res = await __.$Api.Video.hideReasons()
    hide_reasons.value = Array.isArray(res) ? res : []
  } catch (_error) {
    hide_reasons.value = []
  }
  return hide_reasons.value[0]?.key || 'user'
}

const onDeletePending = async (item: any) => {
  try {
    await __.$Confirm({
      title: '确定删除该视频吗？'
    })
    await __.$Api.Video.delSubmit({
      mv_id: item.id || item.mv_id
    })
    pending_list_ref.value?.refresh_data()
    rejected_list_ref.value?.refresh_data()
  } catch (_error) {
    // noop
  }
}

const onDownShelves = async (item: any) => {
  try {
    await __.$Confirm({
      title: '确定下架该视频吗？'
    })
    const hide_reason = await getHideReasonKey()
    await __.$Api.Video.downShelves({
      mv_id: item.id || item.mv_id,
      hide_reason
    })
    published_list_ref.value?.refresh_data()
    hide_list_ref.value?.refresh_data()
  } catch (_error) {
    // noop
  }
}

const init_active_tab = () => {
  return Number(route.query._index) || 0
}
const { key, activeTab: active_tab } = useKeepAlive({
  reset: () => {
    active_tab.value = 0
    nav_tab.value = 0
    video_tab.value = 0
  },
  defaultActiveTab: init_active_tab(),

  effect() {
    const index = init_active_tab()
    nav_tab.value = index ? 1 : 0
    active_tab.value = index
  }
} as any)

const onTips = async () => {
  const res = await __.$Alert({
    message: '请下载安卓APP使用发布视频和视频管理！'
  })

  if (res === 'confirm') {
    __.$Utils.onWinOpen(__.$Store.global.config.share_url)
  }
}

function onGoPublishVideo() {
  router.push('/publish/video')
}

function onOpenVideoDetail(item: any) {
  const id = item?.id || item?.mv_id
  if (!id) return
  router.push({
    path: '/player',
    query: { id }
  })
}
</script>

<style lang="postcss" scoped>
.main-tabs > :deep(.van-tabs__wrap) {
  .van-tabs__nav {
    align-items: center;
  }
  .van-tab__text {
    transition: all 0.2s;
  }
  .van-tab--active {
    .van-tab__text {
      font-size: 17px;
    }
  }
}

.original-auth-btn {
  font-size: 12px;
  color: #2494ff !important;
}

.video-title {
  color: #151515;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-item-block {
  margin-bottom: 6px;
}

.work-item {
  margin: 10px 6px 0;
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  box-shadow: 0px 0px 25.5px 0px #00000012;
}

.work-item--clickable {
  cursor: pointer;
  touch-action: manipulation;
}

.work-cover {
  flex: 0 0 auto;
}

.work-info {
  margin-left: 6px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
}

/** 已下架等：标题与时间行靠上排布，不在竖直方向两端撑开 */
.work-info--start {
  justify-content: flex-start;
}

.work-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.work-time {
  font-size: 11px;
  color: #919191;
}

.work-coin {
  display: inline-flex;
  align-items: center;
  padding: 2px 4px;
  background: #ff7300;
  border-radius: 4px;
}

.work-coin-text {
  font-size: 10px;
  color: #ffffff;
}

.work-footer {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #919191;
}

.work-footer--trailing {
  justify-content: flex-end;
}

.work-delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.work-delete-btn__icon {
  display: block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.work-delete-btn__text {
  font-size: 11px;
  color: #919191;
}

.work-footer-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #919191;
}

.work-footer-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.work-icon {
  font-size: 14px;
  width: 14px;
  height: 14px;
  vertical-align: middle;
}

.work-stat-icon {
  display: block;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.work-delete {
  margin-left: auto;
  font-size: 11px;
  color: #919191;
}

.work-action {
  margin-left: auto;
  font-size: 11px;
  color: #2494ff;
}

.work-reason {
  margin-top: 4px;
  font-size: 12px;
  color: #ff3333;
}

.work-reason-below {
  margin: 8px 12px 0 12px;
  line-height: 1.45;
}

.publish-btn {
  border-radius: 5px !important;
}
</style>
