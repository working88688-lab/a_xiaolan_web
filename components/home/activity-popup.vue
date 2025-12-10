<!-- 
    desc: 广告弹框
    date: 2024.03.27
-->
<template>
  <van-popup v-bind="$attrs" class="active-dialog" transition-appear transition="modal" teleport="body"
    :close-on-click-overlay="false">
    <div class="activity-dialog-content">
      <ad-link v-if="props.type === 1" class="ad-item" ad-name="首页弹框" :data="props.item">
        <dx-image class="h-full w-full" fit="fill" :src="props.item.img_url" />
      </ad-link>
      <div v-else>
        <div class="grid h-[331px] grid-cols-4 overflow-auto rounded rounded-b bg-white px-[12px] pt-2">
          <ad-link v-for="(ad, index) in item" :key="index" :index ad-key="16grid" ad-type="popup" ad-name="16宫格弹框"
            :data="{ ...ad, type: 1, url: ad.link_url, id: ad.id }" class="flex-col-center px-[12px]">
            <dx-image class="!h-4.5 !w-4.5 rounded" fit="fill" :src="ad.img_url" />
            <span class="mb-[8px] mt-[7px] whitespace-nowrap text-center text-mini text-black">{{ ad.title }}</span>
          </ad-link>
        </div>
      </div>
      <div class="notice-header">
        <img class="cursor-pointer" src="~/assets/image/home/activity_close.png" alt="icon" @click.stop="onClose" />
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    item: any
    type?: number
  }>(),
  {
    type: 1
  }
)

const emit = defineEmits<{
  close: []
}>()

function onClose() {
  emit('close')
}
</script>

<style lang="less" scoped>
.notice-header {
  width: 26px;
  height: 45px;
  margin: 0px auto 0;

  >img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.activity-dialog-content {
  position: relative;
}

.ad-item {
  height: 9.6rem;
  min-width: 80%;
  width: 100%;
  cursor: pointer;

  :deep(img) {
    aspect-ratio: 610 / 680;
  }
}
</style>
