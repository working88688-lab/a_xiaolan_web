<template>
  <div class="container">
    <scroll-list>
      <div class="user-edit-head">
        <dx-avatar :img="user?.avatar_url" :size="2.25" />
      </div>
      <div class="user-edit-line"></div>
      <div class="user-edit-item">
        <div class="title-box">昵称</div>
        <div class="input-box">
          <van-field
            v-model="localState.nickname"
            :formatter="formatter"
            maxlength="10"
            type="text"
            placeholder="请输入昵称"
          />
        </div>
      </div>
      <div class="user-edit-item vertical">
        <div class="title-box">简介</div>
        <div class="input-box">
          <van-field
            v-model="localState.person_signnatrue"
            rows="3"
            :formatter="formatter"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入简介"
            show-word-limit
          />
        </div>
      </div>
      <dx-button class="user-public-btn" @click="handleSubmit">保存</dx-button>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { u: user } = storeToRefs(userStore)
const __ = useNuxtApp()
const formatter = (value: string) => value.replace(/^\s+|\s+$/g, '')

const localState = reactive({
  nickname: userStore.u.nickname,
  person_signnatrue: userStore.u.person_signnatrue
})

const { validate } = useValidator({
  nickname: {
    type: 'string',
    required: true,
    message: '昵称不能为空'
  },
  person_signnatrue: {
    type: 'string',
    required: true,
    message: '简介不能为空'
  }
})

const handleSubmit = async () => {
  await validate(localState)
  await userStore.update({
    data: localState
  })
  __.$Toast('更新成功')
}
</script>

<style lang="less" scoped>
:deep(.van-cell) {
  padding: 0;
  background: transparent;
}
// 编辑资料
.user-edit-head {
  padding: 0.25rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-edit-line {
  height: 0.325rem;
  background: #f4f5f6;
}

.user-edit-item {
  padding: 0.4rem;
  display: flex;
  align-items: center;

  &.vertical {
    padding-top: 0;
    flex-direction: column;
    align-items: flex-start;

    .input-box {
      margin-top: 0.25rem;
      width: 100%;

      textarea {
        height: 3rem;
      }
    }
  }

  .title-box {
    padding-right: 0.4rem;
    font-size: 0.4rem;
    white-space: nowrap;
    color: #000;
  }

  .input-box {
    padding: 0.3rem;
    background: #f4f5f6;
    border: 1px solid rgb(118, 118, 118);
    border-radius: 0.2rem;

    input,
    textarea {
      font-size: 0.35rem;
      color: #000;
      caret-color: #000;
      background: none;
      border: none;

      &::placeholder {
        color: rgb(117, 117, 117);
      }
    }

    textarea {
      width: 100%;
    }
  }
}
.user-public-btn {
  width: 340px;
  display: block;
  margin: 12px auto;
}
</style>
