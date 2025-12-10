<template>
  <div class="container">
    <div class="success-layout">
      <img src="~/assets/image/success_icon.png" />
      <p>发布成功</p>
      <span v-if="type === '1' || type === '2'">帖子发布后将在24小时内进行审核</span>
      <span v-if="type === '1'">您可在【我的】-【我的帖子】中进行查看</span>
      <span v-else-if="type === '2'" class="!text-base">您可在【我的】-【作品管理】-【约炮】中进行查看</span>
      <span v-else>您可在 【我的】-【我的求片】中进行查看</span>
      <div class="success-layout_btn-list">
        <button class="back-btn" @click="__.$Back">返回</button>
        <button class="check-btn" @click="navigateToMypost">
          查看我的{{ type === '1' ? '帖子' : type === '2' ? '约炮' : '求片' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const page_map = {
  '0': '/my/afilm',
  '1': '/mypost',
  '2': '/my/work?_index=1'
}

const route = useRoute()
const type = computed(() => {
  return route.query.type ?? '0'
})
const navigateToMypost = () => {
  // @ts-ignore
  __.$Replace(type.value === '1' || type.value === '2' ? page_map[type.value] : page_map['0'])
}
</script>

<style lang="postcss" scoped>
.success-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 90px;
    height: 90px;
  }

  p {
    font-size: 20px;
    font-weight: 500;
    color: #323232;
    margin: 18px 0;
  }

  span {
    font-size: 16px;
    color: #323232;
    margin: 2px 0;
  }

  &_btn-list {
    margin-top: 88px;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-btn {
      width: 160px;
      height: 50px;
      border-radius: 25px;
      border: solid 1px #548aef;
      text-align: center;
      line-height: 50px;
      background-color: transparent;
      color: #548aef;
      font-size: 18px;
    }

    .check-btn {
      width: 160px;
      height: 50px;
      border-radius: 25px;
      background-image: linear-gradient(to top, #548aef, #8de4f8);
      text-align: center;
      line-height: 50px;
      border: none;
      margin-left: 20px;
      font-size: 18px;
      color: #fff;
    }
  }
}
</style>
