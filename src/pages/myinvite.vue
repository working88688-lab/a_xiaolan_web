<template>
  <div class="container">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading">
        <div class="user-make-money-top">
          <div class="user-make-money-top-title">邀好友，能赚钱</div>
          <div class="user-make-money-top-subtitle">好友开通VIP立即获得30%分红奖励</div>
          <div class="user-make-money-top-box">
            <div class="title">我的邀请</div>
            <div class="subtitle">
              好友开通VIP立即获得
              <span class="color-text">30%充值收益</span>
            </div>
            <div class="row-statistics">
              <div class="item">
                <div class="title">{{ data?.total_invited_num || 0 }}</div>
                <div class="subtitle">成功邀请数</div>
              </div>
              <div class="item">
                <div class="title">{{ data?.total_invited_reg_num || 0 }}</div>
                <div class="subtitle">注册用户数</div>
              </div>
              <div class="item">
                <div class="title">{{ data?.total_tui_coins || 0 }}</div>
                <div class="subtitle">累计收入</div>
              </div>
            </div>
            <div class="row-active">
              <div class="item" @click="toRevenue" />
              <div v-link="`/invite-records`" class="item" />
              <div v-link="`/invite`" class="item" />
            </div>
          </div>
        </div>
        <div class="user-make-money-title" />
        <div class="user-make-money-list" />
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
const { data, loading } = useMyFetch({
  api: __.$Api.User.myInvite,
  immediate: true
})
const route = useRoute()
const toRevenue = () => {
  if (__.$Store.user.u.is_reg) {
    __.$NavigateTo('/revenue')
  } else {
    __.$NavigateTo(`/login?redirect=${route.fullPath}`)
  }
}
</script>

<style lang="less" scoped>
.user-make-money-top {
  width: 100%;
  height: 13.04rem;
  background: top/contain no-repeat url('~/assets/image/my/bg_make_money_top.png');
  overflow: hidden;

  .user-make-money-top-title {
    text-align: center;
    font-size: 0.8rem;
    background-image: -webkit-linear-gradient(bottom, #a03703, #d95e04);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }

  .user-make-money-top-subtitle {
    text-align: center;
    font-size: 0.4rem;
    color: #ff2428;
    background-color: rgba(252, 212, 197, 0.4);
    padding: 0.1rem 0;
    margin-top: 0.25rem;
  }

  .user-make-money-top-box {
    width: 9.2rem;
    margin: 0 auto;
    padding: 0.4rem;
    background: #fff;
    border-radius: 0.2rem;
    position: relative;
    top: 4.5rem;
    z-index: 2;

    .title {
      font-size: 0.45rem;
      font-weight: bold;
    }

    .subtitle {
      font-size: 0.25rem;
      color: #666;
    }

    .color-text {
      color: #e8640a;
    }

    .row-statistics {
      margin: 0.5rem 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .item {
        flex: 1;
        color: var(--dx-base2-color);
        text-align: center;

        .title {
          font-size: 0.75rem;
          font-weight: bold;
        }

        .subtitle {
          font-size: 0.25rem;
          color: var(--dx-base2-color);
        }
      }
    }

    .row-active {
      margin: 0.125rem 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .item {
        flex: 1;
        height: 1rem;
        font-weight: bold;
        color: var(--dx-base2-color);
        text-align: center;
        cursor: pointer;
        &:nth-child(1) {
          background: center/contain no-repeat url('~/assets/image/my/bg_make_money_active_1.png');
        }

        &:nth-child(2) {
          background: center/contain no-repeat url('~/assets/image/my/bg_make_money_active_2.png');
        }

        &:nth-child(3) {
          background: center/contain no-repeat url('~/assets/image/my/bg_make_money_active_3.png');
        }
      }
    }
  }
}
.user-make-money-title {
  height: 1.15rem;
  background: center/contain no-repeat url('~/assets/image/my/make_money_title.png');
  background-color: #ea4843;
}

.user-make-money-list {
  width: 10rem;
  height: 12.25rem;
  margin: 0 auto;
  padding-top: 1rem;
  background: center/9.2rem no-repeat url('~/assets/image/my/make_money_list.png');
  background-color: #ea4843;
}
</style>
