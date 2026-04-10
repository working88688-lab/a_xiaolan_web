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
        <div v-for="(item, index) in pageData?.series" :key="index" class="image-item" @click="onImageClick(index)">
          <img
            v-lazyLoad:[pageData?.id]="item.img_url_full"
            :data-index="index"
            src=""
            alt=""
            :class="{ 'is-locked': isImageLocked(index) }"
          />
          <div v-if="isImageLocked(index)" class="image-mask"></div>
          <div
            v-if="isImageLocked(index) && index === 1"
            class="image-action"
            :class="{ 'image-action--coins': pageData?.coins > 0, 'image-action--vip': !pageData?.coins }"
            @click.stop="handleMainAction"
          >
            <div v-if="pageData?.coins > 0" class="image-action-primary">
              <img src="~/assets/image/home/icon_coins.png" style="width: 0.32rem; height: 0.32rem;background-color: transparent;" />
              {{ pageData?.coins }}金币
            </div>
            <div v-else class="image-action-primary">
              <img src="~/assets/image/home/icon_vip.png" style="width: 0.32rem; height: 0.32rem;background-color: transparent;" />
              开通VIP
            </div>
            <div v-if="pageData?.coins > 0" class="image-action-sub">
              {{ pageData?.coins }}金币解锁全部{{ pageData?.total }}张
            </div>
            <div v-else class="image-action-sub">开通VIP，即可查看全部{{ pageData?.total }}张</div>
          </div>

          <div v-if="isImageLocked(index)" class="image-footer">
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
            <div class="image-footer-item image-footer-item--star" @click.stop="onLike">
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
                    fill="white"
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
      :images="previewImages"
      :start-position="currentIndex"
      :show-index="false"
      closeable
      close-icon-position="top-right"
      :close-on-click-image="false"
      @change="onPreviewChange"
    >
      <template #cover>
        <div class="custom-preview-footer">
          <div class="custom-preview-index">图 {{ currentIndex + 1 }} / {{ previewImages.length }}</div>
          <button class="custom-preview-save" type="button" @click.stop="onSaveClick">保存</button>
        </div>
      </template>
    </van-image-preview>
  </div>
</template>

<script setup lang="ts">
import type { ImageData } from '@types'
import coinsicon from '~/assets/image/comics/coins.png'

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

const isImageLocked = (index: number) => {
  if (!pageData.value) return false

  // 已拥有观看权限或已购买整套，全部解锁
  if (pageData.value.has_right || pageData.value.is_pay === 1) return false

  // 未解锁时，只放开第一张，其余全部锁定
  return index > 0
}

const handleMainAction = () => {
  if (!pageData.value) return

  if (pageData.value.coins > 0) {
    handleBuyAction()
  } else {
    handleVipAction()
  }
}

const onImageClick = (index: number) => {
  if (!pageData.value) return

  // 锁定状态下，点击图片走主 CTA（购买 / 开通会员）
  if (isImageLocked(index)) {
    handleMainAction()
    return
  }

  const series = pageData.value.series || []
  const globalObject: any = (__ as any).$GlobalObject || {}
  const groups = globalObject._IMAGE_PREVIE_GROUPS?.get(pageData.value.id) || []

  // 优先使用已经解密的本地图片地址，若不存在则回退到原始地址
  const images = series.map((item, idx) => groups[idx] || item.img_url_full)

  if (!images.length) return

  previewImages.value = images
  currentIndex.value = index
  showPreview.value = true
}

const onPreviewChange = (index: number) => {
  currentIndex.value = index
}

const onSaveClick = () => {
  __.$Toast('请截图或长按图片进行保存')
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
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 14px;
  pointer-events: none;
}

.custom-preview-index {
  pointer-events: auto;
}

.custom-preview-save {
  pointer-events: auto;
  padding: 6px 18px;
  border-radius: 999px;
  border: none;
  background-image: linear-gradient(to right, #6de6fb, #428af7);
  color: #fff;
  font-size: 14px;
}
</style>
