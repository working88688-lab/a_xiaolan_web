<script setup lang="ts">
import type { AdItem, CommentItem, LiveItem, RouteItem, SaoItem } from '@types'

import { random, uniqueId } from 'lodash-es'

const __ = useNuxtApp()
const route = useRoute()
const id = ref(route.query.id as unknown as string)
const paying = ref(false)

const userStore = useUserStore()
const { u: user } = storeToRefs(userStore)
const selectHls = reactive({
  label: '',
  url: ''
})
const showDefinition = ref(false)

const {
  data,
  loading,
  execute: fetchVideo
} = useMyFetch<{
  live: LiveItem
  banners: AdItem[]
}>({
  api: 'api/live/detail',
  success() {
    selectHls.label = data.value.live.use_hls?.label ?? ''
    selectHls.url = data.value.live.use_hls?.url ?? ''
  }
})

function onSelectDefinition(definitionItem: RouteItem) {
  selectHls.label = definitionItem.label
  selectHls.url = definitionItem.url
  showDefinition.value = false
}

function beforePay() {
  __.$Emitter.emit('pay', {
    api: 'api/live/buy',
    params: {
      id: route.query.id
    },
    onPay,
    coins: data.value.live?.coins,
    type: 'live',
    title: '购买直播',
    _type: data.value.live?.type
  })
}

async function onPay() {
  init_fetch(route.query.id)
}

function init_fetch(id: any) {
  console.log('id: ', id)
  fetchVideo({
    id
  })
}

const listRef = useTemplateRef('list')
const proxy_player = useTemplateRef('player')
const danmuValue = ref('')
function sendDanmu() {
  if (!danmuValue.value) {
    return showToast('请输入弹幕内容')
  }
  const danmu = proxy_player.value?.proxy_player('getPlugin', 'danmu')

  danmu?.sendComment({
    duration: 5000,
    id: uniqueId('live_danmu_'),
    color: true,
    prior: true,
    txt: danmuValue.value,
    mode: 'scroll',
    style: {
      color: '#fff'
    }
  })

  danmuValue.value = ''
}
const playerStore = usePlayerStore()

const { danmuOpen } = storeToRefs(playerStore)
function toggleDanmu() {
  playerStore.toggleDanmu()
  const danmu = proxy_player.value?.proxy_player('getPlugin', 'danmu')
  danmu?.[danmuOpen.value ? 'start' : 'stop']?.()

  if (danmuOpen.value) {
    createComments()
  }
  return showToast(danmuOpen.value ? '弹幕已打开' : '弹幕已关闭')
}

function refresh_comments() {
  listRef.value?.refresh_data()
}

const { onBeforeComment, reply, commentValue } = useComment()

const rewardValue = ref('')
const showReward = ref(false)

function openReward() {
  showReward.value = true
}

const rewardApi = __.$Api.dynamic({
  url: 'api/live/reward',
  axiosConfig: {
    showError: true,
    showSuccess: true
  }
})
async function toReward() {
  if (!rewardValue.value) {
    return showToast('输入打赏金额～')
  }
  try {
    showReward.value = false

    const res = await rewardApi({
      id: route.query.id,
      coins: rewardValue.value
    })
    userStore.info()
  } catch (error) {
  } finally {
    rewardValue.value = ''
  }
}

function onBack() {
  id.value = ''
  showDefinition.value = false
  showReward.value = false
  // @ts-ignore
  data.value = {}
}

// 根据骚话生成随机弹幕
const { data: sao, execute: saoExcute } = useMyFetch<SaoItem[]>({
  api: 'api/comments/saoTalk'
})
function createComments() {
  // 直播中的才生成
  if (data.value.live?.show === 'public') {
    saoExcute().then(() => {
      const danmu = proxy_player.value?.proxy_player('getPlugin', 'danmu')

      sao.value.forEach(item => {
        const delay = random(0, 10) * 1000

        setTimeout(() => {
          danmu?.sendComment({
            duration: 5000,
            id: item.id,
            color: true,
            prior: true,
            txt: item.tips,
            mode: 'scroll',
            style: {
              color: '#fff'
            }
          })
        }, delay)
      })
    })
  }
}

// 直播中可能下线
function onEnd() {
  console.log('直播结束')
  init_fetch(route.query.id)
}

onActivated(() => {
  if (!id.value || (id.value && id.value !== route.query.id)) {
    onBack()
    id.value = route.query.id as string
    init_fetch(route.query.id)
  }
})

onMounted(() => {
  init_fetch(route.query.id)
})

useActivatiedEventListener(window, 'popstate', onBack)

onBeforeRouteUpdate(async to => {
  onBack()
  await nextTick()
  id.value = to.query.id as string

  init_fetch(to.query.id)
})
</script>

<template>
  <div v-if="id" :key="id" class="container relative">
    <div>
      <dx-loading v-if="loading" />
      <div class="video-box">
        <xg-live-player
          ref="player"
          :active="data.live?.is_pay === 1 && !!selectHls.url"
          :poster="data.live?.cover"
          :src="selectHls.url"
          @played="createComments"
          @end="onEnd"
        />
        <div
          v-if="data.live?.is_pay === 1 && data.live?.show !== 'off'"
          class="absolute right-1 top-1 flex items-center text-tiny text-white"
        >
          <img class="h-[28px] w-[28px]" src="~/assets/image-icon/view.png" alt="" />
          {{ $Utils.formatNumber(data.live?.view_count ?? 0) }}观众
        </div>
        <!-- 提示 -->
        <div
          v-if="data.live?.is_pay === 0 || data.live?.show === 'off'"
          class="live-mask absolute left-0 top-0 h-full w-full text-center text-white"
        >
          <div class="flex h-full w-full flex-col items-center justify-center">
            <template v-if="data.live?.show === 'off'">主播已下线，请前往观看其他主播</template>
            <!-- vip -->
            <template v-else-if="data.live?.type === 1">
              <div class="live-tip mb-3">开通VIP免费观看！</div>
              <div>
                <dx-button :round="false" color="#757575" class="btn-pay-item !mr-2 w-[120px]" @click="$router.back">
                  取消
                </dx-button>
                <dx-button :round="false" linear class="btn-pay-item w-[120px] !border-0" @click="beforePay">
                  立即开通vip
                </dx-button>
              </div>
            </template>
            <!-- 金币 -->
            <template v-else>
              <div class="live-tip mb-3">支付{{ data.live?.coins }}金币解锁{{ data.live?.username }}直播</div>
              <div>
                <dx-button
                  :round="false"
                  color="#757575"
                  class="btn-pay-item btn-pay-item !mr-2 w-[120px] !border-0"
                  @click="$router.back"
                >
                  取消
                </dx-button>
                <dx-button linear class="w-[120px]" :round="false" @click="beforePay">立即支付</dx-button>
              </div>
            </template>
          </div>
        </div>

        <nuxt-icon name="arrow-left" size="0.6rem" class="btn-back text-4xl text-white" @click="$router.back" />
        <!-- 清晰度 -->
        <transition name="van-slide-right">
          <div v-show="showDefinition" class="definition overflow-auto">
            <div class="grid grid-cols-1 text-white">
              <div
                v-for="item in data.live?.hls"
                :key="item.label"
                class="van-hairline--bottom definition-item flex items-center px-1 py-0.5"
                @click="onSelectDefinition(item)"
              >
                {{ item.label }}

                <van-icon v-show="selectHls.label === item.label" class="ml-auto" name="success" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 工具栏 -->
      <div class="flex items-center px-1.5 py-1 text-sm">
        <div class="danmu-input w-[106px]">
          <van-field v-model="danmuValue" placeholder="点我发弹幕">
            <template #button>
              <div class="mx-auto flex h-[25px] flex-shrink-0 cursor-pointer items-center pr-0.5" @click="toggleDanmu">
                <img v-if="danmuOpen" class="!size-[18px]" src="~/assets/image-icon/live/danmu-on.png" alt="icon" />
                <img v-else class="!size-[18px]" src="~/assets/image-icon/live/danmu-off.png" alt="icon" />
              </div>
            </template>
          </van-field>
        </div>
        <van-button size="mini" class="!ml-1 !h-[26px] !w-[50px] !p-0" round type="primary" @click="sendDanmu">
          发送
        </van-button>
        <div class="xgplayer-route ml-auto h-[26px] cursor-pointer text-sm" @click="showDefinition = !showDefinition">
          切换线路
          <img
            class="xgplayer-route-icon ml-0.5 !h-auto !w-[16px]"
            src="~/assets/image-icon/live/route.png"
            alt="icon"
          />
        </div>
        <van-button
          size="mini"
          round
          color="linear-gradient(to right, #3b9df8, #3655fe)"
          class="!ml-1 !h-[26px] flex-shrink-0 !p-0"
          @click="openReward"
        >
          <div class="flex-center !w-[60px]">
            <span>打赏</span>
            <img class="ml-0.5 !size-[16px]" src="~/assets/image-icon/live/reward.png" alt="icon" />
          </div>
        </van-button>
      </div>
    </div>

    <div class="scroll-container van-hairline--top relative">
      <scroll-list class="px-1.5">
        <div class="info-top">
          <div class="mt-1 flex items-center">
            <dx-image :src="data.live?.thumb" round class="mr-1 !size-4"></dx-image>
            <p class="line-clamp-2 text-xl">
              {{ data.live?.username }}
            </p>
          </div>
          <p class="text-mgray">
            {{ data.live?.intro }}
          </p>

          <div class="my-1 flex items-center text-normal text-[#666666]">
            <span>{{ $Utils.formatNumber(data.live?.view_count, 'en') }}观看</span>
            <div class="ml-auto flex items-center gap-2">
              <dx-btn-like
                :id="data.live?.id"
                align="row"
                :like="data.live?.is_like === 1"
                :likes="data.live?.like_count"
                api="api/live/like"
                :use-toast="false"
                size="0.6rem"
                icon="like-o"
                active-icon="like"
                active-color="#ff416a"
              >
                <template #default="{ likes }">
                  {{ $Utils.formatNumber(likes, 'en') }}
                </template>
              </dx-btn-like>

              <dx-btn-like
                :id="data.live?.id"
                align="row"
                :like="data.live?.is_favorite === 1"
                :likes="data.live?.favorite_count"
                api="api/live/favorite"
                :use-toast="false"
                size="0.6rem"
                icon="star-o"
                active-icon="star"
                active-color="rgb(255, 169, 9)"
              >
                <template #default="{ likes }">
                  {{ $Utils.formatNumber(likes, 'en') }}
                </template>
              </dx-btn-like>

              <dx-share-button class="text-sm" />
            </div>
          </div>
        </div>
        <dx-ads class="mt-1.5" :items="data?.banners ?? []" />
        <!-- 推荐列表 -->
        <div class="info-recommend mb-2">
          <p class="mb-0.5 mt-1.5 text-default font-semibold">热门直播</p>

          <dx-hoc-list
            v-if="id"
            :key="id"
            ref="list"
            class="grid grid-cols-2 gap-1"
            :refresh="false"
            :pullup="false"
            api="api/live/recommend"
            :params="{ id }"
          >
            <template #item="{ item }">
              <live-item :key="item.id" replace :item />
            </template>
          </dx-hoc-list>
        </div>
      </scroll-list>
    </div>

    <van-overlay z-index="10" :show="paying">
      <dx-loading />
    </van-overlay>

    <van-dialog v-model:show="showReward" close-on-click-overlay :show-confirm-button="false">
      <div class="flex-center relative flex items-center py-2">
        <h3 class="text-xl font-semibold">打赏</h3>
        <van-icon class="!absolute right-1" name="cross" @click="showReward = false" />
      </div>
      <div class="mx-3">
        <div class="text-center">多谢金主爸爸的打赏哦～</div>
        <van-field
          v-model="rewardValue"
          class="m-0 mb-3 mt-2 rounded-lg"
          style="--van-cell-background: #f5f5f5; --van-cell-vertical-padding: 0; padding-right: 0px"
          center
          clearable
          type="number"
          placeholder="输入打赏金额～"
        >
          <template #button>
            <dx-button size="small" :round="false" linear type="primary" @click="toReward">立即打赏</dx-button>
          </template>
        </van-field>

        <div class="mb-3 flex items-center text-sm">
          <div>
            当前余额：
            <span class="text-mgold">{{ user.coins.toFixed(2) }}金币</span>
          </div>

          <nuxt-link class="text-mblue ml-auto underline" to="/coin-recharge">前往充值</nuxt-link>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<style lang="postcss" scoped>
@import '@styles/player.css';
.container {
  --van-tab-font-size: 15px;
  .xgplayer-route {
    display: flex;
    align-items: center;
    background-color: #e6e6e7;
    border-radius: 50px;
    padding: 2px 8px;
    &-icon {
      width: 24px;
      height: 24px;
    }
  }
  .danmu-input {
    --van-cell-background: #e6e6e7;
    --van-cell-vertical-padding: 0;
    --van-button-default-line-height: 4px;
    background-color: #e6e6e7;
    border-radius: 50px;
    padding: 2px;
    :deep(.van-field) {
      padding-right: 0px;
      border-radius: 50px;
      line-height: 4px;
      padding-left: 8px;
      font-size: 1px;
    }
    :deep(.van-field__control) {
      font-size: 12px;
    }
  }

  .definition {
    --van-border-color: #f5f5f5;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 11;
  }
  .definition-item {
    width: 120px;
  }
}

.video-comment-input {
  height: 38px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background-color: #e5e5e5;
  border-radius: 50px;
  padding: 2px 2px 2px 12px;
  input {
    flex: 1;
    background-color: transparent;
    caret-color: #428af7;
    border: none;
    font-size: 0.37rem;
    color: #333;
    &::placeholder {
      color: #bbb;
    }
  }
  .menu {
    width: 1rem;
    box-sizing: border-box;
    padding: 0.2rem;
    img {
      width: 100%;
    }
  }
  .submit {
    width: 60px;
    box-sizing: border-box;
    height: 32px;
    img {
      width: 100%;
    }
  }
}

.btn-pay-item {
  border-radius: 8px !important;
}

.live-mask {
  backdrop-filter: blur(5px);
}

.live-tip {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
