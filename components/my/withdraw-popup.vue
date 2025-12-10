<template>
  <van-popup
    teleport="body"
    v-bind="$attrs"
    position="right"
    :lock-scroll="false"
    :style="{ width: '100% !important', height: '100%' }"
    @open="execute"
  >
    <div class="grey-bg container">
      <dx-navbar
        class="custom-nav-bar"
        right-text="提现记录"
        :border="false"
        title="提现"
        left-arrow
        @click-left="onClose"
        @click-right="__.$NavigateTo('/withdraw-record')"
      ></dx-navbar>
      <div class="scroll-container">
        <scroll-list>
          <div class="user-withdraw-content">
            <div class="header-box">
              <div class="title">{{ props.data?.can_withdraw }}</div>
              <span class="subtitle">男票余额（1男票=1元）</span>
            </div>
            <div class="user-withdraw-title">余额提现</div>
            <div class="user-withdraw-input">
              <input
                :value="params.number"
                type="number"
                placeholder="输入大于100的整数,单笔最高1万元"
                @input="onInput"
              />
            </div>
            <div class="withdraw-rate">
              <span>提现比例{{ Number(props.data?.rate) * 100 }}%（含通道手续费）</span>
              <span v-if="params.number" style="color: rgb(210 161 82)">
                实际到账金额¥{{ params.number * Number(props.data?.rate) }}元
              </span>
            </div>

            <div class="account-box" @click="showAccount = true">
              {{ accoutInfo?.account || '请选择提现账户' }}
              <img class="my-icon-arrow" src="~/assets/image/my/icon_right_grey_thin.png" />
            </div>
            <div class="user-withdraw-prompt">提现规则</div>
            <div class="user-withdraw-prompt" v-html="info?.income?.rule?.replaceAll('\n', '<br/>')" />
            <dx-button class="user-public-btn" @click="onWithdraw">确认提现</dx-button>
          </div>
        </scroll-list>
      </div>
    </div>
    <account-popup v-model:show="showAccount"></account-popup>
  </van-popup>
</template>

<script setup lang="ts">
import type { IncomeItem } from '@types'

const props = defineProps<{
  data?: IncomeItem
  type?: number
}>()
const emit = defineEmits<{
  'update:show': [e: boolean]
  success: []
}>()

const showAccount = ref(false)
const onClose = () => {
  emit('update:show', false)
}

const { accoutInfo } = storeToRefs(useAccountStore())
const __ = useNuxtApp()

const params = reactive({
  number: '',
  bankCard: '',
  name: ''
})

const { data: info, execute } = useMyFetch({
  api: __.$Api.User.userMoney
})

const onInput = (e: Event) => {
  const target = e.target as unknown as HTMLInputElement
  const tempReplace = target.value.replace(/[^\d]/g, '')
  if (props?.data?.can_withdraw && Number(tempReplace) > props.data.can_withdraw) {
    const strTemp = String(tempReplace).substr(0, String(tempReplace).length - 1)
    params.number = Number(strTemp)
    target.value = Number(strTemp)
    __.$Toast('当前输入大于可提现金额')
  } else {
    params.number = Number(tempReplace)
    target.value = Number(tempReplace)
  }
}

const { validate } = useValidator({
  withdraw_amount: [
    {
      type: 'number',
      required: true,
      message: '请输入提现金额'
    },
    {
      type: 'number',
      message: '可到账金额应大于100',
      min: 100
    }
  ],
  withdraw_account: {
    type: 'string',
    required: true,
    message: '请选择提现账户'
  }
})

const onWithdraw = async () => {
  const { number: withdraw_amount } = params
  const { account: withdraw_account, name: withdraw_name } = accoutInfo.value
  const withdraw_from = props.type || 3 // 收益类型{1: 币, 2: 推广收益, 3: mv收益 5社区收益}

  try {
    await validate({
      withdraw_amount: Number(withdraw_amount),
      withdraw_account
    })
    await __.$Api.User.withdraw({
      withdraw_amount,
      withdraw_account,
      withdraw_from,
      withdraw_name,
      withdraw_type: 1
    })

    emit('success')
  } catch (error) {}
}

useDectivted(onClose)
</script>

<style lang="less" scoped>
.withdraw-rate {
  font-size: 12px;
  margin-bottom: 12px;
}
.user-public-btn {
  width: 300px;
  display: block;
  margin: 18px auto 0;
}
.user-withdraw-content {
  padding: 0.4rem;

  .header-box {
    width: 100%;
    height: 125px;
    background: center/contain no-repeat url(~/assets/image/my/asset-bg.png);
    padding: 26px;
    margin-bottom: 24px;

    .title {
      font-size: 34px;
      font-weight: 500;
      color: #fff;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .user-withdraw-title {
    padding-bottom: 0.25rem;
    font-size: 0.4rem;
    color: #000;
  }

  .user-withdraw-prompt {
    font-size: 0.35rem;
    line-height: 0.625rem;
    color: rgb(102, 102, 102);
  }

  .user-withdraw-input {
    height: 1.25rem;
    margin-bottom: 0.5rem;
    padding: 0 0.4rem;
    background: #fff;
    border-radius: 0.125rem;

    input {
      width: 100%;
      height: 1.25rem;
      font-size: 0.4rem;
      color: var(--dx-base1-color);
      caret-color: #000;
      background: #fff;
      border: none;
      display: block;
    }
  }

  .account-box {
    height: 1.25rem;
    padding: 0 0.4rem;
    margin-bottom: 0.5rem;
    font-size: 0.4rem;
    color: var(--dx-base1-color);
    background: #fff;
    border-radius: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      height: 0.25rem;
    }
  }
}
.my-icon-arrow {
  width: 6px;
  height: 10px;
}
</style>
