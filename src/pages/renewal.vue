<script setup lang="ts">
import DOMPurify from 'dompurify'
import { millisecondsToTime } from '@utils/date'
import { useDebounceFn, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Controller } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

const { u: user } = storeToRefs(useUserStore())
const __ = useNuxtApp()

const showPayment = ref(false)
let start_time = 0
const left_time = ref()

const { resume, pause } = useIntervalFn(
  () => {
    const left_seconds = (new_discount.value.left_seconds - start_time) * 1000
    if (left_seconds) {
      left_time.value = millisecondsToTime(left_seconds)
      start_time += 1
    } else {
      left_time.value = ''
      data.value.list.online = data.value.list.online.filter(item => {
        return !item.left_time
      })
      pause()
    }
  },
  1000,
  { immediate: false }
)
const { data, loading } = useMyFetch<{
  ads: any[]
  list: {
    online: any[]
  }
  run_light: string
}>({
  api: __.$Api.User.chargeList,
  immediate: true,
  params: {
    type: 1
  },
  success() {
    if (new_discount.value) {
      resume()
    }

    if (import.meta.dev) {
      data.value.run_light = '开发环境模拟跑马灯数据，打包后 自动删除'
    }

    scrollTo()
  }
})

const new_discount = computed(() => {
  return data.value.list?.online?.find(item => item.left_time)
})

const selectIndex = ref(0)
const selectItem = computed(() => {
  return data.value.list?.online?.[selectIndex.value] ?? {}
})

const scroll_ref = useTemplateRef('list')

const _fn = useDebounceFn(() => {
  scroll_ref.value?.scrollTo(0)
}, 10)
const onChange = (swiper: SwiperType) => {
  selectIndex.value = swiper.realIndex
  _fn()
}
const onTouchMove = (event: Event) => {
  event.stopPropagation()
}
const swipe_ref = ref()
const setSwiper = (swiper: SwiperType) => {
  swipe_ref.value = swiper
}
const on_select = (_index: number) => {
  swipe_ref.value?.slideToLoop(_index)
}
const onConfirm = () => {
  showPayment.value = true
}
const route = useRoute()
function scrollTo() {
  nextTick(() => {
    const { id } = route.query
    if (id && swipe_ref.value && data.value.list?.online?.length) {
      const index = data.value.list.online.findIndex(item => item.id === Number(id))
      if (index >= 0) {
        swipe_ref.value.slideToLoop(index)
      }
    }
  })
}

onActivated(() => {
  scrollTo()
})

useNoticeWithoutReg()
</script>
<template>
  <div class="container">
    <dx-navbar title="会员中心" right-text="订单记录" @click-right="$router.push('/charge-record')"></dx-navbar>
    <dx-notice-bar color="#000" :text="data.run_light"></dx-notice-bar>
    <div class="flex items-center px-1.5 py-1">
      <dx-avatar class="rounded-full border border-solid border-[#ffde9e]" :img="user?.avatar_url" :size="1.35" />
      <div class="ml-1">
        <div class="text-xl text-base7">{{ user?.nickname }}</div>
        <span v-if="user.is_vip" class="text-sm text-base2">
          会员到期时间：{{ dayjs(user.expired_str).format('YYYY-MM-DD') }}
        </span>
        <vip-level v-else style="color: #c2893b" :value="user.vip_level"></vip-level>
      </div>
    </div>
    <dx-spin v-show="loading" size="0.6rem" class="my-2 text-center"></dx-spin>
    <div class="py-1" @touchstart="onTouchMove">
      <swiper
        v-if="data.list?.online?.length"
        :modules="[Controller]"
        class="swiper-container"
        :touch-move-stop-propagation="true"
        :loop="true"
        :space-between="0"
        :initial-slide="0"
        :slides-per-view="3"
        :centered-slides="true"
        :slide-to-click="false"
        :controller="{ control: swipe_ref }"
        @slide-change="onChange"
        @swiper="setSwiper"
      >
        <swiper-slide v-for="(item, index) in data.list?.online" :key="item.id" @click="on_select(index)">
          <div class="slide flex-col-center relative cursor-pointer px-1 py-3">
            <h2 class="name font-medium">{{ item.pname }}</h2>
            <div class="price font-bold">
              ¥
              <span class="price">{{ item.p }}</span>
            </div>
            <div class="origin-price text-base8 line-through">原价¥{{ item.op }}</div>
            <!-- <div class="desc text-[#454545]">{{ item.description }}</div> -->
            <div v-if="item.corner_make" class="tag bg-[#f90e49]">{{ item.corner_make }}</div>
            <div v-if="item.left_time && left_time" class="count-down mt-1">{{ left_time }}后结束</div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="scroll-container px-1.5" @click.stop>
      <!-- 权益 -->
      <scroll-list ref="list">
        <div class="mt-1.5">
          <div
            class="text-base13 mt-1 whitespace-pre-line text-center"
            v-html="DOMPurify.sanitize(selectItem?.description ?? '')"
          ></div>
          <div class="flex-center my-2 text-[#fbd8cc]">
            <img class="mr-0.5 !h-[28px] !w-[14px]" src="@assets/image/my/vip/left.png" alt="" />

            <img class="mr-0.5 !h-[26px] !w-[26px] text-base9" src="@assets/image/my/vip/vip.png" alt="" />
            <span class="mr-0.5 text-base9">会员权限</span>
            <span class="text-[#f1715c]">共计{{ selectItem.right?.length }}项权益</span>

            <img class="ml-0.5 !h-[28px] !w-[14px]" src="@assets/image/my/vip/right.png" alt="" />
          </div>

          <div class="grid grid-cols-2 gap-1">
            <div
              v-for="(item, index) in selectItem.right"
              :key="item.id"
              class="right-item flex h-8 items-center rounded-sm p-1"
            >
              <div class="mr-1 h-3 w-3">
                <dx-image no-bg :src="item.img_url"></dx-image>
              </div>
              <div>
                <div class="text-[13px] text-[#111a37]">{{ item.name }}</div>
                <div class="text-sm text-[#727580]">{{ item.sub_name }}</div>
              </div>
            </div>
          </div>
        </div>
      </scroll-list>
    </div>
    <div class="van-safe-area-bottom">
      <div class="flex items-center justify-between rounded-full px-1.5 py-1">
        <dx-button class="!h-[44px] font-medium" block @click="onConfirm">
          <div class="flex items-baseline">
            <span class="text-[17px] font-medium">立即充值 ¥{{ selectItem.p }}</span>
            <span class="ml-0.5 text-sm font-medium line-through">原价:¥{{ selectItem.op }}</span>
          </div>
        </dx-button>
      </div>

      <!-- <div class="flex-center mb-1.5 mt-1 text-sm">
        支付中如有问题反馈，请联系
        <nuxt-link class="text-primary" to="/user/customer">在线客服</nuxt-link>
      </div> -->
    </div>
    <payment-action v-model:show="showPayment" target="pw_new" :data="selectItem"></payment-action>
  </div>
</template>

<style lang="postcss" scoped>
.right-item {
  background-image: linear-gradient(to right, #fdf7f0, #ffffff);
}

.container {
  background-color: #fff;
  background-image: url(@assets/image/my/vip/vip_bg.png);
  background-position: top center;
  background-size: contain;
  background-repeat: no-repeat;
}

:deep(.van-nav-bar) {
  background: transparent;
}

.user-recharge {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* background: top/contain no-repeat url('~/assets/image/my/bg_recharge.png'); */

  .user-recharge-list {
    padding: 0.4rem;

    .title {
      font-size: 0.4rem;
      font-weight: bold;
      color: #000;
    }

    .item {
      margin-top: 0.3rem;
      height: 2.85rem;
      overflow: hidden;
    }
  }
}

.count-down {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
  height: 30px;
  width: 100%;
  background-color: #fff600;
  font-size: 10px;
  color: #8b5004;
  text-align: center;
  font-weight: bold;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  color: #191e3a;
  width: 125px;

  &.swiper-slide-active {
    .price {
      color: #444ddc;
    }

    .slide {
      border-color: #444ddc;
      height: 160px;
      width: 125px;
      flex-shrink: 0;
    }

    .tag {
      font-size: 12px;
    }

    .name {
      font-size: 15px;
    }

    .price {
      font-size: 20px;
    }

    .count-down,
    .desc,
    .origin-price {
      font-size: 12px;
    }
  }
}

.slide {
  width: 106px;
  height: 138px;
  border-radius: 12px;
  background-color: #f7f7f7;
  transition-property: background-color, color, fontSize;
  transition-duration: 0.2s;
  transition-timing-function: ease, linear;
  border: 2px solid #f7f7f7;

  * {
    transition-property: background-color, color, fontSize;
    transition-duration: 0.2s;
    transition-timing-function: ease, linear;
  }

  .tag {
    position: absolute;
    left: -2px;
    top: -2px;
    padding: 2px 6px;
    font-size: 10px;
    border-radius: 12px 0 0 0;
    color: #fff;
  }

  .desc,
  .origin-price {
    font-size: 10px;
  }

  .name {
    font-size: 13px;
    text-align: center;
  }

  .price {
    font-size: 17px;
  }
}
</style>
