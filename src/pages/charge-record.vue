<template>
  <div class="container">
    <scroll-list v-model:loading="loading" :is-empty="isEmpty" :is-end="isEnd" :pullup="execute">
      <div class="user-recharge-list-box">
        <div v-for="item in listData" :key="item.order_id" class="order-item-default">
          <div class="top-box">
            <div class="left">
              <p class="small">订单编号：{{ item?.order_id }}</p>
            </div>
            <div class="text-blue" @click="onCopy(item.order_id)">复制</div>
          </div>
          <div class="center-box">
            <div class="left">
              <p class="title">{{ item?.descp }}</p>
            </div>
            <div class="right">
              <p class="text-yellow">¥{{ item?.amount_rmb }}</p>
              <p class="text-red">{{ setStatus(item.status) }}</p>
            </div>
          </div>
          <div class="bottom-box">
            <div class="left">
              <p class="small">{{ item?.created_str }}</p>
            </div>
            <div class="right">
              <div class="btn" @click="__.$NavigateTo('/customer')">联系客服</div>
            </div>
          </div>
        </div>
      </div>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

type Item = {
  order_id: string
  descp: string
  amount_rmb: string
  status: number
  created_str: string
}
const __ = useNuxtApp()

const { listData, loading, execute, isEmpty, isEnd } = useFetchList<Item>({
  api: __.$Api.User.chargeRecord,
  immediate: true
})

const { copy } = useClipboard({ source: '', legacy: true })

const onCopy = (value: string) => {
  copy(value)
  __.$Toast(`复制编号${value}成功`)
}
const setStatus = (status: number) => {
  let text = '未支付'
  switch (status) {
    case 2:
      text = '支付中'
      break
    case 3:
      text = '支付成功'
      break
    case 99:
      text = '交易失败'
      break
    default:
      text = '未支付'
      break
  }
  return text
}
</script>

<style lang="less" scoped>
.user-recharge-list-box {
  padding: 12px;
}
.order-item-default {
  margin-top: 0.4rem;
  padding: 0.4rem;
  background: #fff;
  border-radius: 0.2rem;

  &:first-child {
    margin-top: 0;
  }

  .top-box,
  .center-box,
  .bottom-box {
    padding: 0.2rem 0;
    display: flex;
    align-items: center;

    .left {
      flex: 1;
    }

    .right {
      text-align: center;
    }
  }

  .top-box {
    border-bottom: 1px solid #f5f5f5;
  }

  .title {
    font-size: 0.5rem;
    font-weight: 500;
    color: #1a1a1a;
  }

  .small {
    font-size: 0.3rem;
    color: #999;
  }

  .text-yellow {
    font-size: 0.6rem;
    font-weight: 500;
    color: #f7bd01;
  }

  .text-blue {
    font-size: 0.3rem;
    color: #3772f6;
  }

  .text-red {
    font-size: 0.3rem;
    color: red;
  }

  .btn {
    width: 2rem;
    height: 0.75rem;
    line-height: 0.75rem;
    font-size: 0.35rem;
    color: #fff;
    background-image: -webkit-gradient(linear, right top, left top, from(#ec635e), to(#f1963e));
    background-image: linear-gradient(to left, #ec635e, #f1963e);
    border-radius: 0.375rem;
  }
}
</style>
