<template>
  <div class="user-share container">
    <dx-navbar
      class="custom-nav-bar"
      right-text="邀请记录"
      :border="false"
      title="邀请赚钱"
      left-arrow
      @click-left="__.$Back"
      @click-right="__.$NavigateTo('/invite-records')"
    ></dx-navbar>
    <div v-link="`/promotion`" class="user-share-fixed-btn">不会推广？点我</div>
    <div class="scroll-container">
      <scroll-list>
        <div class="user-share-head" />
        <div class="user-share-content">
          <div class="user-share-qrcode-box">
            <div class="title">
              我的推广码：
              <span>{{ user.aff_code }}</span>
            </div>
            <div class="user-share-qrcode">
              <vue-qrcode v-if="user.share_url" full :value="user.share_url" :options="{ scale: 20, margin: 0 }" />
            </div>
            <div class="user-share-btn-box">
              <div class="user-share-img-btn" @click="handleSaveImg"></div>
              <div class="user-share-link-btn" @click="onCopy"></div>
            </div>
          </div>
        </div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const __ = useNuxtApp()

const { u: user } = storeToRefs(useUserStore())

const handleSaveImg = () => {
  __.$Toast('请自行截图分享二维码')
}

const { copy } = useClipboard({ source: '', legacy: true })

const onCopy = () => {
  copy(user.value.share_text)
  __.$Toast('复制成功，快去分享吧')
}
</script>

<style lang="less" scoped>
.user-share {
  background-image: linear-gradient(to bottom, #ff3c56, #ff6500);
  background: linear-gradient(to bottom, #ff3c56, #ff6500);

  .user-share-fixed-btn {
    padding: 0.125rem 0.25rem;
    font-size: 0.35rem;
    color: #f4625b;
    background: #fff;
    border-radius: 1rem 0 0 1rem;
    position: absolute;
    top: 5rem;
    right: 0;
    z-index: 2;
  }

  .user-share-head {
    width: 9rem;
    height: 2.75rem;
    margin: 0 auto;
    background: bottom/contain no-repeat url('~/assets/image/my/share-bg.png');
  }

  .user-share-content {
    width: 100%;
    height: 13rem;
    background: bottom / cover no-repeat url('~/assets/image/my/bg_share_box.png');
    position: relative;
  }

  .user-share-qrcode-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    top: 2.5rem;
    z-index: 2;

    .title {
      margin: 0.3rem 0;
      font-size: 0.32rem;
      color: #333;

      span {
        font-size: 0.4rem;
        font-weight: 500;
        color: #f4625b;
      }
    }

    .user-share-qrcode {
      width: 2.75rem;
      height: 2.75rem;
      padding: 0.125rem;
      background: #fff;
    }

    .user-share-btn-box {
      margin-top: 1.625rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .user-share-img-btn {
        width: 4.5rem;
        height: 1.25rem;
        background: center/cover no-repeat url('~/assets/image/my/icon_share_img_btn.png');
      }

      .user-share-link-btn {
        width: 4.5rem;
        height: 1.25rem;
        background: center/cover no-repeat url('~/assets/image/my/icon_share_link_btn.png');
      }
    }
  }
}
</style>
