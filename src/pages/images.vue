<template>
  <div class="container">
    <dx-navbar
      class="custom-nav-bar"
      :border="false"
      :title="pageData?.title?.length > 15 ? '图集详情' : pageData?.title"
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
            <div v-if="pageData?.coins > 0" class="image-action-primary">{{ pageData?.coins }}金币</div>
            <div v-else class="image-action-primary">开通VIP</div>
            <div v-if="pageData?.coins > 0" class="image-action-sub">
              {{ pageData?.coins }}金币解锁全部{{ pageData?.total }}张
            </div>
            <div v-else class="image-action-sub">开通VIP，即可查看全部{{ pageData?.total }}张</div>
          </div>

          <div v-if="isImageLocked(index)" class="image-footer">
            <div class="image-footer-item image-footer-item--eye">
              <span class="icon"></span>
              <span class="image-footer-label">
                {{ $Utils.formatNumber(pageViews) }}
              </span>
            </div>
            <div class="image-footer-item image-footer-item--star" @click.stop="onLike">
              <span class="icon"></span>
              <span class="image-footer-label">
                {{ $Utils.formatNumber(pageData?.favorites ?? 0) }}
              </span>
            </div>
            <div class="image-footer-item image-footer-item--share" @click.stop="onShare">
              <span class="icon"></span>
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
  await execute({
    id
  })
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
  font-size: 11px;
}

.image-footer-item {
  display: flex;
  align-items: center;
}

.image-footer-item .icon {
  display: inline-block;
  width: 14px;
  margin-right: 4px;
}

.image-footer-item--eye .icon::before {
  content: '👁';
}

.image-footer-item--star .icon::before {
  content: '★';
}

.image-footer-item--share .icon::before {
  content: '➤';
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
