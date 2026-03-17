<script setup lang="ts">
import { format_url_params } from '@utils/helper'
const props = defineProps<{
  api: string
  title: string
  type?: string
}>()
</script>
<template>
  <dx-hoc-list :api="props.api" fields="data" :pullup="false">
    <template #header="{ data }">
      <dx-resource-ads
        class="px-1.5"
        :ad-key="props.type"
        :ad-name="props.title"
        :items="data?.ads ?? []"
      ></dx-resource-ads>
      <div
        class="graphic-filter-state"
        :class="props.type === 'comics' ? 'icon-type-two' : 'icon-type-one'"
        @touchmove.stop
      >
        <scroll-x-view class="graphic-filter-state-scroll">
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
            <div class="icon"><dx-image no-bg :src="_item.icon" /></div>
            <div class="title">{{ _item.name }}</div>
          </div>
        </scroll-x-view>
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
            查看更多 >
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
          <div class="graphic-layout-bottom-button">
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
            查看更多 >
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
      </div>
    </template>
  </dx-hoc-list>
</template>

<style lang="postcss" scoped>
.graphic-filter-state {
  display: flex;

  .graphic-filter-state-scroll {
    flex: 1;
    padding-left: 12px;

    .graphic-filter-item {
      display: inline-block;
      width: 83px !important;
      height: 40px !important;
      border-radius: 7px !important;
      overflow: hidden;
      margin-right: 6px !important;

      .icon {
        width: 100% !important;
        margin: 0 !important;
        height: 100% !important;
      }

      .title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff !important;
        font-size: 14px;
        text-shadow: 0px 0px 5px black;
        white-space: nowrap;
      }
    }
  }

  .graphic-filter-state-more {
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
  padding: 0.4rem;

  &.between {
    justify-content: space-between;
    gap: 12px;

    .graphic-filter-item {
      flex: 1;

      .icon {
        width: 100%;
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

    .icon {
      width: 1.3rem;
      height: 1.3rem;
      margin-bottom: 0.2rem;
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
    color: #999999;
    font-size: 0.34rem;
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

    .icon {
      width: 1.3rem;
      height: 1.3rem;
      margin-bottom: 0.2rem;
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
