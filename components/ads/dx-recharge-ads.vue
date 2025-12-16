<script setup lang="ts">
import { useDebounceFn, useIntervalFn } from '@vueuse/core'
import type { GlobalState } from '@types'

const props = defineProps<{
  config?: GlobalState['config']['activity']
}>()

const cacheKey = 'recharge-ad-banner'
const showAd = ref(!sessionStorage.getItem(cacheKey))
const docEl = document.documentElement

function hideBar() {
  sessionStorage.setItem(cacheKey, '1')
  showAd.value = false
  hiddenAdBar()
}

function hiddenAdBar() {
  docEl.style.setProperty('--recharge-ad-height', '0px')
  docEl.style.setProperty('--recharge-toggle-height', '0px')
  docEl.style.setProperty('--dx-open-app-height', '0px')
}

function showAdBar() {
  docEl.style.setProperty('--recharge-ad-height', '1.49333rem')
  docEl.style.setProperty('--recharge-toggle-height', '0.96rem')
  docEl.style.setProperty('--dx-open-app-height', '0.42667rem')
}

onMounted(() => {
  if (showAd.value) {
    nextTick(() => {
      showAdBar()
    })
  }
})

let start_time = 0
const left_time = ref()

const { pause } = useIntervalFn(
  () => {
    const left_seconds = (props.config!.time_left - start_time) * 1000
    if (left_seconds) {
      left_time.value = millisecondsToTime(left_seconds)
      start_time += 1
    } else {
      left_time.value = ''
      pause()
    }
  },
  1000,
  { immediate: true }
)

const router = useRouter()
function nav() {
  if (props.config?.jump_type === 0) {
    return router.push(`/renewal?id=${props.config?.jump_val}`)
  }
}
</script>

<template>
  <div v-if="props?.config && showAd" class="dx-recharge-ad-container">
    <div class="ad-toggle-button m-0 cursor-pointer" @click="hideBar">
      <img src="assets/image/ads/ad-toggle-button.png" alt="" />
    </div>
    <div class="dx-recharge-ad-banner flex cursor-pointer items-center" @click="nav">
      <div class="px-1 py-1 text-normal text-white">
        <div>{{ props.config?.content }}</div>
        <div class="flex items-center">
          倒计时
          <span class="mx-0.5 text-[#fbff00]">{{ left_time }}</span>
          结束
        </div>
      </div>

      <div class="btn-nav">立即开通</div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.dx-recharge-ad-container {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .dx-recharge-ad-banner {
    width: 100%;
    height: var(--recharge-ad-height);
    transition: all 0.2s;
    position: relative;
    z-index: 1;
    background: url(@/assets/image/ads/ad-banner.png);
    background-size: cover;

    img {
      object-fit: unset;
    }
  }

  .ad-toggle-button {
    position: absolute;
    left: 50%;
    width: 90px;
    height: var(--recharge-toggle-height);
    transform: translate(-50%, -30px);
  }

  .btn-nav {
    background: linear-gradient(180deg, #ff0000 0%, #ff9d00 100%);
    font-size: 14px;
    color: #fff;
    margin-left: auto;
    border-radius: 50px;
    padding: 4px 10px;
    box-shadow: 0px 0px 0px 1px #f8f5ea;
    margin-right: 12px;
  }
}
</style>
