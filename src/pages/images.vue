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
        <img v-for="(item, _index) in pageData?.series" :key="_index" v-lazyLoad="item.img_url_full" src="" alt="" />
      </scroll-list>
    </div>
    <div v-show="!loading" class="atlas-bottom">
      <div class="atlas-content">
        <div class="left">
          <div v-if="pageData?.is_pay === 0 && pageData.coins > 0" class="no-right" @click="handleBuyAction">
            购买即可看全套{{ pageData?.total }}张
          </div>
          <div
            v-else-if="pageData?.is_pay === 0 && pageData?.coins == 0 && !pageData?.has_right"
            class="no-right"
            @click="handleVipAction"
          >
            会员可看全套{{ pageData?.total }}张
          </div>
          <div v-else>全套{{ pageData?.total }}张</div>
        </div>
        <div class="right">
          <div class="action" @click="onLike">
            <img :src="pageData?.is_like ? DetailLikeActiveIcon : DetailLikeIcon" />
            <span>{{ $Utils.formatNumber(pageData?.favorites ?? 0) }}</span>
          </div>
          <dx-link to="/invite" class="ml-1 flex items-center">
            <div class="mr-0.5 h-[22px] w-[22px]">
              <img src="~/assets/image/home/share.png" />
            </div>
            <span>分享</span>
          </dx-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageData } from '@types'
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

const onLike = async () => {
  await __.$Api.Images.liking({
    id: pageData.value!.id
  })
  const expectLike = pageData.value!.is_like === 0
  pageData.value!.is_like = expectLike ? 1 : 0
  pageData.value!.favorites = expectLike ? pageData.value!.favorites + 1 : pageData.value!.favorites - 1
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
.atlas-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.atlas-content {
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.2rem 0.4rem;
  font-size: 12px;

  .left {
    flex: 1;
    align-items: center;
    margin-right: 0.5rem;
    .no-right {
      padding: 9.5px 17.5px 9px 17px;
      border-radius: 35px;
      text-align: center;
      color: #8c4d10;
      background-image: linear-gradient(to top, #ffce73, #ffe7bc);
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    .action {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0.2rem;
      img {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.2rem;
      }
    }
  }
}
</style>
