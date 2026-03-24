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
              <dx-hoc-list
                v-if="key"
                ref="published_list_ref"
                class="px-2"
                :filter="filter"
                :api="__.$Api.Video.published"
                :show-empty="false"
              >
                <template #item="{ item }">
                  <div class="work-item">
                    <video-item-cover
                      :key="item.id"
                      class="work-cover"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
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
                        <div class="work-footer-item">
                          <nuxt-icon name="video/play" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ $Utils.formatNumber(item.rating) || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <nuxt-icon name="video/like" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ item.like_count || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <span class="mr-[2px] inline-block">
                            <svg
                              class="work-icon"
                              width="14"
                              height="14"
                              viewBox="0 0 19 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.53899 0.387406C8.85036 -0.126613 9.59613 -0.126611 9.90749 0.387407L12.4845 4.64171C12.5959 4.82563 12.7767 4.95695 12.986 5.00607L17.8285 6.14234C18.4136 6.27962 18.644 6.98889 18.2514 7.44386L15.0016 11.2094C14.8611 11.3722 14.7921 11.5847 14.8101 11.799L15.2258 16.7555C15.2761 17.3544 14.6727 17.7928 14.1187 17.5599L9.53318 15.6329C9.33495 15.5496 9.11153 15.5496 8.9133 15.6329L4.32781 17.5599C3.77377 17.7928 3.17043 17.3544 3.22066 16.7555L3.63641 11.799C3.65438 11.5847 3.58534 11.3722 3.44485 11.2094L0.195116 7.44386C-0.197527 6.98889 0.0329301 6.27962 0.618008 6.14234L5.46045 5.00607C5.66979 4.95695 5.85054 4.82563 5.96194 4.64171L8.53899 0.387406Z"
                                fill="#919191"
                              />
                            </svg>
                          </span>
                          <span>{{ item.favorite_count || 0 }}</span>
                        </div>
                        <div class="work-action" @click="onDownShelves(item)">下架</div>
                      </div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="待审核">
              <dx-hoc-list v-if="key" ref="pending_list_ref" class="px-2" :api="__.$Api.Video.submit">
                <template #item="{ item }">
                  <div class="work-item">
                    <video-item-cover
                      :key="item.id"
                      class="work-cover"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
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
                        <div class="work-footer-item">
                          <nuxt-icon name="video/play" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ $Utils.formatNumber(item.rating) || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <nuxt-icon name="video/like" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ item.like_count || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <span class="mr-[2px] inline-block">
                            <svg
                              class="work-icon"
                              width="14"
                              height="14"
                              viewBox="0 0 19 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.53899 0.387406C8.85036 -0.126613 9.59613 -0.126611 9.90749 0.387407L12.4845 4.64171C12.5959 4.82563 12.7767 4.95695 12.986 5.00607L17.8285 6.14234C18.4136 6.27962 18.644 6.98889 18.2514 7.44386L15.0016 11.2094C14.8611 11.3722 14.7921 11.5847 14.8101 11.799L15.2258 16.7555C15.2761 17.3544 14.6727 17.7928 14.1187 17.5599L9.53318 15.6329C9.33495 15.5496 9.11153 15.5496 8.9133 15.6329L4.32781 17.5599C3.77377 17.7928 3.17043 17.3544 3.22066 16.7555L3.63641 11.799C3.65438 11.5847 3.58534 11.3722 3.44485 11.2094L0.195116 7.44386C-0.197527 6.98889 0.0329301 6.27962 0.618008 6.14234L5.46045 5.00607C5.66979 4.95695 5.85054 4.82563 5.96194 4.64171L8.53899 0.387406Z"
                                fill="#919191"
                              />
                            </svg>
                          </span>
                          <span>{{ item.favorite_count || 0 }}</span>
                        </div>
                        <div class="work-delete" @click="onDeletePending(item)">删除</div>
                      </div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="未通过">
              <dx-hoc-list v-if="key" ref="rejected_list_ref" class="px-2" :api="__.$Api.Video.reject">
                <template #item="{ item }">
                  <div class="work-item">
                    <video-item-cover
                      :key="item.id"
                      class="work-cover"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
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
                        <div class="work-footer-item">
                          <nuxt-icon name="video/play" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ $Utils.formatNumber(item.rating) || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <nuxt-icon name="video/like" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ item.like_count || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <span class="mr-[2px] inline-block">
                            <svg
                              class="work-icon"
                              width="14"
                              height="14"
                              viewBox="0 0 19 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.53899 0.387406C8.85036 -0.126613 9.59613 -0.126611 9.90749 0.387407L12.4845 4.64171C12.5959 4.82563 12.7767 4.95695 12.986 5.00607L17.8285 6.14234C18.4136 6.27962 18.644 6.98889 18.2514 7.44386L15.0016 11.2094C14.8611 11.3722 14.7921 11.5847 14.8101 11.799L15.2258 16.7555C15.2761 17.3544 14.6727 17.7928 14.1187 17.5599L9.53318 15.6329C9.33495 15.5496 9.11153 15.5496 8.9133 15.6329L4.32781 17.5599C3.77377 17.7928 3.17043 17.3544 3.22066 16.7555L3.63641 11.799C3.65438 11.5847 3.58534 11.3722 3.44485 11.2094L0.195116 7.44386C-0.197527 6.98889 0.0329301 6.27962 0.618008 6.14234L5.46045 5.00607C5.66979 4.95695 5.85054 4.82563 5.96194 4.64171L8.53899 0.387406Z"
                                fill="#919191"
                              />
                            </svg>
                          </span>
                          <span>{{ item.favorite_count || 0 }}</span>
                        </div>
                        <div class="work-delete" @click="onDeletePending(item)">删除</div>
                      </div>
                      <div class="work-reason">
                        原因：{{ item.reason || item.reject_reason || item.remark || 'xxxxxxxx原因文案' }}
                      </div>
                    </div>
                  </div>
                </template>
              </dx-hoc-list>
            </van-tab>
            <van-tab title="已下架">
              <dx-hoc-list v-if="key" ref="hide_list_ref" class="px-2" :api="__.$Api.Video.hide">
                <template #item="{ item }">
                  <div class="work-item">
                    <video-item-cover
                      :key="item.id"
                      class="work-cover"
                      :views="item.rating"
                      :poster="item.cover_thumb_url"
                      :height="2.75"
                    ></video-item-cover>
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
                        <div class="work-footer-item">
                          <nuxt-icon name="video/play" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ $Utils.formatNumber(item.rating) || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <nuxt-icon name="video/like" class="work-icon mr-[2px]"></nuxt-icon>
                          <span>{{ item.like_count || 0 }}</span>
                        </div>
                        <div class="work-footer-item">
                          <span class="mr-[2px] inline-block">
                            <svg
                              class="work-icon"
                              width="14"
                              height="14"
                              viewBox="0 0 19 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.53899 0.387406C8.85036 -0.126613 9.59613 -0.126611 9.90749 0.387407L12.4845 4.64171C12.5959 4.82563 12.7767 4.95695 12.986 5.00607L17.8285 6.14234C18.4136 6.27962 18.644 6.98889 18.2514 7.44386L15.0016 11.2094C14.8611 11.3722 14.7921 11.5847 14.8101 11.799L15.2258 16.7555C15.2761 17.3544 14.6727 17.7928 14.1187 17.5599L9.53318 15.6329C9.33495 15.5496 9.11153 15.5496 8.9133 15.6329L4.32781 17.5599C3.77377 17.7928 3.17043 17.3544 3.22066 16.7555L3.63641 11.799C3.65438 11.5847 3.58534 11.3722 3.44485 11.2094L0.195116 7.44386C-0.197527 6.98889 0.0329301 6.27962 0.618008 6.14234L5.46045 5.00607C5.66979 4.95695 5.85054 4.82563 5.96194 4.64171L8.53899 0.387406Z"
                                fill="#919191"
                              />
                            </svg>
                          </span>
                          <span>{{ item.favorite_count || 0 }}</span>
                        </div>
                      </div>
                      <div class="work-reason">
                        原因：{{ item.hide_reason_text || item.reason || item.hide_reason || item.remark || 'xxxxxxxx原因文案' }}
                      </div>
                      <div v-if="item.can_delete === 1" class="work-delete mt-0.5" @click="onDeleteWork(item)">删除</div>
                      <div class="work-action mt-0.5" @click="onReUpShelves(item)">重新上架</div>
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
      <publish-popup>
        <dx-button block class="publish-btn">发布视频</dx-button>
      </publish-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const nav_tab = ref(0)

const video_tab = ref(0)
const route = useRoute()
const search_value = ref('')

const filter = (item: any) => {
  console.log('item: ', item)
  return item.title.includes(search_value.value)
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

const onReUpShelves = async (item: any) => {
  try {
    await __.$Confirm({
      title: '确定重新上架该视频吗？'
    })
    await __.$Api.Video.reUpShelves({
      mv_id: item.id || item.mv_id
    })
    hide_list_ref.value?.refresh_data()
    published_list_ref.value?.refresh_data()
  } catch (_error) {
    // noop
  }
}

const onDeleteWork = async (item: any) => {
  try {
    await __.$Confirm({
      title: '确定删除该视频吗？'
    })
    await __.$Api.Video.delete({
      mv_id: item.id || item.mv_id
    })
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-item {
  margin: 0 6px 6px;
  padding: 5px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
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
  padding: 0 4px;
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

.work-footer-item {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.work-icon {
  font-size: 14px;
  width: 14px;
  height: 14px;
  vertical-align: middle;
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

.publish-btn {
  border-radius: 5px !important;
}
</style>
