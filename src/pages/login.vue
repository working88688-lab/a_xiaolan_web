<template>
  <div class="positioned-container login container">
    <div class="login-container">
      <button type="button" class="login-back" aria-label="返回首页" @click="onLoginBack" />
      <div class="login-head">
        <div class="login-head-avatar">
          <img src="~/assets/image/logo.png" />
        </div>
        <div class="login-head-title">欢迎来到小蓝视频</div>
      </div>
      <div class="login-swiper-box">
        <van-form>
          <van-field
            v-model="formState.username"
            class="login-input-box"
            :border="false"
            name="username"
            clearable
            placeholder="请输入账号或手机号"
          />

          <dx-password v-model="formState.password"></dx-password>

          <div class="login-active-box">
            <dx-button :disabled="loginLoading || regLoadinng" class="flex-1" @click="onSubmit(0)">注册</dx-button>
            <dx-button :disabled="loginLoading || regLoadinng" class="flex-1" @click="onSubmit(1)">登录</dx-button>
          </div>
        </van-form>
        <div class="prompt-box">
          <div class="title">提示</div>
          <div class="item">1.请务必记住自己的账号密码</div>
          <div class="item">2.不提供密码修改功能</div>
          <div class="item">3.不提供密码找回功能</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 当前实例

const __ = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()
const formState = reactive({
  username: '',
  password: ''
})

const { execute: login, loading: loginLoading } = useMyFetch({
  api: userStore.login
})

const { execute: register, loading: regLoadinng } = useMyFetch({
  api: userStore.register
})

function onLoginBack() {
  __.$Replace('/home')
}

// 提交 {type: 类型{0/null: 登录, 1: 注册}}
const onSubmit = async type => {
  const reg = /^\s*$/g
  if (reg.test(formState?.username)) {
    return __.$Toast('账号或手机号不能为空')
  }
  if (reg.test(formState?.password)) {
    return __.$Toast('密码不能为空')
  }
  try {
    let res

    switch (type) {
      case 1:
        res = await login({
          data: formState
        })
        break
      default:
        res = await register({
          data: formState
        })
        break
    }
    // __.$Toast('登录成功')
    const redirect = route.query.redirect as string
    const isSafeRedirect = redirect?.startsWith('/') && !redirect.startsWith('//')
    __.$Replace(isSafeRedirect ? redirect : '/home')
  } catch (error) {
    console.log('error: ', error)
    // console.log('error: ', error)
    // __.$Toast(error || error.msg || '请求失败')
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column;
}

.login-input-box {
  margin-bottom: 18px;
  background: #f4f5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  :deep(input::placeholder) {
    color: #777;
  }
}

// 登录/注册/绑定
.login {
  background: top/contain no-repeat url('~/assets/image/login/bg_login_top.png');
  background-color: #fff;
  padding-top: 36px;
  overflow: auto;
}

.login-back {
  width: 1.5rem;
  height: 1.5rem;
  box-sizing: border-box;
  border: 0;
  padding: 0;
  background: transparent center/0.5rem no-repeat url('~/assets/image/icon_arrow_left_blak.png');
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.login-head {
  .login-head-avatar {
    width: 2rem;
    height: 2rem;
    margin: 2rem auto 1.3rem;
    border: 0.02rem solid #fff;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .login-head-title {
    text-align: center;
    font-size: 0.48rem;
    font-weight: 500;
    color: #000;
  }
}

.login-title {
  margin-bottom: 0.35rem;
  font-size: 0.35rem;
  color: var(--dx-base1-color);
}

.login-swiper-box {
  height: 8rem;
  padding: 0.75rem 1rem 0 1rem;
  overflow: hidden;
}

.login-active-box {
  display: flex;
  justify-content: space-between;
  gap: 16px;

  .submit-btn {
    width: 3.75rem;
    height: 1.2rem;
    font-size: 0.4rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #fff;
    background: linear-gradient(to left, #6de6fb, #428af7);
    border-radius: 0.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.prompt-box {
  padding-top: 0.375rem;
  line-height: 0.55rem;
  font-size: 0.3rem;
  color: var(--dx-base2-color);

  .title {
    font-size: 0.3rem;
    font-weight: bold;
  }

  .item {
    font-size: 0.3rem;
  }
}
</style>
