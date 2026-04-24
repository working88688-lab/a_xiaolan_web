<template>
  <div class="container">
    <dx-navbar
      class="custom-nav-bar"
      :border="false"
      :title="pageData?.title"
      left-arrow
      @click-left="__.$Back"
    ></dx-navbar>
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :is-ready="!loading">
        <div v-for="(item, index) in displaySeries" :key="index" class="image-item" @click="onImageClick(index)">
          <img
            v-lazyLoad:[Number(pageData?.id)]="item.img_url_full"
            :data-index="index"
            :src="item.img_url_full ? '' : imgLoading"
            alt=""
            :class="{ 'is-locked': isImageLocked(index) }"
          />
          <div v-if="shouldShowLockOverlay(index)" class="image-mask"></div>
          <div
            v-if="shouldShowLockOverlay(index)"
            class="image-action"
            :class="{ 'image-action--coins': pageData?.coins > 0, 'image-action--vip': !pageData?.coins }"
            @click.stop="handleMainAction"
          >
            <div v-if="pageData?.coins > 0" class="image-action-primary">
              <img
                src="~/assets/image/home/icon_coins.png"
                style="width: 0.32rem; height: 0.32rem; background-color: transparent"
              />
              {{ pageData?.coins }}金币
            </div>
            <div v-else class="image-action-primary">
              <img
                src="~/assets/image/home/icon_vip.png"
                style="width: 0.32rem; height: 0.32rem; background-color: transparent"
              />
              开通VIP
            </div>
            <div v-if="pageData?.coins > 0" class="image-action-sub">
              {{ pageData?.coins }}金币解锁全部{{ pageData?.total }}张
            </div>
            <div v-else class="image-action-sub">开通VIP，即可解锁全套{{ pageData?.total }}张</div>
          </div>

          <div v-if="shouldShowLockOverlay(index)" class="image-footer">
            <div class="image-footer-item image-footer-item--eye">
              <svg
                class="image-footer-icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.6514 5.33691C22.9207 5.33711 28.994 13.3918 30.4883 15.5459C30.7099 15.8653 30.7088 16.2737 30.4854 16.5918C28.9855 18.7253 22.9132 26.6697 15.6514 26.6699C8.38731 26.6699 2.31303 18.6698 0.815465 16.5254C0.592785 16.2065 0.592738 15.7973 0.815465 15.4785C2.31316 13.3346 8.38743 5.33691 15.6514 5.33691ZM15.7862 11.6836C13.4429 11.6836 11.543 13.6179 11.543 16.0039C11.5431 18.3898 13.443 20.3242 15.7862 20.3242C18.1293 20.3241 20.0292 18.3898 20.0293 16.0039C20.0293 13.6179 18.1294 11.6837 15.7862 11.6836Z"
                  fill="white"
                />
              </svg>
              <span class="image-footer-label">
                {{ $Utils.formatNumber(pageViews) }}
              </span>
            </div>
            <div
              class="image-footer-item image-footer-item--star"
              :class="{ 'image-footer-item--liked': pageData?.is_like === 1 }"
              @click.stop="onLike"
            >
              <svg
                class="image-footer-icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g clip-path="url(#clip0_80_4327_star)">
                  <path
                    d="M16.1447 2.41199C16.5339 1.76947 17.4661 1.76947 17.8553 2.41199L22.0676 9.36587C22.2069 9.59577 22.4328 9.75992 22.6945 9.82132L30.6097 11.6786C31.3411 11.8502 31.6291 12.7368 31.1383 13.3055L25.8265 19.4605C25.6509 19.664 25.5646 19.9296 25.587 20.1975L26.2666 28.2992C26.3294 29.0478 25.5752 29.5957 24.8827 29.3047L17.3874 26.1548C17.1396 26.0507 16.8604 26.0507 16.6126 26.1548L9.11735 29.3047C8.42481 29.5957 7.67063 29.0478 7.73342 28.2992L8.41297 20.1975C8.43544 19.9296 8.34914 19.664 8.17353 19.4605L2.86167 13.3055C2.37087 12.7368 2.65894 11.8502 3.39029 11.6786L11.3055 9.82132C11.5672 9.75992 11.7931 9.59577 11.9324 9.36587L16.1447 2.41199Z"
                    :fill="pageData?.is_like === 1 ? '#ffde00' : 'white'"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_80_4327_star">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="image-footer-label">
                {{ $Utils.formatNumber(pageData?.favorites ?? 0) }}
              </span>
            </div>
            <div class="image-footer-item image-footer-item--share" @click.stop="onShare">
              <svg
                class="image-footer-icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1.77813 28.937C1.55098 28.8603 1.35391 28.7162 1.21442 28.5245C1.07493 28.3329 0.99997 28.1034 1 27.8681C1 22.7037 2.05866 18.5736 4.14785 15.5915C6.6719 11.9885 10.6534 10.0485 16.0001 9.80756V4.13027C16.0001 3.90893 16.0664 3.69247 16.1909 3.50773C16.3153 3.323 16.4924 3.17812 16.7001 3.09108C16.9079 3.00403 17.1371 2.97865 17.3594 3.01808C17.5818 3.05751 17.7874 3.16001 17.9508 3.31287L30.6431 15.1818C30.7559 15.2873 30.8457 15.4142 30.907 15.5547C30.9684 15.6952 31 15.8464 31 15.9992C31 16.152 30.9684 16.3032 30.907 16.4437C30.8457 16.5842 30.7559 16.711 30.6431 16.8166L17.9508 28.6855C17.7874 28.8383 17.5818 28.9408 17.3594 28.9803C17.1371 29.0197 16.9079 28.9943 16.7001 28.9073C16.4924 28.8202 16.3153 28.6753 16.1909 28.4906C16.0664 28.3059 16.0001 28.0894 16.0001 27.8681V22.2325C12.7548 22.3285 10.3029 22.8436 8.35075 23.8319C6.24136 24.9001 4.71179 26.4961 3.06323 28.5654C2.91534 28.7509 2.71201 28.8866 2.48163 28.9534C2.25125 29.0203 2.00531 29.015 1.77813 28.9384V28.937Z"
                  fill="white"
                />
              </svg>
              <span class="image-footer-label">分享</span>
            </div>
          </div>
        </div>
      </scroll-list>
    </div>

    <van-image-preview
      v-model:show="showPreview"
      :images="previewVisibleImages"
      :start-position="currentIndex"
      :show-index="false"
      :vertical="false"
      :closeable="!isPreviewClean"
      close-icon-position="top-right"
      :close-on-click-image="false"
      :close-on-click-overlay="true"
      @change="onPreviewChange"
    >
      <template #image="{ src, onLoad, style }">
        <div
          class="dx-preview-image-wrap"
          @touchstart.passive="onPreviewTouchStart"
          @touchmove.passive="onPreviewTouchMove"
          @touchend="onPreviewTouchEnd"
        >
          <img
            class="dx-preview-image"
            :src="src"
            :style="style"
            alt=""
            @load="onLoad"
            @click="onPreviewImageTapFromClick"
          />

          <button
            v-if="isPreviewClean"
            class="dx-preview-clean-exit"
            type="button"
            aria-label="退出全屏"
            @click.stop="exitPreviewClean"
            @touchstart.stop="exitPreviewClean"
            @mousedown.stop="exitPreviewClean"
          >
            ×
          </button>

          <div
            v-if="!isPreviewClean && !isPreviewUnlocked && previewImages?.length > 1 && src !== previewImages?.[0]"
            class="dx-preview-locked-overlay"
          >
            <div class="dx-preview-pay-card">
              <div class="dx-preview-pay-title">支付</div>

              <div v-if="pageData?.coins > 0" class="dx-preview-pay-coin">
                <div v-if="isEnoughCoins" class="dx-preview-pay-coin-primary">{{ pageData.coins }}金币进行解锁</div>
                <div v-else class="dx-preview-pay-coin-warn">余额不足，去充值</div>
              </div>

              <div v-else class="dx-preview-pay-vip">开通VIP解锁全套{{ pageData?.total }}张</div>

              <button
                class="dx-preview-pay-btn"
                type="button"
                :class="{ 'dx-preview-pay-btn--warn': !isEnoughCoins && pageData?.coins > 0 }"
                @click.stop.prevent="onPreviewPayConfirm"
                @touchstart.stop.prevent="onPreviewPayConfirm"
                @touchend.stop.prevent
                @mousedown.stop.prevent
              >
                {{ pageData?.coins > 0 ? (isEnoughCoins ? '确定' : '去充值') : '前往开通' }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </van-image-preview>

    <teleport to="body">
      <div v-if="showPreview && !isPreviewClean" class="custom-preview-footer">
        <div class="custom-preview-index">{{ previewFooterIndex }}/{{ previewFooterTotal }}</div>
        <span class="custom-preview-save" role="button" tabindex="0" @click.stop="onSaveClick">保存</span>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import type { ImageData } from '@types'
import coinsicon from '~/assets/image/comics/coins.png'
import imgLoading from '~/assets/image/img_loading.png'
import { download_image } from '~/utils/blob-helper'

const route = useRoute()
const __ = useNuxtApp()

const {
  data: pageData,
  execute,
  loading
} = useMyFetch<ImageData>({
  api: __.$Api.Images.detail,
  success() {
    useDb('image', toRaw(pageData.value))
  }
})

const showPreview = ref(false)
const previewImages = ref<string[]>([])
const currentIndex = ref(0)
const isPreviewClean = ref(false)

const { u: user } = storeToRefs(useUserStore())
const userCoins = computed(() => Number(user.value?.coins ?? 0))
const needCoins = computed(() => Number(pageData.value?.coins ?? 0))
const isEnoughCoins = computed(() => {
  if (needCoins.value <= 0) return true
  return userCoins.value >= needCoins.value
})

/**
 * 展示列表兜底：locked 状态下，如果接口 series 只返回 0/1 张，会导致底部遮罩/引导消失
 * 这里基于 total 伪造占位项（不真实加载更多资源，只提供结构 + 视觉遮罩兜底）。
 */
const listSeries = computed(() => {
  const raw: any = pageData.value || {}
  let series = Array.isArray(raw.series) ? raw.series : []

  // 接口可能不返回 series，此时用 thumb 做兜底，保证列表至少有一张可展示
  if (series.length === 0) {
    const thumb = raw.thumb_full || raw.thumb || ''
    if (thumb) series = [{ img_url_full: thumb }]
  }

  // 已解锁：直接展示接口返回
  if (Boolean(raw.has_right) || raw.is_pay === 1) return series

  const total = Number(raw.total ?? 0)
  if (!total || total <= 1) return series

  const PLACEHOLDER_MAX = 8
  // 至少给到 2 张：保证 index=1 的“金币/VIP 引导”也能出现
  const placeholderCount = Math.max(2, Math.min(total, PLACEHOLDER_MAX))

  const firstRow = series[0] || {}
  return Array.from({ length: Math.max(series.length, placeholderCount) }, (_, i) => {
    // 真实 series 有几张，就展示几张；
    // 剩余的用空 `img_url_full` 伪造结构，避免触发 v-lazyLoad 解密，同时在模板里直接走静态占位图 `imgLoading`
    if (series[i]) return series[i]
    return { ...firstRow, img_url_full: '' }
  })
})

const isPreviewUnlocked = computed(() => {
  const raw: any = pageData.value || {}
  return Boolean(raw.has_right) || raw.is_pay === 1
})

const isPageUnlocked = computed(() => {
  const raw: any = pageData.value || {}
  return Boolean(raw.has_right) || raw.is_pay === 1
})

// 未解锁/非 VIP：列表只渲染 2 张（第1张可看 + 第2张引导解锁）
const displaySeries = computed(() => {
  const list = listSeries.value || []
  return isPageUnlocked.value ? list : list.slice(0, 2)
})

const previewVisibleImages = computed(() => {
  const images = previewImages.value || []
  // 锁定态也保留多张占位，保证 van-image-preview 可以横向滑动
  return images
})

// footer 的 y：使用接口总数 total，而不是数组长度（series 可能只返回 0/1）
const previewTotalAll = computed(() => {
  const raw: any = pageData.value || {}
  const n = Number(raw.total ?? 0)
  return Number.isFinite(n) && n > 0 ? n : previewImages.value.length || 0
})

const previewDisplayTotal = computed(() => {
  return previewVisibleImages.value.length || 0
})

const previewDisplayIndex = computed(() => {
  const total = previewDisplayTotal.value
  if (total <= 0) return 0
  return Math.min(currentIndex.value + 1, total)
})

// 预览底部 “x/y”：只显示当前权限可查看的张数
// - 未解锁：固定 1/1（即使为了滑动体验保留了多张占位）
// - 已解锁：展示真实 index/total（total 来自接口 total 兜底）
const previewFooterTotal = computed(() => {
  if (!showPreview.value) return 0
  return isPreviewUnlocked.value ? previewTotalAll.value : 1
})

const previewFooterIndex = computed(() => {
  if (!showPreview.value) return 0
  return isPreviewUnlocked.value ? Math.min(previewDisplayIndex.value, previewFooterTotal.value) : 1
})

const pageViews = computed(() => {
  const raw: any = pageData.value || {}
  return raw.views ?? 0
})

const onLike = async () => {
  await __.$Api.Images.liking({
    id: pageData.value!.id
  })
  const expectLike = pageData.value!.is_like === 0
  pageData.value!.is_like = expectLike ? 1 : 0
  pageData.value!.favorites = expectLike ? pageData.value!.favorites + 1 : pageData.value!.favorites - 1
}

const onShare = () => {
  __.$NavigateTo('/myinvite')
}

const isImageLocked = (index: number | string) => {
  const i = Number(index)
  if (!pageData.value) return false

  // 已拥有观看权限或已购买整套，全部解锁
  if (pageData.value.has_right || pageData.value.is_pay === 1) return false

  // 未解锁时，只放开第一张，其余全部锁定
  return i > 0
}

// 未解锁时：只在第 2 张（index=1）展示遮罩与 CTA，其它锁定图仅保留模糊效果
const shouldShowLockOverlay = (index: number | string) => {
  const i = Number(index)
  if (!pageData.value) return false
  if (pageData.value.has_right || pageData.value.is_pay === 1) return false
  return i === 1
}

const handleMainAction = () => {
  if (!pageData.value) return

  if (pageData.value.coins > 0) {
    handleBuyAction()
  } else {
    handleVipAction()
  }
}

function onPreviewPayConfirm() {
  if (!pageData.value) return

  if (pageData.value.coins > 0) {
    if (isEnoughCoins.value) {
      handleBuyAction()
    } else {
      __.$NavigateTo('/recharge')
    }
  } else {
    handleVipAction()
  }
}

const onImageClick = (index: number | string) => {
  if (!pageData.value) return
  const i = Number(index)

  // 锁定状态下，点击图片走主 CTA（购买 / 开通会员）
  if (isImageLocked(i)) {
    handleMainAction()
    return
  }

  const series = listSeries.value || []
  const globalObject: any = (__ as any).$GlobalObject || {}
  const groups = globalObject._IMAGE_PREVIE_GROUPS?.get(pageData.value.id) || []

  // 优先使用已经解密的本地图片地址，若不存在则回退到原始地址
  const images: string[] = series.map(
    (item: any, idx: number): string => groups[idx] || item?.img_url_full || imgLoading
  )

  if (!images.length) return

  // 锁定态：给每一张加唯一 fragment，确保预览 slot 内能区分“第1张/其他张”
  if (!isPreviewUnlocked.value) {
    previewImages.value = images.map((u: string, idx: number) => `${u}#pv-${idx}`)
  } else {
    previewImages.value = images
  }
  currentIndex.value = i
  showPreview.value = true
}

const onPreviewChange = (index: number) => {
  const total = previewDisplayTotal.value || 0
  if (total <= 0) {
    currentIndex.value = 0
    return
  }
  currentIndex.value = Math.min(Math.max(index, 0), total - 1)
}

const previewTouch = reactive({
  x: 0,
  y: 0,
  moved: false,
  startAt: 0,
  lastTapAt: 0
})

const TAP_MOVE_PX = 10
const TAP_MAX_MS = 350

const onPreviewTouchStart = (e: TouchEvent) => {
  const t = e.touches?.[0]
  if (!t) return
  previewTouch.x = t.clientX
  previewTouch.y = t.clientY
  previewTouch.moved = false
  previewTouch.startAt = Date.now()
}

const onPreviewTouchMove = (e: TouchEvent) => {
  const t = e.touches?.[0]
  if (!t) return
  const dx = Math.abs(t.clientX - previewTouch.x)
  const dy = Math.abs(t.clientY - previewTouch.y)
  if (dx > TAP_MOVE_PX || dy > TAP_MOVE_PX) previewTouch.moved = true
}

const onPreviewTouchEnd = () => {
  const cost = Date.now() - previewTouch.startAt
  if (previewTouch.moved) return
  if (cost > TAP_MAX_MS) return
  previewTouch.lastTapAt = Date.now()
  onPreviewImageTap()
}

const onPreviewImageTapFromClick = () => {
  // 移动端：touchend 触发后浏览器还会补一个 click，这里做去重
  if (Date.now() - previewTouch.lastTapAt < 400) return
  onPreviewImageTap()
}

const exitPreviewClean = () => {
  isPreviewClean.value = false
}

const onPreviewImageTap = () => {
  // 清屏模式：点图片退出清屏
  if (isPreviewClean.value) {
    exitPreviewClean()
    return
  }

  // 未解锁：仅第 1 张允许进入清屏（其它张会有支付遮罩）
  if (!isPreviewUnlocked.value && currentIndex.value > 0) return

  // 普通预览：点图片进入清屏
  isPreviewClean.value = true
}

const safeFilename = (name: string) => name.replace(/[\\/:*?"<>|]/g, '_').slice(0, 120)

const onSaveClick = async () => {
  const url = previewVisibleImages.value[currentIndex.value]
  if (!url) {
    __.$Toast('图片地址无效')
    return
  }

  const title = (pageData.value?.title || 'image').toString()
  const filename = safeFilename(`${title}-${currentIndex.value + 1}.jpg`)

  try {
    // 优先转 blob 再下载，避免部分端对跨域/下载属性的限制
    const res = await fetch(url, { mode: 'cors' })
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    download_image(objectUrl, filename)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
    __.$Toast('已开始保存')
  } catch (e) {
    // 回退：直接触发下载（在部分 WebView / 浏览器会直接走系统保存）
    try {
      download_image(url, filename)
      __.$Toast('已开始保存')
    } catch {
      __.$Toast('保存失败，请稍后重试')
    }
  }
}

const handleVipAction = async () => {
  await __.$Alert({
    title: '开通会员',
    message: 'VIP可查看精彩美图 开通VIP来享用吧！',
    teleport: 'body',
    closeOnClickOverlay: true,
    confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)',
    confirmButtonText: '前往开通'
  })

  __.$NavigateTo('/renewal')
}

const handleBuyAction = async () => {
  await __.$Alert({
    title: '购买此套图片',
    confirmButtonText: '立即购买',
    closeOnClickOverlay: true,
    confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)',
    message: () =>
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: '0.4rem'
          }
        },
        [
          h(
            'div',
            {
              style: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '0.6rem' }
            },
            [
              h('img', { src: coinsicon, style: { width: '0.6rem', height: '0.6rem' } }),
              h(
                'div',
                { style: { marginLeft: '0.2rem', fontSize: '0.65rem', color: '#fa8e2b' } },
                pageData.value!.coins + '金币'
              )
            ]
          ),
          h(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                justifyContent: 'space-between',
                width: '100%'
              }
            },
            [
              h('div', { style: { whiteSpace: 'nowrap', marginRight: '0.3rem' } }, '套图名称'),
              h('div', null, pageData.value!.title)
            ]
          )
        ]
      )
  })
  const { id } = route.query
  const { data } = await __.$Api.Images.buy({
    id
  })

  if (data.status) {
    __.$Toast(data.msg)
    pageData.value!.is_pay = 1
    execute({
      id
    })
  } else {
    await __.$Alert({
      title: '金币不足',
      message: '当前金币不足，是否前往充值？',
      teleport: 'body',
      closeOnClickOverlay: true,
      confirmButtonColor: 'linear-gradient(to right, #ffce73, #ffe7bc)',
      confirmButtonText: '去充值'
    })

    __.$NavigateTo('/recharge')
  }
}

const init = async (id: number) => {
  const res = await execute({
    id
  })
  if (import.meta.env.DEV && import.meta.client) {
    console.log('[images] detail api response:', res)
    console.log('[images] detail pageData:', pageData.value)
  }
}

onBeforeMount(async () => {
  const { id } = route.query
  init(Number(id))
})

watch(showPreview, v => {
  if (!v) isPreviewClean.value = false
})
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
}

.scroll-container {
  padding: 0.4rem 0.32rem 0.6rem;
}

.image-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 14px;

  img {
    width: 100%;
    display: block;
    background: #000;
  }

  img.is-locked {
    filter: blur(10px);
    transform: scale(1.04);
  }
}

.image-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.image-action {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-action--vip {
  .image-action-primary {
    background-color: #2494ff;
  }
}

.image-action--coins {
  .image-action-primary {
    background-color: #ff5900;
  }
}

.image-action-primary {
  font-size: 15px;
  font-weight: 600;
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-action-sub {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.86;
}

.image-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8px 16px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: #fff;
  font-size: 13px;
}

.image-footer-item {
  display: flex;
  align-items: center;
}

.image-footer-item--liked {
  .image-footer-label {
    color: #ffde00;
    opacity: 1;
  }
}

.image-footer-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  flex: 0 0 auto;
}

.image-footer-label {
  opacity: 0.9;
}

.custom-preview-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 16px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 14px;
  pointer-events: auto;
  z-index: 3000;
}

.custom-preview-index {
  pointer-events: auto;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.custom-preview-save {
  pointer-events: auto;
  color: #fff;
  font-size: 14px;
  padding: 6px 2px;
}

:deep(.van-popup.van-image-preview) {
  width: 100vw !important;
  max-width: none !important;
  left: 0 !important;
  right: 0 !important;
}

:deep(.van-image-preview__close-icon--top-right) {
  top: 20px !important;
  right: 20px !important;
}

:deep(.van-image-preview__close-icon--top-left) {
  top: 20px !important;
  left: 20px !important;
}

:deep(.dx-preview-image-wrap) {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.dx-preview-image) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

:deep(.dx-preview-locked-overlay) {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 0;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.38);
  pointer-events: none;
}

:deep(.dx-preview-locked-tip) {
  pointer-events: none;
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.34rem;
  font-weight: 600;
  margin-bottom: 0.36rem;
  text-align: center;
}

:deep(.dx-preview-locked-btn) {
  pointer-events: auto;
  border: 0;
  padding: 0.18rem 0.36rem;
  border-radius: 0.18rem;
  font-size: 0.32rem;
  font-weight: 700;
  color: #fff;
  background: #2494ff;
  box-shadow: 0 0.04rem 0.18rem rgba(0, 0, 0, 0.25);
}
:deep(.dx-preview-pay-card) {
  width: min(6.6rem, calc(100vw - 1.2rem));
  border-radius: 0.22rem;
  background: rgba(255, 255, 255, 0.98);
  padding: 0.32rem 0.3rem 0.28rem;
  box-sizing: border-box;
  box-shadow: 0 0.08rem 0.28rem rgba(0, 0, 0, 0.22);
  pointer-events: auto;
}

:deep(.dx-preview-pay-title) {
  text-align: center;
  font-size: 0.36rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 0.18rem;
}

:deep(.dx-preview-pay-coin-primary) {
  text-align: center;
  color: #2494ff;
  font-weight: 700;
  font-size: 0.32rem;
  margin-bottom: 0.28rem;
}

:deep(.dx-preview-pay-coin-warn) {
  text-align: center;
  color: #fa8e2b;
  font-weight: 700;
  font-size: 0.32rem;
  margin-top: -0.06rem;
  margin-bottom: 0.28rem;
}

:deep(.dx-preview-pay-vip) {
  text-align: center;
  color: #666;
  font-weight: 700;
  font-size: 0.3rem;
  margin-bottom: 0.28rem;
}

:deep(.dx-preview-pay-btn) {
  width: 100%;
  height: 0.62rem;
  border-radius: 0.14rem;
  border: 0;
  color: #fff;
  background: #2494ff;
  font-size: 0.32rem;
  font-weight: 800;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

:deep(.dx-preview-pay-btn--warn) {
  background: #fa8e2b;
}

::deep(.dx-preview-clean-exit) {
  position: absolute;
  top: 0.28rem;
  right: 0.28rem;
  width: 0.76rem;
  height: 0.76rem;
  border-radius: 999px;
  border: 0;
  background: rgba(0, 0, 0, 0.55);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.58rem;
  line-height: 0.76rem;
  text-align: center;
  padding: 0;
  pointer-events: auto;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
</style>
