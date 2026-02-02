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
      <dx-ads class="px-1.5" :ad-key="props.type" :ad-name="props.title" :items="data?.ads ?? []"></dx-ads>
      <div class="graphic-filter-state between" :class="props.type === 'comics' ? 'icon-type-two' : 'icon-type-one'">
        <div v-for="(_item, index) in data?.icon" :key="index" v-link="`/home/resource-filter?${format_url_params({
          title: props.title,
          _type: props.type,
          type: _item.type,
          key: _item.key
        })}`
          " class="graphic-filter-item">
          <div class="icon"><dx-image no-bg :src="_item.icon" /></div>
          <div class="title">{{ _item.name }}</div>
        </div>
      </div>
      <div class="graphic-line"></div>
    </template>
    <template #item="{ item: card, index }">
      <div v-if="card.show_style === 'H-1*N'" :key="index" class="graphic-layout-item">
        <div class="graphic-index-title">
          <div class="title">{{ card.tab_name }}</div>
          <nuxt-link :to="`/query?${format_url_params({
            tab: card.tab_id,
            title: card.tab_name,
            _type: props.type,
            _sort_key: 'order'
          })}`" class="more">
            查看更多 >
          </nuxt-link>
        </div>
        <div class="dx-list" @touchmove.stop>
          <scroll-x-view>
            <div v-for="(cardItem, cardIndex) in card?.items" :key="cardIndex"
              v-link="`/${props.type}?id=${cardItem.id}`" class="graphic-information">
              <div class="content">
                <div class="thumb"><dx-image :src="cardItem.thumb_full" /></div>

                <dx-pay-type :coins="cardItem.coins" class="absolute right-0.5 top-0.5" />
              </div>

              <div class="truncate">{{ cardItem.title }}</div>
            </div>
            <div v-if="card.items?.length == 0" class="comics-empty">数据为空</div>
          </scroll-x-view>
        </div>
      </div>
      <div v-else-if="card.show_style === 'V-3*N'" :key="index + 1" class="graphic-layout-item">
        <div class="graphic-index-title">
          <div class="title">{{ card.tab_name }}</div>
          <nuxt-link :to="`/query?${format_url_params({
            tab: card.tab_id,
            title: card.tab_name,
            _type: props.type,
            _sort_key: 'order'
          })}`" class="more">
            查看更多 >
          </nuxt-link>
        </div>
        <div class="graphic-layout-three">
          <div v-for="(cardItem, cardIndex) in card?.items" :key="cardIndex" v-link="`/${props.type}?id=${cardItem.id}`"
            class="graphic-information-common">
            <div class="thumb">
              <dx-image :src="cardItem.thumb_full" />
              <dx-pay-type :coins="cardItem.coins" class="absolute right-0.5 top-0.5" />
            </div>
            <div class="line-clamp-1">{{ cardItem.title }}</div>
          </div>
          <div v-if="card.items?.length == 0" class="comics-empty">数据为空</div>
        </div>
      </div>
      <div v-else-if="card.show_style === 'V-2*N'" :key="index + 2" class="graphic-layout-item">
        <div class="graphic-index-title">
          <div class="title">{{ card.tab_name }}</div>
          <nuxt-link :to="`/query?${format_url_params({
            tab: card.tab_id,
            title: card.tab_name,
            _type: props.type,
            _sort_key: 'order'
          })}`" class="more">
            查看更多 >
          </nuxt-link>
        </div>
        <div class="graphic-layout-two grid grid-cols-2 gap-1 px-1">
          <div v-for="(cardItem, cardIndex) in card?.items" :key="cardIndex" v-link="`/${props.type}?id=${cardItem.id}`"
            class="graphic-information-common">
            <div class="thumb">
              <dx-image :src="cardItem.thumb_full" />
              <dx-pay-type :coins="cardItem.coins" class="absolute right-0.5 top-0.5" />
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

.graphic-information {
  display: inline-block;
  margin-right: 0.3rem;
  width: 2.6rem;
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

    .update {
      position: absolute;
      z-index: 2;
      bottom: 0.15rem;
      right: 0.15rem;
      color: white;
      padding: 0.05rem 0.1rem;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .title {
    color: #333333;
    font-size: 0.32rem;
    white-space: nowrap;
    width: 2.6rem;
    text-overflow: ellipsis;
    overflow: hidden;
  }
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
