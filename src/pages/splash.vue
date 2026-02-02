<!-- 
    desc: 落地页
    date: 2024.03.28
-->
<template>
  <div class="container">
    <div class="welcome-ad">
      <Swiper :modules="[Autoplay, Pagination]" :pagination="{
        clickable: true
      }" :autoplay="{
          delay: 2500
        }" class="ad-swiper" style="width: 100%" :disable-on-interaction="false" :slides-per-view="1"
        :space-between="0" loop>
        <SwiperSlide v-for="(item, index) in config.ads_screen" :key="index">
          <ad-link :data="{ ...item, url: item.index_ads_url, id: index + 1, type: 1 }" :index
            class="block h-full w-full">
            <img v-lazyLoad="item.index_ads_thumb" class="ad-image" src="@assets/image/img_loading.png" alt="" />
          </ad-link>
          <!-- <a :href="item.index_ads_url" target="__blank" class="block h-full w-full" @click="report">
            <img v-lazyLoad="item.index_ads_thumb" class="ad-image" src="@assets/image/img_loading.png" alt="" />
          </a> -->
        </SwiperSlide>
      </Swiper>
      <div v-if="showBtn" class="welcome-ad-btn">
        <div class="relative h-full w-full">
          <svg xmlns="https://www.w3.org/2000/svg" class="scroll-btn-circles h-full w-full -rotate-90" width="44"
            height="44" viewport="0 0 44 44">
            <circle class="progress-bar" cx="22" cy="22" r="20" stroke-linecap="round" stroke="#fff" stroke-width="2px"
              style="stroke-dasharray: 126; stroke-dashoffset: 126" :style="{
                'stroke-dashoffset': svg_dash_offset
              }"></circle>
          </svg>
          <span v-if="cutdown > 0" class="cut-text translate-50 absolute left-1/2 top-1/2">
            {{ cutdown + 1 }}
          </span>
          <dx-link v-else to="/home" replace class="cut-text translate-50 absolute left-1/2 top-1/2 whitespace-nowrap">
            跳过
          </dx-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
const showBtn = ref(false)
const data = ref({
  url: '',
  img: ''
})
const __ = useNuxtApp()

const globalStore = useGlobalStore()

const { config } = storeToRefs(globalStore)
const MAX_COUNT = 4
const cutdown = ref(MAX_COUNT)
const percent = ref(MAX_COUNT)
const svg_dash_offset = computed(() => {
  return (percent.value / MAX_COUNT) * 126
})

const router = useRouter()
let cancelId: any

function imgFinish() {
  showBtn.value = true
  const startAt = Date.now()

  function tick() {
    cancelId = requestAnimationFrame(() => {
      const now = Date.now()
      const diffMillisecond = now - startAt
      const diff = Math.floor(diffMillisecond / 1000)
      const lastime = MAX_COUNT - diff
      cutdown.value = lastime
      percent.value = Number((MAX_COUNT - diffMillisecond / 1000).toFixed(1))

      if (diff >= MAX_COUNT - 0.5) {
        cancelAnimationFrame(cancelId)
      } else {
        tick()
      }
    })
  }

  tick()
}
const getImg = async () => {
  if (globalStore.config.ads_screen?.length) {
    imgFinish()
  } else {
    __.$Replace('/home')
  }
}

onMounted(() => {
  getImg()
})
</script>

<style lang="postcss" scoped>
.container {
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 1;

  :deep(.swiper-pagination-bullet) {
    transition: all 0.3s;
  }

  :deep(.report-click-item) {
    height: 100%;
  }

  :deep(.swiper-pagination-bullet-active.swiper-pagination-bullet) {
    width: 26px;
    border-radius: 50px;
  }

  .ad-swiper {
    width: 100%;
    height: 100%;
  }

  .ad-image:not(.loading) {
    width: 100%;
    height: 100%;
  }

  :deep(.swiper-slide) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.welcome-ad {
  position: fixed;
  top: 0;
  left: auto;
  bottom: 0;
  width: var(--device-width);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;

  .welcome-ad-btn {
    position: absolute;
    z-index: 4;
    top: calc(constant(safe-area-inset-top) + 20px);
    top: calc(env(safe-area-inset-top) + 20px);
    right: 15px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    /* prettier-ignore */
    width: 44PX;
    /* prettier-ignore */
    height: 44PX;
  }
}

.progress-bar {
  transition: stroke-dashoffset 0.1s ease;
  /* 过渡效果 */
}

.cut-text {
  /* prettier-ignore */
  font-size: 14PX;
}
</style>
