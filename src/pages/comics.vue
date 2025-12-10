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
      <scroll-list ref="scrollerRef" v-model:loading="loading" :is-ready="!loading">
        <div class="graphic-line" />

        <div class="graphic-comics-header">
          <div class="graphic-comics-header-content">
            <div class="thumb"><img :key="pageData?.thumb_full" v-lazyLoad="pageData?.thumb_full" /></div>
            <div class="text">
              <div class="title">{{ pageData?.title }}</div>
              <div class="author">
                <span>作者：</span>
                {{ pageData?.author }}
              </div>
              <div class="watch">
                <span>观看：</span>
                {{ $Utils.formatNumber(pageData?.rating ?? 0) }}次
              </div>
              <div v-if="pageData?.tags_list?.length > 0" class="tag">
                <template v-for="(item, __index) in pageData?.tags_list" :key="__index">
                  <div v-if="item" key="{index}" class="tag-item">{{ item }}</div>
                </template>
              </div>
            </div>
          </div>
          <div class="graphic-comics-header-desc">
            <span>简介：</span>
            {{ pageData?.description }}
          </div>
        </div>
        <div class="graphic-line" />
        <div class="graphic-directory-container">
          <div class="title">目录</div>
          <div class="directory">
            <template v-for="(item, _index) in pageData?.series" :key="_index">
              <episode-icon
                v-if="_index < 12"
                :data="pageData"
                :index="item.episode"
                @click="handleTips(item, _index)"
              ></episode-icon>
            </template>
          </div>
          <div v-if="pageData?.series?.length > 12" class="all" @click="onAlldirectory">查看全部章节</div>
        </div>
        <div class="graphic-line" />
        <div class="graphic-recommend">
          <div class="title">为你推荐</div>
          <div class="list">
            <div v-for="(item, index) in data?.list" :key="index" class="recommend-item" @click="onReplace(item)">
              <div class="thumb"><dx-image :src="item.thumb_full"></dx-image></div>
              <div class="title line-clamp-2">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </scroll-list>
    </div>
    <div v-show="!loading" class="graphic-fixed-bottom">
      <div class="row h-full" @click="onLike">
        <div class="item">
          <div class="icon"><img :src="pageData?.is_like ? DetailLikeActiveIcon : DetailLikeIcon" /></div>
          <div class="value">{{ $Utils.formatNumber(pageData?.favorites ?? 0) }}</div>
        </div>
      </div>
      <div class="begin" @click="onBeginReading">
        {{ isRead && isRead.s_id ? `继续阅读 ${isRead.s_id} 话` : '开始阅读' }}
      </div>
    </div>
    <comics-reader
      v-model:show="showComicsReader"
      :sid="sid"
      :data="pageData"
      @select="handleTips"
      @like="onLike"
      @update:history="updateRead"
    ></comics-reader>
    <all-directory
      v-model:show="showAllDirectory"
      :sid="sid"
      :data="pageData"
      @select="handleTips"
      @like="onLike"
      @update:history="updateRead"
    ></all-directory>
  </div>
</template>

<script setup lang="ts">
import type { ComicData, SeryItem } from '@types'
import type { GraphicHistory } from '@utils/graphichistory'
import { onQueryHistory } from '@utils/graphichistory'
import coinsicon from '~/assets/image/comics/coins.png'
import DetailLikeIcon from '~/assets/image/comics/detail_like.png'
import DetailLikeActiveIcon from '~/assets/image/comics/detail_like_active.png'

const { u: user } = useUserStore()
const route = useRoute()
const router = useRouter()
const __ = useNuxtApp()
const scrollerRef = ref()
const showComicsReader = ref(false)
const showAllDirectory = ref(false)
const sid = ref()

const {
  data: pageData,
  execute,
  loading
} = useMyFetch<ComicData>({
  api: __.$Api.Comics.detail,
  success() {
    useDb('comic', toRaw(pageData.value))
  }
})
const {
  data,
  execute: recommend,
  loading: recLoading
} = useMyFetch<{ list: Array<ComicData> }>({
  api: __.$Api.Comics.recommend
})

const isRead = ref<GraphicHistory>({
  id: undefined,
  s_id: undefined
})
const updateRead = () => {
  const { id } = route.query
  const _isRead = onQueryHistory(Number(id))
  if (_isRead) {
    isRead.value = {
      ..._isRead
    }
  } else {
    isRead.value = {
      id: undefined,
      s_id: undefined
    }
  }
}
const onLike = async () => {
  await __.$Api.Comics.liking({
    id: pageData.value!.id
  })
  const expectLike = pageData.value!.is_like === 0
  pageData.value!.is_like = expectLike ? 1 : 0
  pageData.value!.favorites = expectLike ? pageData.value!.favorites + 1 : pageData.value!.favorites - 1
}
const handleVipAction = async () => {
  await __.$Alert({
    title: '开通会员',
    message: 'VIP可查看精彩漫画 开通VIP来享用吧！',
    closeOnClickOverlay: true,
    confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)',
    confirmButtonText: '前往开通'
  })
  __.$NavigateTo('/renewal')
}

const onAlldirectory = () => {
  showAllDirectory.value = true
}
const handleBuyAction = async (index: number) => {
  await __.$Alert({
    title: '购买整本漫画',
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
              h('div', { style: { whiteSpace: 'nowrap', marginRight: '0.3rem' } }, '漫画名称'),
              h('div', null, pageData.value!.title)
            ]
          )
        ]
      )
  })
  const { id } = route.query
  const { data } = await __.$Api.Comics.buy({
    id
  })

  if (data.status) {
    __.$Toast(data.msg)
    pageData.value!.is_pay = 1
    handleFreeAction(index)
  }
}

const handleFreeAction = (index: number) => {
  showComicsReader.value = true
  const item = pageData.value!.series[index]
  sid.value = item.episode
}

const handleTips = (item: SeryItem, index: number) => {
  const seriesList = pageData.value!.series
  const coinsNumber = pageData.value!.coins
  const isPays = pageData.value!.is_pay

  if (seriesList.length <= 5 && isPays == 0) {
    // 要买章节
    if (coinsNumber > 0) {
      return handleBuyAction(index)
    } else {
      // vip免费
      if (user.is_vip == 0) {
        return handleVipAction()
      }
    }
  }

  if (seriesList.length > 5 && seriesList.length < 10 && isPays == 0) {
    if (item.episode > 1) {
      if (coinsNumber > 0) {
        return handleBuyAction(index)
      } else {
        if (user.is_vip == 0) {
          return handleVipAction()
        }
      }
    }
  }

  if (seriesList.length >= 10 && isPays == 0) {
    if (item.episode > 2) {
      if (coinsNumber > 0) {
        return handleBuyAction(index)
      } else {
        if (user.is_vip == 0) {
          return handleVipAction()
        }
      }
    }
  }
  handleFreeAction(index)
}

const onBeginReading = () => {
  if (isRead) {
    const isReadNumber = isRead.value.s_id ?? 0
    if (isReadNumber >= 0) {
      const index = isReadNumber - 1
      const episode = pageData.value!.series[index] ?? 1
      handleTips(episode, index >= 0 ? index : 0)
    } else {
      const episode = pageData.value!.series[0] ?? 1
      handleTips(episode, 0)
    }
  } else {
    const episode = pageData.value!.series[0] ?? 1
    handleTips(episode, 0)
  }
}

const onReplace = async (item: ComicData) => {
  __.$Replace(`/comics?id=${item.id}`)
}

const init = async (id: number) => {
  await execute({
    id
  })
  recommend({
    id
  })
  updateRead()
}
watch(
  () => route.query.id,
  async val => {
    init(Number(val))
    await nextTick()
    scrollerRef.value?.scrollTo(0, 0)
  }
)
onBeforeMount(async () => {
  const { id } = route.query
  init(Number(id))
})
</script>

<style lang="less" scoped>
@import '@styles/comics.less';
</style>
