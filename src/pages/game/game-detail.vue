<script setup lang="ts">
import type { CommentItem, GameDetail, PayType } from '@types'
import { useClipboard } from '@vueuse/core'

const __ = useNuxtApp()

const route = useRoute()
const router = useRouter()
const { value: show_buy, open: open_buy } = useBoolean()
// const { value: show_share, open: open_share } = useBoolean()

const {
  data: detail,
  loading,
  execute: fetch_data
} = useMyFetch<GameDetail>({
  api: 'api/porngame/detail',
  success() {
    useDb('game', toRaw(detail.value.detail))
  }
})

const {
  listData,
  loading: loading_comments,
  isEmpty,
  isEnd,
  execute: fetch_comments,
  refresh,
  reset
} = useFetchList<CommentItem>({
  api: 'api/porngame/comment_list'
})

function pullup() {
  return fetch_comments({
    id: route.query.id
  })
}

const { onBeforeComment, reply, commentValue } = useComment()

function navigateToItem(item: any) {
  console.log('item: ', item)
  if (item.id === Number(route.query.id)) {
    const id = item.id
    fetch_data({
      id
    })
    fetch_comments({
      id
    })
  } else {
    router.replace(`/game/detail?id=${item.id}&title=${item.name}`)
  }
}

const pay_type = ref<PayType>(2)
const params_pay_type = computed(() => {
  return pay_type.value === 2 ? 1 : 2
})
function open_popup(type: PayType) {
  pay_type.value = type

  open_buy()
}
function onPay() {
  const id = route.query.id
  fetch_data({
    id
  })
}

const { copy } = useClipboard({ legacy: true })
function onCopy(_val: string) {
  copy(_val)
  __.$Toast('复制成功')
}

onBeforeRouteUpdate(to => {
  // @ts-ignore
  detail.value = {}
  reset()
  const id = to.query.id
  fetch_data({
    id
  })
  refresh({
    id
  })
})

const { setNavbarTitle } = useNavbarTitle()
const { key } = useKeepAlive({
  reset: () => {
    // @ts-ignore
    detail.value = {}
    reset()
    commentValue.value = ''
  },

  active() {
    const id = route.query.id
    fetch_data({
      id
    })
    refresh({
      id
    })
    setNavbarTitle(route.query.title as string)
  }
})
</script>

<template>
  <div :key="key" class="container">
    <dx-spin v-show="loading" />
    <div class="scroll-container">
      <scroll-list v-if="!loading" :loading="loading_comments" :pullup="pullup" :is-empty="isEmpty" :is-end="isEnd">
        <!-- 内容 -->
        <div class="px-1">
          <dx-swipe :list="detail.detail?.medias" class="my-1 flex-shrink-0">
            <template #item="{ item }">
              <!-- <div class="aspect-h-1 aspect-w-3"> -->
              <dx-image fit="cover" :src="item.cover" :alt="item.title" />
              <!-- </div> -->
            </template>
          </dx-swipe>

          <div v-if="!loading" class="mb-1 mt-0.5">
            <div class="mb-1 text-default font-medium">游戏简介：</div>
            <div class="mb-2 whitespace-pre-line break-words" v-html="detail.detail?.desc" />

            <template v-if="detail.detail?.play_intro">
              <div class="mb-1 text-default font-medium">游戏玩法：</div>
              <div class="whitespace-pre-line" v-html="detail.detail.play_intro" />
            </template>
          </div>

          <div class="relative my-1">
            <div class="mb-0.5 text-default font-medium">游戏下载：</div>
            <template v-if="detail.detail?.is_pay">
              <template v-if="detail.detail?.download_url">
                <div
                  v-for="item in detail.detail.download_url.split(',')"
                  :key="item"
                  class="break-words text-myellow"
                  @click="onCopy(item)"
                >
                  {{ item }}（点击复制）
                </div>
              </template>

              <div
                v-for="item in detail.detail?.hide_content"
                v-else
                :key="item.name"
                class="my-1 flex items-center rounded-sm bg-white p-1"
              >
                <template v-if="item.val">
                  <span class="flex-shrink-0 text-normal font-medium">{{ item.name }}：</span>
                  <div class="mr-1 truncate text-sm text-primary">
                    {{ item.val }}
                  </div>
                  <dx-button class="!ml-auto !h-[28px] min-w-6 flex-shrink-0" size="tiny" @click="onCopy(item.val)">
                    <span class="text-sm">复制</span>
                  </dx-button>
                </template>
              </div>
            </template>
            <template v-else>
              <div
                class="content flex-center my-1.5 overflow-hidden rounded-sm border border-dashed py-4 text-2xl text-primary"
              >
                内容已隐藏，解锁后查看
              </div>
              <div v-if="detail.detail?.type === 2" class="grid grid-cols-2 gap-1">
                <dx-button :disabled="detail.free_num === 0" linear @click="open_popup(2)">
                  免费解锁（剩余{{ detail.free_num }}次）
                </dx-button>

                <dx-button @click="open_popup(1)">支付{{ detail.detail?.coins }}金币解锁</dx-button>
              </div>
              <dx-button v-if="detail.detail?.type === 1" class="block" block @click="open_popup(1)">
                支付{{ detail.detail?.coins }}金币解锁
              </dx-button>
            </template>
          </div>

          <div class="mt-2 flex flex-wrap">
            <dx-tag
              v-for="item in detail.detail?.tags?.split(',').filter(i => i)"
              :key="item"
              class="mr-0.5 !text-primary"
              :text="item"
              :type="1"
            />
          </div>

          <div class="mb-1 flex justify-between text-sm">
            <div class="flex-center">
              <van-icon name="eye-o" size="0.6rem" class="mr-0.5" />
              {{ $Utils.formatNumber(detail?.detail?.view_count) }}
            </div>
            <dx-btn-like
              :id="detail?.detail?.id"
              align="row"
              size="0.6rem"
              :likes="detail?.detail?.like_count"
              :use-toast="false"
              :like="detail?.detail?.is_like === 1"
              api="api/porngame/like"
            >
              <template #default="{ likes }">
                {{ $Utils.formatNumber(likes) }}
              </template>
            </dx-btn-like>
            <dx-btn-like
              :id="detail?.detail?.id"
              api="api/porngame/favorite"
              align="row"
              size="0.6rem"
              icon="star-o"
              active-icon="star"
              :likes="detail?.detail?.favorite_ct"
              :like="detail?.detail?.is_favorite === 1"
              active-color="rgb(255, 169, 9)"
              :use-toast="false"
            >
              <template #default="{ likes }">
                {{ $Utils.formatNumber(likes) }}
              </template>
            </dx-btn-like>
            <div class="flex-center">
              <div class="mr-0.5 w-[22.5px]">
                <img src="~/assets/image-icon/lock.png" alt="" />
              </div>
              <div>
                {{ $Utils.formatNumber(detail?.detail?.buy_fake) }}
              </div>
            </div>
          </div>
        </div>
        <!-- 广告 -->
        <div class="my-2 px-1">
          <dx-ads :items="detail.ads" />
        </div>

        <div class="dx-grid-2 mb-1.5 gap-1 text-white">
          <div
            v-if="detail.previous"
            class="cursor-pointer overflow-hidden rounded-sm"
            @click="navigateToItem(detail.previous)"
          >
            <dx-cover class="aspect-h-9 aspect-w-16" :poster="detail.previous?.thumb">
              <div class="absolute left-0 top-0 h-full w-full">
                <div class="dx-mask flex h-full w-full items-center">
                  <div class="relative z-10 pl-1">
                    <div class="mb-1">上一篇</div>
                    <div class="right-0 line-clamp-2 text-sm">
                      {{ detail.previous.name }}
                    </div>
                  </div>
                </div>
              </div>
            </dx-cover>
          </div>
          <div
            v-if="detail.next"
            class="cursor-pointer overflow-hidden rounded-sm"
            @click="navigateToItem(detail.next)"
          >
            <dx-cover class="aspect-h-9 aspect-w-16" :poster="detail.next?.thumb">
              <div class="absolute left-0 top-0 h-full w-full">
                <div class="dx-mask flex h-full w-full items-center">
                  <div class="relative z-10 pl-1">
                    <div class="mb-1">下一篇</div>
                    <div class="right-0 line-clamp-2 text-sm">
                      {{ detail.next.name }}
                    </div>
                  </div>
                </div>
              </div>
            </dx-cover>
          </div>
        </div>
        <!-- 推荐 -->
        <div class="px-1">
          <h6 class="mb-0.5 text-xl font-medium">相关推荐</h6>
          <scroll-x-view v-if="detail.recommend_list?.length" @click.stop>
            <div class="flex text-base4">
              <div
                v-for="(item, index) in detail.recommend_list"
                :key="index"
                class="mr-1 flex w-[150px] flex-shrink-0 flex-col whitespace-normal rounded-sm last:mr-0"
                @click.stop="navigateToItem(item)"
              >
                <dx-cover class="aspect-h-9 aspect-w-16" :poster="item.thumb">
                  <span class="linear-bg absolute bottom-0 left-0 right-0 truncate p-0.5 text-white">
                    {{ item.name }}
                  </span>
                </dx-cover>
              </div>
            </div>
          </scroll-x-view>
        </div>

        <!-- 评论 -->
        <div class="mt-2 px-1">
          <h3 class="mb-1 text-xl font-medium">全部评论（{{ detail.detail?.comment_count ?? 0 }}）</h3>

          <div class="grid grid-cols-1 gap-1">
            <comment-reply-item
              v-for="item in listData"
              :id="detail.detail?.id"
              :key="item.id"
              class="van-hairline--bottom"
              :item="item"
              avatar-key="avatar_url"
              @comment="onBeforeComment"
            />
          </div>
        </div>
      </scroll-list>
    </div>
    <dx-comment-input
      v-show="!loading"
      ref="commentRef"
      v-model="commentValue"
      v-model:reply="reply"
      api="api/porngame/comment"
      :params="{ comment_id: reply.id, porn_id: route.query.id }"
    ></dx-comment-input>

    <!-- @success="() => refresh({ id: route.query.id })" -->
    <!-- 购买提示弹框 -->
    <dx-buy-popup
      v-model:show="show_buy"
      alert-title="解锁失败"
      api="api/porngame/buy"
      :params="{ id: route.query.id, type: params_pay_type }"
      :coins="detail.detail?.coins"
      :pay-type="pay_type"
      :success-handler="res => res.status === 1"
      :free-num="detail.free_num"
      title="解锁游戏"
      type="porn"
      :cancel-to="pay_type === 1 ? '/renewal' : undefined"
      :message="pay_type === 1 ? '剩余金币不足， 开通VIP畅享无限解锁！' : '剩余免费次数不足，开通VIP畅享无限解锁！'"
      :cancel-button-text="pay_type === 2 ? '再想想' : '去开通'"
      @pay:success="onPay"
    />
    <!--  分享提示弹框 -->
    <!-- <dx-share-popup v-model:show="show_share" type="porn" show-cancel /> -->
  </div>
</template>

<style lang="postcss" scoped>
.content {
  background: #e3f0ff;
  border-color: #158bfe;
}
:deep(.dx-tag) {
  background-color: unset !important;
}
</style>
