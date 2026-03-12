<template>
  <div class="container">
    <dx-navbar class="custom-nav-bar" :border="false" :title="pageData?.title?.length > 15 ? '图集详情' : pageData?.title"
      left-arrow @click-left="__.$Back"></dx-navbar>
    <div class="scroll-container">
      <scroll-list v-model:loading="loading" :is-ready="!loading">
        <div
          v-for="(item, index) in pageData?.series"
          :key="index"
          class="image-item"
          @click="onImageClick(index)"
        >
          <img
            v-lazyLoad="item.img_url_full"
            src=""
            alt=""
            :class="{ 'is-locked': isImageLocked(index) }"
          />
          <div v-if="isImageLocked(index)" class="image-mask"></div>
          <div
            v-if="isImageLocked(index) && index === 1"
            class="image-action"
            :class="{
              'image-action--coins': pageData?.coins > 0,
              'image-action--vip': !pageData?.coins
            }"
            @click.stop="handleMainAction"
          >
            <div class="image-action-primary" v-if="pageData?.coins > 0">
              {{ pageData?.coins }}金币
            </div>
            <div class="image-action-primary" v-else>
              开通VIP
            </div>
            <div class="image-action-sub" v-if="pageData?.coins > 0">
              {{ pageData?.coins }}金币解锁全部{{ pageData?.total }}张
            </div>
            <div class="image-action-sub" v-else>
              开通VIP，即可查看全部{{ pageData?.total }}张
            </div>
          </div>

          <div class="image-footer" v-if="isImageLocked(index)">
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
  </div>
</template>

<script setup lang="ts">
import type { ImageData } from '@types'
import { showImagePreview } from 'vant'
import coinsicon from '~/assets/image/comics/coins.png'
import DetailLikeIcon from '~/assets/image/comics/detail_like.png'
import DetailLikeActiveIcon from '~/assets/image/comics/detail_like_active.png'

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

  const images = (pageData.value.series || []).map((item) => item.img_url_full)

  if (!images.length) return

  showImagePreview({
    images,
    startPosition: index,
    closeable: true
  })
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
  left: 50%;
  bottom: 16%;
  transform: translateX(-50%);
  padding: 0.46rem 0.9rem 0.42rem;
  border-radius: 16px;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-action--vip {
  background-image: linear-gradient(to right, #6de6fb, #428af7);
}

.image-action--coins {
  background-image: linear-gradient(to right, #ffa142, #ff7f24);
}

.image-action-primary {
  font-size: 15px;
  font-weight: 600;
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
</style>
