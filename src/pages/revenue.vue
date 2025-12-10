<template>
  <div class="container">
    <dx-navbar
      class="custom-nav-bar"
      right-text="提现记录"
      :border="false"
      title="收益明细"
      left-arrow
      @click-left="__.$Back"
      @click-right="__.$NavigateTo('/invite-records')"
    ></dx-navbar>
    <div class="scroll-container">
      <scroll-list>
        <div class="user-income-content">
          <div class="user-income-info">
            <div class="user-income-info-row">
              <div class="user-income-info-item" :style="{ alignItems: 'flex-start' }">
                <div class="title" :style="{ paddingLeft: '0.5rem' }">
                  {{ info?.income?.tui_coins ?? '0.00' }}
                </div>
                <div class="text" :style="{ paddingLeft: '0.5rem' }">收入余额（金币）</div>
              </div>
              <div class="user-income-info-item">
                <div class="btn" @click="showWithdraw = true">
                  去提现
                  <img src="~/assets/image/my/icon_right_black_thin.png" />
                </div>
              </div>
            </div>
            <div class="user-income-info-row">
              <div class="user-income-info-item">
                <div class="subtitle">
                  <span class="text">累计收入</span>
                  &nbsp;
                  {{ info?.income?.total_tui_coins ?? '0.00' }}
                </div>
              </div>
              <div class="user-income-info-item">
                <div class="subtitle">
                  <span class="text">今日收入</span>
                  &nbsp;
                  {{ info?.income?.today_tui_coins || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="info.list?.length" class="user-income-list">
          <div v-for="(item, index) in info.list" :key="index" class="user-income-list-item-box">
            <div class="user-income-list-item">
              <div class="title">{{ item?.nickname }}</div>
              <div class="subtitle">{{ item?.create_str }}</div>
            </div>
            <div class="user-income-list-item">
              <div class="title">{{ item?.amount }}</div>
            </div>
          </div>
        </div>
        <dx-empty
          v-else
          position="static"
          :image-size="['8.6rem', '5rem']"
          description="什么都没有，好空虚啊"
        ></dx-empty>
      </scroll-list>
    </div>
    <withdraw-popup v-model:show="showWithdraw" :type="2" :data="info.income" @success="execute"></withdraw-popup>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const showWithdraw = ref(false)
const { data: info, execute } = useMyFetch<any>({
  api: __.$Api.User.userMoney,
  immediate: true
})
</script>

<style lang="less" scoped>
.user-income-content {
  flex: 1;
  padding: 0.4rem;
  background: var(--dx-gray-color);
}
.user-income-info {
  width: 9.2rem;
  height: 3.5rem;
  padding: 0.4rem;
  border-radius: 0.2rem;
  color: #fff;
  background: center/cover no-repeat url('~/assets/image/my/bg_income_top.png');

  .user-income-info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-income-info-item {
      flex: 1;
      padding: 0.25rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .title {
    font-size: 0.75rem;
  }

  .subtitle {
    font-size: 0.4rem;
  }

  .text {
    font-size: 0.3rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .btn {
    height: 1rem;
    margin: 0.1rem 0 0 0.5rem;
    padding: 0 0.4rem;
    font-size: 0.35rem;
    text-align: center;
    color: #000;
    white-space: nowrap;
    background-image: linear-gradient(to right, #fff, #bbc4e4);
    border-radius: 1rem;
    display: flex;
    align-items: center;

    img {
      height: 0.25rem;
      margin-left: 0.1rem;
    }
  }
}
</style>
