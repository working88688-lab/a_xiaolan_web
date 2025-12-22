<!-- 
    desc: 设置
    date: 2024.03.30
-->
<template>
  <div>
    <!-- cell start -->
    <div class="user-set-list">
      <van-cell title="填写兑换码" icon="location-o" is-link @click="openDialog('1')">
        <template #icon>
          <img class="my-icon" src="~/assets/image/my/icon-set1.png" alt="" />
        </template>
      </van-cell>
      <van-cell title="填写邀请码" icon="location-o" :value="user.invite_by_code" is-link @click="openDialog('2')">
        <template #icon>
          <img class="my-icon" src="~/assets/image/my/icon-set2.png" alt="" />
        </template>
      </van-cell>
      <van-cell title="账号凭证" icon="location-o" is-link @click="showCoverDialog">
        <template #icon>
          <img class="my-icon" src="~/assets/image/my/icon-set3.png" alt="" />
        </template>
      </van-cell>
    </div>
    <!-- cell end -->

    <dx-button v-if="user?.is_reg" class="logout-button" @click="unBind">退出登录</dx-button>
    <!-- 兑换码、邀请码 start -->
    <van-dialog v-model:show="dialogShow" :close-on-click-overlay="true" :title="message[dialogType]">
      <div class="dx dx-flex dx-justify-center">
        <van-field v-if="dialogType === '1'" v-model="invitCode" class="invite-code" placeholder="请填写兑换码" />
        <van-field v-else v-model="invitCode" class="invite-code" placeholder="请填写邀请码" />
      </div>
      <template #footer>
        <div class="submit-container">
          <dx-button class="submit-button" @click="onSubmit">确定</dx-button>
        </div>
      </template>
    </van-dialog>
    <!-- 兑换码、邀请码 end -->

    <van-dialog v-model:show="coverShow" width="280" :close-on-click-overlay="true" :show-confirm-button="false">
      <div>
        <div class="cover-layer" />
        <div class="cover-body">
          <img class="logo" src="~/assets/image/logo.png" />
          <div class="text">
            首次安装请先保存此账号信息，可在不慎遗失账号时作为凭证极大提高找回账号的概率。若您遇到账号遗失问题，请直接联系在线客服反馈。
          </div>
          <div class="text">建议您尽快注册账号，以免账号丢失。使用账号登录更加安全！</div>
          <div class="info">
            <div class="text-box">用户ID：{{ user?.uid }}</div>
            <div v-if="user?.aff_code" class="text-box">邀请码：{{ user?.aff_code }}</div>
            <div class="text-small-box">
              官方网站：
              <br />
              {{ user?.share_url }}
            </div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { u: user } = storeToRefs(userStore)
const __ = useNuxtApp()
const invitCode = ref()
const dialogType = ref<'1' | '2'>('1')
const message = {
  '1': '兑换码',
  '2': '邀请码'
}
const { value: dialogShow, toTrue: _openDialog, toggle } = useBoolean()
const { value: coverShow, toTrue: showCoverDialog } = useBoolean()

const openDialog = (type: any) => {
  if (type === '2') {
    if (user.value.invite_by_code) {
      return __.$Toast(`已经填写过邀请码了～`)
    }
  }
  dialogType.value = type
  _openDialog()
}
const onSubmit = async () => {
  if (!invitCode.value) {
    toggle()
    return __.$Toast(`${message[dialogType.value]}不能为空`)
  }

  toggle()

  try {
    if (dialogType.value === '1') {
      await __.$Api.User.exchange({
        code: invitCode.value
      })
    } else {
      await __.$Api.User.invitation({
        aff: invitCode.value,
        _config: {
          showError: true
        }
      })
      userStore.info()
    }
  } catch (error) {
    console.log('error: ', error)
    // __.$Toast(`${message[dialogType.value as unknown as 1 | 2]}不能为空`)
  } finally {
    invitCode.value = ''
  }
}
// 解除绑定
const unBind = () => {
  __.$Alert({
    title: '温馨提示',
    message: '确认退出当前账号?',
    confirmButtonColor: 'linear-gradient(to right, #6de6fb, #428af7)',
    closeOnClickOverlay: true
  }).then(() => {
    userStore.logout()
  })
}
</script>
<style lang="less"></style>
<style lang="less" scoped>
.user-set-list {
  margin: 0.32rem;
  padding: 0 0.32rem;
  background: #fff;
  border-radius: 8px;
}
.logout-button {
  width: 6.5rem;
  margin: 2rem auto 0px;
  display: block;
}
.my-icon {
  width: 0.373rem;
  height: 0.373rem;
  margin-right: 0.427rem;
  object-fit: contain;
}
:deep(.van-cell) {
  align-items: center;
  height: 1.387rem;
  font-size: 14px;
}
.submit-container {
  margin: 0.32rem auto;
}
.invite-code {
  width: 5.333rem;
  border: 1px solid #999;
  :deep(.van-field__control) {
    text-align: center;
  }
}
.submit-button {
  width: 7.2rem;
  margin: 0.32rem auto;
  display: block;
}
.dx-justify-center {
  padding: 0.64rem 0;
  text-align: center;
}
.cover-body {
  width: 7.5rem;
  height: 10.5rem;
  background: center/cover no-repeat url('~/assets/image/my/bg_set_alert.png');
  border-radius: 0.2rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
  overflow: hidden;

  .logo {
    width: 48px;
    height: 48px;
    margin: 86px auto 0;
    backface-visibility: hidden;
  }

  .text {
    margin-top: 0.25rem;
    padding: 0 1.125rem;
    font-size: 0.3rem;
    color: #666;
  }

  .info {
    flex: 1;
    padding-bottom: 0.375rem;
    text-align: center;
    font-size: 0.4rem;
    color: #ed695a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text-box {
      margin-top: 0.125rem;
    }

    .text-small-box {
      line-height: 0.5rem;
      margin-top: 0.125rem;
      font-size: 10px;
    }
  }
}
</style>
