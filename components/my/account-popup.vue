<template>
  <van-popup
    teleport="body"
    v-bind="$attrs"
    position="right"
    :lock-scroll="false"
    :style="{ width: '100% !important', height: '100%' }"
    @open="onOpen"
    @closed="onClosed"
  >
    <div class="container">
      <dx-navbar
        class="custom-nav-bar"
        right-text="提现账号"
        :border="false"
        title="提现账号"
        left-arrow
        @click-left="onClose"
        @click-right="onDeleteItem"
      >
        <template #right>
          <img
            :style="{
              width: '.4rem',
              height: '.4rem'
            }"
            src="~/assets/image/icon_del_grey.png"
            alt=""
          />
        </template>
      </dx-navbar>
      <div class="scroll-container">
        <scroll-list>
          <div v-for="(item, index) in accountList" :key="index" class="user-account-item" @click="handleChoose(item)">
            <div :class="['radio-box', item?.id === selectAccount?.id ? 'active' : '']">
              <div class="radio-box-inner" />
            </div>
            <div class="text-box">
              <p class="title break-all">{{ item?.account_bank }}</p>
              <p class="text break-all">{{ item?.account }}</p>
              <p class="subtitle break-all">持卡人：{{ item?.name }}</p>
            </div>
          </div>
          <div class="user-account-add-btn-box" @click="showDialog = true">
            <div>
              <img src="~/assets/image/my/icon_add_white_bg.png" />
              <p class="text">添加银行卡</p>
            </div>
          </div>
        </scroll-list>
      </div>
      <div class="user-account-list-bottom">
        <dx-button class="user-public-btn" @click="onSelectAccount">确认提现</dx-button>
      </div>
    </div>

    <van-dialog v-model:show="showDialog" title="添加提现账户" close-on-click-overlay>
      <div class="user-account-list-alert">
        <div class="user-input-box" style="--van-cell-vertical-padding: 0; --van-cell-horizontal-padding: 0">
          <van-field v-model="formState.account_bank" placeholder="请输入银行名称" />
        </div>

        <div class="user-input-box" style="--van-cell-vertical-padding: 0; --van-cell-horizontal-padding: 0">
          <van-field v-model="formState.account" :formatter="formatter" placeholder="请输入银行卡账号" />
        </div>
        <div class="user-input-box" style="--van-cell-vertical-padding: 0; --van-cell-horizontal-padding: 0">
          <van-field v-model="formState.name" placeholder="请输入持卡人姓名" />
        </div>
      </div>
      <template #footer>
        <div class="my-footer"><dx-button class="btn-withdraw" @click="onAddAcount">确认</dx-button></div>
      </template>
    </van-dialog>
  </van-popup>
</template>

<script setup lang="ts">
import type { AcountInfo, IncomeItem } from '@types'

const props = defineProps<{
  data?: IncomeItem
  type?: number
}>()
const emit = defineEmits<{
  'update:show': [e: boolean]
}>()

const __ = useNuxtApp()
const accountStore = useAccountStore()
const selectAccount = ref<AcountInfo>({
  id: undefined,
  account_bank: '',
  account: undefined,
  name: ''
})
const showDialog = ref(false)
const formState = reactive({
  account_bank: '',
  account: '',
  name: ''
})

const onClose = () => {
  emit('update:show', false)
}
const { data: accountList, execute } = useMyFetch<AcountInfo[]>({
  api: __.$Api.User.getAccount
})

const { validate } = useValidator({
  account_bank: {
    type: 'string',
    required: true,
    message: '银行名称不能为空'
  },
  account: {
    type: 'string',
    required: true,
    message: '银行卡号不能为空'
  },
  name: {
    type: 'string',
    required: true,
    message: '持卡人姓名不能为空'
  }
})

const onAddAcount = async () => {
  try {
    await validate(formState)
    await __.$Api.User.addAccount(formState)
    formState.account = ''
    formState.account_bank = ''
    formState.name = ''
    execute()
  } catch (error) {
  } finally {
    showDialog.value = false
  }
}
const handleChoose = (item: AcountInfo) => {
  selectAccount.value = item
}

const onOpen = () => {
  execute()
  if (accountStore.accoutInfo.id) {
    selectAccount.value = {
      ...accountStore.accoutInfo
    }
  }
}
const onClosed = () => {
  selectAccount.value = {
    id: undefined,
    account_bank: '',
    account: undefined,
    name: ''
  }
}

const onDeleteItem = async () => {
  const id = selectAccount.value.id
  if (!id) {
    return __.$Toast('请先选择提现账号')
  }
  await __.$Alert({
    title: '删除',
    message: '是否删除当前账户',
    closeOnClickOverlay: true,
    confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)'
  })
  await __.$Api.User.delAccount({
    id
  })
  execute()
  onClosed()
}

const onSelectAccount = () => {
  accountStore.setAccount(selectAccount.value)
  onClosed()
  onClose()
}

const formatter = (value: string) => value.replace(/\D/g, '')
</script>

<style lang="less" scoped>
.my-footer {
  padding: 12px;
}
.btn-withdraw {
  width: 280px;
  display: block;
  margin: 0 auto;
}
.user-account-list-bottom {
  padding: 10px 8px;
}
.user-public-btn {
  width: 300px;
  display: block;
  margin: 0 auto;
}
.user-account-add-btn-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 1.8rem;
    height: 1.8rem;
  }

  .text {
    margin-top: 0.125rem;
    font-size: 0.4rem;
    color: #b2b2b2;
  }
}
.user-account-list-alert {
  padding: 16px;
  margin-top: 24px;
  .user-input-box {
    margin-bottom: 12px;
  }
}

.user-account-item {
  padding: 0.4rem;
  display: flex;
  align-items: center;

  &:first-child {
    padding-top: 0;
  }

  .radio-box {
    padding-right: 0.3rem;

    &.active {
      .radio-box-inner {
        border: 0.01rem solid #1989fa;
        background: center/cover no-repeat url('~/assets/image/my/icon_withdraw_account_hook.jpg');
      }
    }

    .radio-box-inner {
      width: 0.5rem;
      height: 0.5rem;
      border: 0.01rem solid #b5b5b5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
    }
  }

  .text-box {
    flex: 1;
    padding: 0.3rem;
    font-size: 0.35rem;
    color: #fff;
    background-image: linear-gradient(to top, #6f5ff6, #537afb);
    border-radius: 0.15rem;

    .title {
      font-size: 0.4rem;
      color: #fff;
      line-height: 0.8rem;
    }

    .subtitle {
      font-size: 0.3rem;
      color: rgba(255, 255, 255, 0.3);
    }

    .text {
      font-size: 0.5rem;
      font-weight: 500;
      color: #fff;
      padding: 0.125rem 0;
    }
  }
}
</style>
