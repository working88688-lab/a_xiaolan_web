<template>
  <div class="container">
    <div class="user-coins-recharge">
      <dx-navbar
        class="my-nav-bar"
        right-text="充值记录"
        :border="false"
        title="金币充值"
        left-arrow
        @click-left="__.$Back"
        @click-right="__.$NavigateTo('/charge-record')"
      ></dx-navbar>
      <div class="user-coins-recharge-info">
        <div class="title">金币余额</div>
        <div class="number">{{ user?.coins }}</div>
        <div class="btn" @click="__.$NavigateTo('/coin-record')">金币明细</div>
      </div>
      <div class="scroll-container">
        <scroll-list v-model:loading="loading">
          <div class="user-coins-recharge-list">
            <div class="box">
              <div v-for="item in data?.list?.online" :key="item.id" class="item" @click.stop="onSelect(item)">
                <div class="top-box">{{ item?.coins + item?.free_coins }}金币</div>
                <img class="icon" src="~/assets/image/my/icon_coins.png" />
                <div class="bottom-box">
                  <span class="mark">¥</span>
                  {{ item?.p }}
                </div>
              </div>
            </div>
          </div>
        </scroll-list>
      </div>
    </div>
    <payment-action v-model:show="showPayment" target="pw_new" :data="payment"></payment-action>
  </div>
</template>

<script setup lang="ts">
const { u: user } = storeToRefs(useUserStore())
const __ = useNuxtApp()
const _router = useRouter()
const { data, loading } = useMyFetch({
  api: __.$Api.User.chargeList,
  immediate: true,
  params: {
    type: 2
  }
})
const showPayment = ref(false)
const payment = ref()
const onSelect = item => {
  payment.value = item
  showPayment.value = true
}
useNoticeWithoutReg()
</script>

<style lang="less" scoped>
.my-nav-bar {
  color: #fff;
  background: transparent;
  :deep(.van-nav-bar__text),
  :deep(.van-icon-arrow-left),
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}
.user-coins-recharge {
  background: top/contain no-repeat url('~/assets/image/my/bg_coins_recharge.png');

  .user-coins-recharge-info {
    height: 1.8rem;
    margin: 1rem 0.4rem 0.3rem 0.4rem;
    padding: 0.25rem 0.5rem;
    background-image: linear-gradient(to bottom, #ffe2bc, #ffe9c9, #fddaac);
    border-radius: 0.9rem;
    display: flex;
    align-items: center;

    .title {
      height: 1rem;
      line-height: 1rem;
      padding-right: 0.4rem;
      font-size: 0.35rem;
      color: #c2893b;
      border-right: 0.02rem solid #c2893b;
    }

    .number {
      flex: 1;
      padding: 0 0.4rem;
      font-size: 1rem;
      color: #c2893b;
    }

    .btn {
      height: 1rem;
      line-height: 1rem;
      font-size: 0.3rem;
      font-weight: 500;
      color: #999;
    }
  }

  .user-coins-recharge-list {
    padding: 0 0.3rem 0.3rem 0.3rem;

    .title {
      font-size: 0.4rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .box {
      margin-top: 0.4rem;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-row-gap: 0.3rem;
      grid-column-gap: 0.3rem;
      overflow: hidden;

      .item {
        padding: 0.35rem 0;
        background-image: linear-gradient(to bottom, #ffe2bc, #ffe9c9, #fddaac);
        border-radius: 0.25rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .top-box {
          font-size: 0.5rem;
          font-weight: 500;
          color: #c2893b;
        }

        .icon {
          width: 1.4rem;
          height: 1.4rem;
          display: block;
        }

        .bottom-box {
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: flex-start;
          justify-content: center;

          .mark {
            font-size: 0.4rem;
            font-weight: 500;
            font-style: oblique;
            font-style: italic;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
