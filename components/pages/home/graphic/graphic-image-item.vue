<script setup lang="ts">
import { format_url_params } from '@utils/helper'
const props = defineProps<{
  api: string
  title: string
  type?: string
}>()

const hocListRef = ref<null | { refresh_data: (params?: Record<string, any>) => Promise<any> }>(null)
const iconScrollRef = ref<null | { refresh: () => void }>(null)
const headerDataRef = ref<any>(null)

function __setHeaderData(data: any) {
  headerDataRef.value = data
  return ''
}

watch(
  () => headerDataRef.value?.icon?.length,
  async () => {
    await nextTick()
    iconScrollRef.value?.refresh?.()
  }
)
const __ = useNuxtApp()
const replaceLoadingKey = ref<string | null>(null)
// 男色分类「换一换」：走老接口
const pictureListApi = __.$Api.dynamic({ url: '/api/image/getPicturelist', method: 'post' })

function getLastItemId(items: any): string {
  const list = Array.isArray(items) ? items : []
  const last = list.length ? list[list.length - 1] : null
  const id = last?.id ?? ''
  return id === null || id === undefined ? '' : String(id)
}

const onReplaceClick = async (card: any) => {
  const tabId = card?.tab_id ?? card?.category_id ?? ''
  const tab_id = tabId === null || tabId === undefined ? '' : String(tabId)
  const id = getLastItemId(card?.items)

  if (!tab_id) {
    // 兜底：缺少分类 id 就刷新整块数据
    try {
      await hocListRef.value?.refresh_data?.()
    } catch (e) {
      console.warn('[home-resource][graphic-image-item] refresh_data failed:', e)
    }
    return
  }

  const loadingKey = `${tab_id}_${id}`
  if (replaceLoadingKey.value === loadingKey) return
  replaceLoadingKey.value = loadingKey
  try {
    const res: any = await pictureListApi({ id, tab_id })
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.list) ? res.data.list : null
    if (Array.isArray(list)) {
      card.items = list
    } else {
      console.warn('[home-resource][graphic-image-item] getPicturelist unexpected response:', res)
    }
  } catch (e) {
    console.warn('[home-resource][graphic-image-item] getPicturelist failed:', e)
  } finally {
    if (replaceLoadingKey.value === loadingKey) replaceLoadingKey.value = null
  }
}

let __headerLogged = false
function __logHeaderDataOnce(data: any) {
  // dx-hoc-list 首次渲染时 data(init_data) 可能还是 undefined
  // 这里必须等 data 有值后再算“打印过一次”，否则会错过真实数据
  if (!data) return ''
  if (__headerLogged) return ''
  __headerLogged = true
  try {
    const icons = Array.isArray(data?.icon) ? data.icon : []
    console.log('[home-resource][graphic-image-item] header data(object):', data)
    try {
      console.log('[home-resource][graphic-image-item] header data(json):', JSON.stringify(data, null, 2))
    } catch (e) {
      console.warn('[home-resource][graphic-image-item] header data stringify failed:', e)
    }
    console.log(
      '[home-resource][graphic-image-item] header icons(sample):',
      icons.slice(0, 6).map((it: any) => ({
        name: it?.name,
        type: it?.type,
        key: it?.key,
        icon: it?.icon
      }))
    )
  } catch (e) {
    console.warn('[home-resource][graphic-image-item] header log failed:', e)
  }
  return ''
}

onMounted(() => {
  // 便于排查当前 tab 实际请求的接口地址
  console.log('[home-resource][graphic-image-item] request api:', props.api)
})
</script>
<template>
  <dx-hoc-list ref="hocListRef" :api="`${props.api}`" fields="data" :pullup="false">
    <template #header="{ data }">
      {{ __setHeaderData(data) }}
      {{ __logHeaderDataOnce(data) }}
      <dx-resource-ads
        class="px-1.5"
        :ad-key="props.type"
        :ad-name="props.title"
        :items="data?.ads ?? []"
      ></dx-resource-ads>
      <div class="graphic-filter-state" :class="props.type === 'comics' ? 'icon-type-two' : 'icon-type-one'">
        <div class="graphic-filter-state-scroll" @touchmove.stop>
          <scroll-x-view ref="iconScrollRef">
            <div class="graphic-filter-scroll-content">
              <div
                v-for="(_item, index) in data?.icon"
                :key="index"
                v-link="
                  `/home/resource-filter?${format_url_params({
                    title: props.title,
                    _type: props.type,
                    type: _item.type,
                    key: _item.key
                  })}`
                "
                class="graphic-filter-item"
              >
                <div class="title">{{ _item.label || _item.name }}</div>
              </div>
            </div>
          </scroll-x-view>
        </div>
        <nuxt-link :to="'/home/male-beauty-category'" class="graphic-filter-state-more">
          <img class="icon" src="~/assets/image/home/icon_more.png" alt="" />

          <div class="title">全部</div>
        </nuxt-link>
      </div>
      <div class="graphic-line"></div>
    </template>
    <template #item="{ item: card, index }">
      <div v-if="card.show_style === 'H-1*N'" :key="index" class="graphic-layout-item">
        <div class="graphic-index-title">
          <div class="title">{{ card.tab_name }}</div>
          <nuxt-link
            :to="`/query?${format_url_params({
              tab: card.tab_id,
              title: card.tab_name,
              _type: props.type,
              _sort_key: 'order'
            })}`"
            class="more"
          >
            <span>查看更多</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 4L13.0938 10.1451L7 16.4106"
                stroke="#070710"
                stroke-opacity="0.6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </nuxt-link>
        </div>
        <div class="dx-list" @touchmove.stop>
          <scroll-x-view>
            <div class="graphic-scroll-content">
              <div
                v-for="(cardItem, cardIndex) in card?.items"
                :key="cardIndex"
                v-link="`/${props.type}?id=${cardItem.id}`"
                class="graphic-information"
              >
                <div class="content">
                  <div class="thumb">
                    <dx-image :src="cardItem.thumb_full" />
                  </div>

                  <dx-pay-type :coins="cardItem.coins" class="absolute right-0.5 top-0.5" />
                  <div class="absolute bottom-0.5 left-0.5 right-0.5 z-10 flex justify-between text-white">
                    <div class="flex items-center gap-0.5">
                      <van-icon name="eye-o" size="0.32rem" />
                      <span>
                        {{ $Utils.formatNumber(cardItem.view_count || cardItem.view_num || cardItem.rating || 0) }}
                      </span>
                    </div>
                    <div>{{ cardItem.total || (cardItem.series && cardItem.series.length) || 0 }}张</div>
                  </div>
                </div>

                <div class="truncate">{{ cardItem.title }}</div>
              </div>
              <div v-if="card.items?.length == 0" class="comics-empty">数据为空</div>
            </div>
          </scroll-x-view>
        </div>
        <div class="graphic-layout-bottom">
          <div class="graphic-layout-bottom-button" @click="onReplaceClick(card)">
            <img class="icon" src="~/assets/image/home/icon_refresh.png" alt="" />
            <div class="title">换一换</div>
          </div>
          <nuxt-link
            :to="`/query?${format_url_params({
              tab: card.tab_id,
              title: card.tab_name,
              _type: props.type,
              _sort_key: 'order'
            })}`"
            class="graphic-layout-bottom-button"
          >
            <img class="icon" src="~/assets/image/home/icon_more2.png" alt="" />
            <div class="title">查看更多</div>
          </nuxt-link>
        </div>
      </div>
      <div v-else-if="card.show_style === 'V-3*N'" :key="index + 1" class="graphic-layout-item">
        <div class="graphic-index-title">
          <div class="title">{{ card.tab_name }}</div>
          <!-- <nuxt-link :to="`/query?${format_url_params({
            tab: card.tab_id,
            title: card.tab_name,
            _type: props.type,
            _sort_key: 'order'
          })}`" class="more">
            查看更多 >
          </nuxt-link> -->
        </div>
        <div class="graphic-layout-three">
          <div
            v-for="(cardItem, cardIndex) in card?.items"
            :key="cardIndex"
            v-link="`/${props.type}?id=${cardItem.id}`"
            class="graphic-information-common"
          >
            <div class="thumb">
              <dx-image :src="cardItem.thumb_full" />
              <dx-pay-type :coins="cardItem.coins" class="absolute right-0.5 top-0.5" />
              <div class="absolute bottom-0.5 left-0.5 right-0.5 z-10 flex justify-between text-[0.28rem] text-white">
                <div class="flex items-center gap-0.5">
                  <van-icon name="eye-o" size="0.32rem" />
                  <span>
                    {{ $Utils.formatNumber(cardItem.view_count || cardItem.view_num || cardItem.rating || 0) }}
                  </span>
                </div>
                <div>{{ cardItem.total || (cardItem.series && cardItem.series.length) || 0 }}张</div>
              </div>
            </div>
            <div class="line-clamp-1">{{ cardItem.title }}</div>
          </div>
          <div v-if="card.items?.length == 0" class="comics-empty">数据为空</div>
        </div>
        <div class="graphic-layout-bottom">
          <div class="graphic-layout-bottom-button" @click="onReplaceClick(card)">
            <img class="icon" src="~/assets/image/home/icon_refresh.png" alt="" />
            <div class="title">换一换</div>
          </div>
          <nuxt-link
            :to="`/query?${format_url_params({
              tab: card.tab_id,
              title: card.tab_name,
              _type: props.type,
              _sort_key: 'order'
            })}`"
            class="graphic-layout-bottom-button"
          >
            <img class="icon" src="~/assets/image/home/icon_more2.png" alt="" />
            <div class="title">查看更多</div>
          </nuxt-link>
        </div>
      </div>
      <div v-else-if="card.show_style === 'V-2*N'" :key="index + 2" class="graphic-layout-item">
        <div class="graphic-index-title">
          <div class="title">{{ card.tab_name }}</div>
          <nuxt-link
            :to="`/query?${format_url_params({
              tab: card.tab_id,
              title: card.tab_name,
              _type: props.type,
              _sort_key: 'order'
            })}`"
            class="more"
          >
            <span>查看更多</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7 4L13.0938 10.1451L7 16.4106"
                stroke="#070710"
                stroke-opacity="0.6"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </nuxt-link>
        </div>
        <div class="graphic-layout-two grid grid-cols-2 gap-1 px-1">
          <div
            v-for="(cardItem, cardIndex) in card?.items"
            :key="cardIndex"
            v-link="`/${props.type}?id=${cardItem.id}`"
            class="graphic-information-common"
          >
            <div class="thumb">
              <dx-image :src="cardItem.thumb_full" />
              <dx-pay-type :coins="cardItem.coins" class="absolute right-0.5 top-0.5" />
              <div class="absolute bottom-0.5 left-0.5 right-0.5 z-10 flex justify-between text-[0.28rem] text-white">
                <div class="flex items-center gap-0.5">
                  <van-icon name="eye-o" size="0.32rem" />
                  <span>
                    {{ $Utils.formatNumber(cardItem.view_count || cardItem.view_num || cardItem.rating || 0) }}
                  </span>
                </div>
                <div>{{ cardItem.total || (cardItem.series && cardItem.series.length) || 0 }}张</div>
              </div>
            </div>
            <div class="line-clamp-1">{{ cardItem.title }}</div>
          </div>
          <div v-if="card.items?.length == 0" class="comics-empty">数据为空</div>
        </div>
        <div class="graphic-layout-bottom">
          <div class="graphic-layout-bottom-button" @click="onReplaceClick(card)">
            <img class="icon" src="~/assets/image/home/icon_refresh.png" alt="" />
            <div class="title">换一换</div>
          </div>
          <nuxt-link
            :to="`/query?${format_url_params({
              tab: card.tab_id,
              title: card.tab_name,
              _type: props.type,
              _sort_key: 'order'
            })}`"
            class="graphic-layout-bottom-button"
          >
            <img class="icon" src="~/assets/image/home/icon_more2.png" alt="" />
            <div class="title">查看更多</div>
          </nuxt-link>
        </div>
      </div>
    </template>
  </dx-hoc-list>
</template>

<style lang="postcss" scoped>
.graphic-filter-state {
  display: flex;

  .graphic-filter-state-scroll {
    flex: 1;
    min-width: 0;
    padding-left: 12px;

    .graphic-filter-scroll-content {
      display: flex;
      gap: 6px;
    }

    .graphic-filter-item {
      display: inline-block;
      position: relative;
      width: 83px !important;
      height: 40px !important;
      border-radius: 7px !important;
      overflow: hidden;
      margin-right: 0 !important;
      background: url('~/assets/image/community/icon-bg.png') center / 100% 100% no-repeat;

      .icon {
        display: none;
      }

      .title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff !important;
        font-size: 14px;
        font-weight: 600;
        text-shadow: 0px 0px 5px black;
        white-space: nowrap;
      }
    }
  }

  .graphic-filter-state-more {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: center;
    justify-content: center;
    padding: 0 15px;

    .icon {
      width: 25px;
      height: 25px;
    }

    .title {
      font-size: 10px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: center;
    }
  }
}

.graphic-filter-state.icon-type-one {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  &.between {
    justify-content: space-between;
    gap: 12px;

    .graphic-filter-item {
      flex: 1;
      background: url('~/assets/image/community/icon-bg.png') center / 100% 100% no-repeat;

      .icon {
        display: none;
      }

      .title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 14px;
        text-shadow: 0px 0px 5px black;
        white-space: nowrap;
      }
    }
  }

  .graphic-filter-item {
    position: relative;
    text-align: center;
    background: url('~/assets/image/community/icon-bg.png') center / 100% 100% no-repeat;

    .icon {
      display: none;
    }

    .atlasIcon {
      width: 2.9rem;
      height: 1.3rem;
      margin-bottom: 0.2rem;
      position: relative;

      .text {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        color: white;
        font-size: 0.4rem;
        text-shadow: 0px 0px 5px black;
        white-space: nowrap;
      }
    }

    .title {
      text-align: center;
      color: #333333;
      font-size: 0.33rem;
      font-weight: 600;
    }
  }
}

.graphic-layout-item {
  margin-bottom: 14px;
}

.graphic-index-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px;

  .title {
    flex: 1;
    color: #333333;
    font-size: 0.4rem;
  }

  .more {
    color: #666666;
    font-size: 0.34rem;
    display: inline-flex;
    align-items: center;
    gap: 0.12rem;
  }
}

.graphic-scroll-content {
  display: flex;
  gap: 14px;
}

.graphic-information {
  /* 外层容器减去 3 个 gap，展示 3.25 个卡片宽度 */
  flex: 0 0 calc((100vw - 3 * 14px) / 3.25);
  min-width: 0;
  overflow: hidden;
  text-align: center;

  .content {
    position: relative;
    height: 3.8rem;
    margin-bottom: 0.2rem;

    .thumb {
      width: 100%;
      height: 3.8rem;
      border-radius: 5px;
      overflow: hidden;
      position: absolute;
      z-index: 1;
    }
  }

  .title {
    color: #333333;
    font-size: 0.32rem;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.graphic-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.1rem;
  font-size: 0.3rem;
  color: #999;
}

.graphic-meta-left {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.graphic-layout-three {
  padding: 0 12px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 8px;
  grid-column-gap: 8px;
  overflow: hidden;

  .graphic-information-common {
    .thumb {
      width: 100%;
      height: 4rem;
      border-radius: 5px;
      margin-bottom: 0.2rem;
      overflow: hidden;
      position: relative;
    }
  }
}

.graphic-layout-bottom {
  padding: 0 12px;
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;
  justify-content: center;

  .graphic-layout-bottom-button {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    height: 39px;
    border-radius: 100px;
    background-color: #f3f8ff;

    .icon {
      width: 20px;
      height: 20px;
    }

    .title {
      color: #333333;
      font-size: 0.32rem;
    }
  }
}

.graphic-layout-two {
  .graphic-information-common {
    .thumb {
      width: 100%;
      height: 5.9rem;
      border-radius: 5px;
      margin-bottom: 0.2rem;
      overflow: hidden;
      position: relative;
    }
  }
}

.graphic-filter-state.icon-type-two {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0.4rem;

  &.between {
    justify-content: space-between;
  }

  .graphic-filter-item {
    text-align: center;
    background: url('~/assets/image/community/icon-bg.png') center / 100% 100% no-repeat;

    .icon {
      display: none;
    }

    .atlasIcon {
      width: 2.9rem;
      height: 1.3rem;
      margin-bottom: 0.2rem;
      position: relative;

      .text {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        color: white;
        font-size: 0.4rem;
        text-shadow: 0px 0px 5px black;
        white-space: nowrap;
      }
    }

    .title {
      text-align: center;
      color: #333333;
      font-size: 0.33rem;
    }
  }
}
</style>
