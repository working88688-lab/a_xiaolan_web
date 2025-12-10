<template>
  <div class="container">
    <div class="scroll-list">
      <scroll-list>
        <div class="user-share-method-content">
          <img class="user-share-method-img" src="~/assets/image/my/bg_share_method_content.jpg" />
        </div>
      </scroll-list>
    </div>
    <div class="user-share-method-bottom cursor-pointer" @click="__.$Back">
      学会了，去推广
      <img src="~/assets/image/my/icon_arrow_right_red.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()
</script>

<style lang="less" scoped>
.user-share-method-bottom {
  width: 100%;
  height: 1.25rem;
  font-size: 0.3rem;
  color: #f4625b;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffdacf;
  border-radius: 0.25rem 0.25rem 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;

  img {
    width: 12px;
    height: auto;
    margin-left: 0.1rem;
  }
}
</style>
