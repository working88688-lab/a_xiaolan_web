<script setup lang="ts">
import type { VideoItem } from '@types'

const props = defineProps<{
  active: boolean
  id: number | string
  poster: string
  cacheData?: VideoItem
  data: VideoItem
}>()

const emit = defineEmits<{
  openComment: [e: VideoItem]
  saveHistory: [e: string]
}>()

const __ = useNuxtApp()

let has_fetched = false
let saveTimer: any
const {
  data: item,
  execute,
  result
} = useMyFetch<VideoItem>({
  api: 'api/mv/detail480',
  params: {
    id: props.id
  },
  fields: 'detail',
  success() {
    saveTimer = setTimeout(() => {
      if (props.active) {
        useDb('tiktok', toRaw(item.value))
      }
    }, 3000)
  }
})

function openCommentDialog(e: VideoItem) {
  emit('openComment', e)
}

function updateLike(cacheData: any) {
  if (cacheData.type === 'follow') {
    if (item.value.user.uid === cacheData.data.uuid) {
      item.value.user.is_attention = cacheData.data.is_attention
    }
  }
}

watchEffect(() => {
  if (props.active) {
    if (!has_fetched) {
      has_fetched = true
      execute()
      __.$Emitter.on('cache', updateLike)
    }
  } else {
    __.$Emitter.off('cache', updateLike)
  }
})
onBeforeUnmount(() => {
  __.$Emitter.off('cache', updateLike)

  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
})
const play_url = computed(() => {
  return item.value.is_pay === 0 ? item.value?.preview_video || item.value?.play_url : item.value?.play_url
})

const tags_list = computed(() => {
  return props.data.tags_list?.filter(_item => _item) ?? []
})

const ticketBuy = __.$Api.createApi({
  url: 'api/userbuy/checkByTicket',
  axiosConfig: {
    throwError: false,
    showError: false
  }
})
const shareLayer = ref(false)
const payLayer = ref(false)
const userStore = useUserStore()
const { u: user } = storeToRefs(userStore)
const buying = ref(false)
function buyByTicket() {
  buying.value = true
  ticketBuy({
    mv_id: props.id
  })
    .then(res => {
      if (res.status === 1) {
        __.$Toast('使用成功')
        onPay()
        payLayer.value = false
        userStore.info()
      } else {
        __.$Toast(res.msg || '使用失败')
      }
    })
    .finally(() => {
      buying.value = false
    })
}

function beforePay() {
  if (item.value.coins) {
    payLayer.value = true
  } else {
    shareLayer.value = true
  }
}

const showPreviewTip = ref(false)
async function onPay() {
  try {
    execute({
      id: props.id
    }).then(() => {
      showPreviewTip.value = false
    })
  } catch (error) {}
}

function onVideoEnd() {
  if (item.value.is_pay === 0) {
    showPreviewTip.value = true
  }

  onSeeking('auto')
}
const seekingHandler = inject<(e: 'seeking' | 'auto') => void>('seekingHandler', _e => {})
function onSeeking(e: 'seeking' | 'auto') {
  seekingHandler?.(e)
}

const playerStore = usePlayerStore()
const { expand } = storeToRefs(playerStore)

function onSaveHistory(tag: string) {
  emit('saveHistory', tag)
}

const playerRef = useTemplateRef('player')
function openShare() {
  // showShareDialog()

  __.$Tracker.trackVideoEvent({
    event: 'video_event',
    video_id: item.value?.id,
    video_title: item.value?.title,
    video_tag_name: item.value?.tags,
    video_behavior_key: 'video_share',
    video_behavior_name: '分享',
    ...(playerRef.value?.getReportInfo() ?? {})
  })
}
</script>

<template>
  <xg-tk-player
    ref="player"
    :video-info="{
      video_id: item.id,
      video_type_id: item.video_type_id || '',
      video_type_name: item.video_type_name || '',
      video_tag_key: item.video_tag_key || '',
      video_title: item.title,
      video_tag_name: item.tags,
      duration: item.duration,
      video_content_type: 'short'
    }"
    :active="props.active"
    :disabled="showPreviewTip"
    :src="play_url"
    :loop="item.is_pay === 1"
    :poster="props.poster"
    @end="onVideoEnd"
    @seeking-action="onSeeking"
  >
    <template #default="{ seeking }">
      <transition name="van-fade">
        <div v-show="!seeking">
          <div v-show="expand" class="layer-container absolute bottom-2 left-1 z-[999] w-[300px]">
            <div
              v-if="item.is_pay === 0 && item.preview_tip"
              :class="{
                'is-vip': item.coins === 0,
                'is-coin': item.coins > 0
              }"
              class="preview-tip mb-1 flex items-center truncate"
              @click="beforePay"
            >
              {{ item.preview_tip }} {{ item.duration_str }}
            </div>
            <dx-link
              v-show="data.user?.nickname"
              :to="`/userdetail?id=${data.user?.uid}`"
              class="mb-0.5 flex items-center text-xl"
            >
              @{{ data.user?.nickname }}
              <!-- <img v-if="data.user?.auth_status" class="ml-0.5 !size-[20px]" src="~/assets/image/community/original.png"
                alt="" /> -->
            </dx-link>
            <h2 class="mb-0.5 truncate text-normal">
              {{ data.title }}
            </h2>
            <ul v-if="tags_list.length" class="tag-list text-sm">
              <nuxt-link
                v-for="tag in tags_list"
                :key="tag"
                :to="`/tag?&_type=tiktok&title=${tag}&has_sort=1&tag=${tag}&type=1`"
                class="tag-item text-white"
                @click="onSaveHistory(tag)"
              >
                #{{ tag }}
              </nuxt-link>
            </ul>
          </div>
          <div class="layer-container absolute bottom-2 right-1 z-20">
            <div class="grid w-[46px] grid-cols-1 gap-1.5 text-mini">
              <dx-avatar
                v-if="item?.user"
                v-show="expand"
                :key="data.user?.is_attention"
                class="mb-1.5"
                :size="1.2"
                :img="item?.user?.avatar_url"
                :uid="item?.user?.uid"
                :aff="item?.user?.aff"
                :creator="false"
              >
                <template v-if="item.user.uid !== user.uid" #badge>
                  <dx-btn-like
                    :id="item.user?.uid"
                    id-key="to_uid"
                    :use-toast="false"
                    :like="data.user?.is_attention === 1"
                    :show-count="false"
                    class="absolute -bottom-1 left-1/2 -translate-x-1/2"
                    api="api/users/following"
                  >
                    <template #icon="{ isLike }">
                      <img v-show="!isLike" class="!size-[16px]" src="~/assets/image-icon/follow.png" alt="follow" />
                    </template>
                  </dx-btn-like>
                </template>
              </dx-avatar>

              <div v-show="expand" class="flex-col-center" @click="openCommentDialog(item)">
                <nuxt-icon name="video/count" class="text-[0.8rem]" />
                <div>{{ $Utils.formatNumber(item.rating) }}</div>
              </div>

              <dx-btn-like
                v-show="expand"
                :id="item.id"
                style="--dx-base2-color: #fff"
                icon-type="nuxt"
                class="action-icon"
                :like="item.is_like === 1"
                :likes="item.like"
                api="api/mv/liking"
                :use-toast="false"
                size="0.8rem"
                icon="video/like"
                active-icon="video/like"
                color="#fff"
                active-color="#ff416a"
              >
                <template #default="{ likes }">
                  {{ $Utils.formatNumber(likes, 'en') }}
                </template>
              </dx-btn-like>

              <!-- <div class="flex-col-center" @click="openCommentDialog(item)">
                <van-icon name="chat" size="0.8rem" />
                <div>{{ $Utils.formatNumber(item.comment) }}</div>
              </div> -->

              <nuxt-link v-show="expand" to="/myinvite" class="flex-col-center" @click="openShare">
                <nuxt-icon name="video/share" class="text-[0.8rem]"></nuxt-icon>
                分享
              </nuxt-link>

              <div class="flex-col-center" @click="playerStore.toggleExpand">
                <nuxt-icon :name="expand ? 'video/enter' : 'video/exit'" class="text-[1rem]" />
                <span
                  :style="{
                    visibility: expand ? 'visible' : 'hidden'
                  }"
                >
                  清屏
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="showPreviewTip" class="flex-center absolute left-0 top-0 h-full w-full backdrop-blur-md">
        <video-placeholder :coins="item?.coins" @confirm="beforePay" />
      </div>
      <!-- 购买提示弹框 -->
      <dx-buy-popup
        v-model:show="payLayer"
        title="购买视频"
        api="api/chargeVideo/buy"
        :params="{ id: props.id }"
        :coins="item?.coins ?? 0"
        type="mv"
        :submit-text="user.my_ticket_number ? '金币支付' : '立即支付'"
        @pay:success="onPay"
      >
        <template #default>
          <div v-if="user.my_ticket_number > 0" class="mb-1 px-1.5">
            <dx-button block :loading="buying" @click="buyByTicket">使用1张观影券</dx-button>
          </div>
        </template>
      </dx-buy-popup>
      <!-- 预览VIP提示框 -->
      <dx-share-popup v-model:show="shareLayer" type="mv" show-cancel />
    </template>
  </xg-tk-player>
</template>

<style lang="postcss" scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  .tag-item {
    background: rgba(0, 0, 0, 0.61);

    padding: 3px 8px;
    border-radius: 4px;
    color: white;
    border-radius: 50px;

    &:first-child {
      margin-left: 0;
    }
  }

  a {
    white-space: nowrap;
  }
}

.preview-tip {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  color: white;
  width: fit-content;

  &.is-vip {
    background: linear-gradient(to right, #ff00d9, #ff0004);
  }

  &.is-coin {
    background: linear-gradient(to right, #fe2701, #ff8b00);
  }
}
</style>
