<template>
  <div v-if="text" class="dx-notice-bar relative">
    <van-notice-bar scrollable :text="text" :color="color">
      <template #left-icon>
        <div class="gradient mr-0.5 h-[14px] w-[18px]">
          <img src="@/assets/image-icon/notice.png" alt="" />
        </div>
      </template>
    </van-notice-bar>
    <!-- <div class="linear-bg"></div> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
  background?: string
  color?: string
}>()
</script>

<style lang="postcss" scoped>
.dx-notice-bar {
  --van-notice-bar-background: transparent;
  --van-notice-bar-font-size: 14px;
}
.linear-bg {
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 30px;
  /* background: linear-gradient(to right, var(--dx-base6-color) 10%, rgba(0, 0, 0, 0) 100%); */
}

/* :deep(.van-notice-bar__wrap) {
  background-color: v-bind(background);
} */
</style>
