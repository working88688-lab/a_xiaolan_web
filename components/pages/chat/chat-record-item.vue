<script setup lang="tsx">
const props = defineProps<{
  item: any
  createAt?: string
  replyAt?: string
}>()
const __ = useNuxtApp()

const { u: user } = storeToRefs(useUserStore())
</script>

<template>
  <div class="customer-service-item">
    <template v-if="item.content || item.thumb_full">
      <div class="title">{{ props?.createAt }}</div>
      <div class="mine-box">
        <div class="customer-service-avatar" />
        <div class="content">
          <div class="inner-box">
            <template v-if="item.content">
              {{ item.content }}
            </template>

            <div v-else class="img-box">
              <img v-lazyLoad="item?.thumb_full" data-image-preview="true" object-fit="contain" />
            </div>
          </div>
        </div>
        <div class="customer-service-avatar">
          <img v-lazyLoad="user?.avatar_url" class="rounded-full" object-fit="contain" />
        </div>
      </div>
    </template>
    <template v-if="item.reply_content">
      <div class="title">{{ props?.replyAt }}</div>
      <div class="system-box">
        <div class="customer-service-avatar">
          <img
            v-if="item?.from_avater_full"
            v-lazyLoad="item.from_avater_full"
            class="rounded-full"
            object-fit="contain"
          />
          <img v-else src="~/assets/image/logo.png" />
        </div>
        <div class="content">
          <div class="inner-box">{{ item?.reply_content }}</div>
        </div>
        <div class="customer-service-avatar" />
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.customer-service-item {
  .title {
    font-size: 0.32;
    color: var(--dx-base3-color);
    text-align: center;
  }

  .mine-box,
  .system-box {
    padding: 0.2rem 0;
    display: flex;
    align-items: flex-start;

    .content {
      flex: 1;
      display: flex;

      .inner-box {
        padding: 0.25rem;
        font-size: 0.375rem;
        background: #fff;
        border-radius: 0.2rem;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          right: auto;
          left: -0.4rem;
          top: 0.2rem;
          border-left: 0.2rem solid transparent;
          border-right: 0.2rem solid #fff;
          border-top: 0.2rem solid transparent;
          border-bottom: 0.2rem solid transparent;
        }
      }
    }
  }

  .mine-box {
    .content {
      justify-content: flex-end;

      .inner-box {
        background: #e5f0ff;

        &::after {
          content: '';
          position: absolute;
          right: -0.4rem;
          left: auto;
          top: 0.2rem;
          border-left: 0.2rem solid #e5f0ff;
          border-right: 0.2rem solid transparent;
          border-top: 0.2rem solid transparent;
          border-bottom: 0.2rem solid transparent;
        }
      }
    }
  }
}
.customer-service-avatar {
  width: 1rem;
  height: 1rem;
  overflow: hidden;
  margin: 0 0.3rem;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
