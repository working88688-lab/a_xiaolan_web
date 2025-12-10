<template>
  <div class="scroll-conainer h-full">
    <div class="dx dx-flex dx-flex-col h-full">
      <div class="myIncomeSlidePage myIncome">
        <div class="top">
          <div class="incomeText">
            <div class="incomeText_number" style="font-size: 34px">{{ props.cardData?.can_withdraw ?? 0 }}</div>
            <div class="incomeText_desc">收入余额（男票）</div>
          </div>
          <div class="my-row">
            <div class="incomeText">
              <div class="incomeText_number">{{ props.cardData?.total_post_coins ?? 0 }}</div>
              <div class="incomeText_desc">累计收入</div>
            </div>
            <div class="incomeText">
              <div class="incomeText_number">{{ props.cardData?.today_post_coins ?? 0 }}</div>
              <div class="incomeText_desc">今日收入</div>
            </div>
            <img src="~/assets/image/my/cashout.png" alt="" class="cashoutIcon" @click.stop="openWithDrwa" />
          </div>
        </div>
      </div>
      <div class="scroll-container">
        <dx-tabs
          v-model:active="active"
          shrink
          class="secondtabbar h-full"
          title-inactive-color="#808080"
          color="#d2a152"
          type="card"
        >
          <van-tab title="最新作品收益">
            <scroll-list position="static" :is-empty="isEmpty">
              <template v-if="isVideo">
                <div
                  v-for="(item, _index) in newestData"
                  :key="_index"
                  class="incomeCard"
                  :style="{ marginBottom: 10 }"
                >
                  <div class="incomeCard_left flex-shrink-0">
                    <div class="h-full w-full" :style="{ borderRadius: 5, overflow: 'hidden' }">
                      <dx-image :src="item.cover_thumb_url"></dx-image>
                    </div>
                    <div class="player_text">
                      <div>{{ item.rating }}次播放</div>
                      <div>{{ item.duration_str }}</div>
                    </div>
                  </div>
                  <div class="incomeCard_right">
                    <div class="incomeCard_title">{{ item.title }}</div>
                    <div class="incomeCard_sumincome">总收益：{{ item.coins }}</div>
                    <div
                      v-link="`/my/income-detail?type=1&id=${item.id}`"
                      class="incomeCard_checkdetails"
                      @click="set_cache(item)"
                    >
                      查看明细
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-for="(item, _index) in newestData" :key="_index" class="incomeCard">
                  <div class="incomeCard_left">
                    <div :style="{ borderRadius: 5, overflow: 'hidden' }">
                      <dx-image :src="item.medias?.[0]?.cover_url_full" />
                    </div>
                    <div class="player_text">
                      <div>{{ item.reward_num || 0 }}次购买</div>
                      <div>{{ item.favirute_num || 0 }}次收藏</div>
                    </div>
                  </div>
                  <div class="incomeCard_right">
                    <div class="incomeCard_title">{{ item.title }}</div>
                    <div class="incomeCard_sumincome">总收益：{{ item.reward_amount }}</div>
                    <div
                      v-link="`/my/income-detail?type=2&id=${item.id}`"
                      class="incomeCard_checkdetails"
                      @click="set_cache(item)"
                    >
                      查看明细
                    </div>
                  </div>
                </div>
              </template>
            </scroll-list>
          </van-tab>
          <van-tab title="最热作品收益">
            <scroll-list position="static" :is-empty="isHotEmpty">
              <template v-if="isVideo">
                <div
                  v-for="(item, _index) in incomeList"
                  :key="_index"
                  class="incomeCard"
                  :style="{ marginBottom: 10 }"
                >
                  <div class="incomeCard_left">
                    <div class="h-full w-full" :style="{ borderRadius: 5, overflow: 'hidden' }">
                      <dx-image :src="item.cover_thumb_url"></dx-image>
                    </div>
                    <div class="player_text">
                      <div>{{ item.rating }}次播放</div>
                      <div>{{ item.duration_str }}</div>
                    </div>
                  </div>
                  <div class="incomeCard_right">
                    <div class="incomeCard_title">{{ item.title }}</div>
                    <div class="incomeCard_sumincome">总收益：{{ item.coins }}</div>
                    <div
                      v-link="`/my/income-detail?type=1&id=${item.id}`"
                      class="incomeCard_checkdetails"
                      @click="set_cache(item)"
                    >
                      查看明细
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-for="(item, _index) in incomeList" :key="_index" class="incomeCard">
                  <div class="incomeCard_left">
                    <div :style="{ borderRadius: 5, overflow: 'hidden' }">
                      <dx-image :src="item.medias?.[0]?.cover_url_full" />
                    </div>
                    <div class="player_text">
                      <div>{{ item.reward_num || 0 }}次购买</div>
                      <div>{{ item.favirute_num || 0 }}次收藏</div>
                    </div>
                  </div>
                  <div class="incomeCard_right">
                    <div class="incomeCard_title">{{ item.title }}</div>
                    <div class="incomeCard_sumincome">总收益：{{ item.reward_amount }}</div>
                    <div
                      v-link="`/my/income-detail?type=2&id=${item.id}`"
                      class="incomeCard_checkdetails"
                      @click="set_cache(item)"
                    >
                      查看明细
                    </div>
                  </div>
                </div>
              </template>
            </scroll-list>
          </van-tab>
        </dx-tabs>
      </div>
    </div>
    <withdraw-popup
      v-model:show="showWithdraw"
      :type="type"
      :data="props.cardData"
      @success="onSuccess"
    ></withdraw-popup>
  </div>
</template>

<script setup lang="ts">
import type { ApiLike, HotItem, IncomeItem } from '@types'
const props = defineProps<{
  cardData?: IncomeItem
  type?: number
  newApi: ApiLike
  hotApi: ApiLike
  isVideo?: boolean
}>()

const emit = defineEmits<{
  success: []
}>()
const active = ref(0)
const showWithdraw = ref(false)
const openWithDrwa = () => {
  showWithdraw.value = true
}
const __ = useNuxtApp()
const { data: newestData, isEmpty } = useFetchList<HotItem>({
  api: props.newApi,
  params: {
    type: 'newest',
    page: 1,
    limit: 1000
  },
  immediate: true
})

const { data: incomeList, isEmpty: isHotEmpty } = useFetchList<HotItem>({
  api: props.hotApi,
  params: {
    type: 'hottest',
    page: 1,
    limit: 1000
  },
  immediate: true,
  success() {
    console.log('incomeList: ', incomeList)
  }
})

const set_cache = (item: any) => {
  __.$Store.dynamic.setCache(item)
}

const onSuccess = () => {
  emit('success')
}
</script>

<style lang="less" scoped>
:deep(.van-tabs__wrap) {
  display: flex;
  justify-content: center;
  margin: 8px;
  .van-tab__text {
    font-size: 12px !important;
  }
}
:deep(.van-tabs__content) {
  height: 100%;
  overflow: hidden;
}
.myIncome {
  width: 100%;
  .back-header {
    width: 100%;
  }
  .top {
    background: url('~/assets/image/my/myincome.png') no-repeat fixed center / cover;
    margin: 10px;
    height: 156px;
    border-radius: 10px;
    padding: 20px;
    .incomeText_number {
      color: white;
      font-size: 16px;
    }
    .incomeText_desc {
      color: white;
      font-size: 11px;
      opacity: 0.6;
    }
  }
  .cashoutIcon {
    width: 80px;
    height: 30px;
  }
}
.my-row {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.incomeCard {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  .incomeCard_left {
    width: 50%;
    max-height: 93px;
    overflow: hidden;
    display: flex;
    flex-direction: column-reverse;
    .player_text {
      position: absolute;
      color: white;
      display: flex;
      justify-content: space-between;
      width: 45%;
      margin: 0 5px;
    }
  }
  .incomeCard_right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .incomeCard_sumincome {
      color: rgb(210 161 82);
    }
    .incomeCard_checkdetails {
      color: red;
    }
  }
}

.myIncome-topbar {
  .income-featured-tab-item {
    display: inline-block;
    color: var(--dx-base1-color);
    font-size: 0.45rem;
    margin-left: 15px;
    margin-right: 8px;
    padding-bottom: 0.1rem;
  }
  .income-featured-tab-item-active {
    color: rgb(210 161 82);
    font-size: 0.5rem;
    font-weight: bold;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 25%;
      height: 0.1rem;
      border-radius: 5px;
      transform: translateX(-50%);
      //   background-image: linear-gradient(to left, #6de6fb, #428af7);
      background-color: rgb(210 161 82);
    }
  }
}
.secondtabbar {
}
</style>
