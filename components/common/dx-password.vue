<template>
  <van-field
    v-bind="$attrs"
    ref="inputRef"
    class="login-input-box"
    name="password"
    :border="false"
    :type="showPassword ? 'text' : 'password'"
    placeholder="请输入密码"
  >
    <template #right-icon>
      <div class="cursor-pointer" @click.stop="changeType">
        <img v-if="showPassword" class="my-icon" src="~/assets/image/icon_pwd_show.png" role="icon" />
        <img v-else class="my-icon" src="~/assets/image/icon_pwd_hide.png" role="icon" />
      </div>
    </template>
  </van-field>
</template>

<script setup lang="ts">
const inputRef = ref()
const showPassword = ref(false)
const changeType = () => {
  showPassword.value = !showPassword.value
}
</script>

<style lang="less" scoped>
.my-icon {
  width: 20px;
  height: 14px;
}
</style>
