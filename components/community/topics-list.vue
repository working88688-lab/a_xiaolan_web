<template>
  <div class="relative z-10 bg-white pb-[12px]">
    <div class="flex items-center justify-between px-1">
      <span class="my-1 text-2xl font-medium text-[#333]">{{ title }}</span>

      <nuxt-link :to="toMore" class="flex items-center text-base2">
        更多
        <van-icon name="arrow"></van-icon>
      </nuxt-link>
    </div>
    <scroll-x-view v-if="props.items?.length">
      <div class="relative flex items-center">
        <div v-for="(item, index) in props.items" :key="index" v-link="`/${to}?id=${item.id}`" class="topic-item">
          <dx-image :src="item.bg_thumb_full" />
          <div class="p-txt flex-col-center px-1 text-center text-sm font-normal text-white">
            <p class="w-full truncate">{{ item.name }}</p>
            <p class="w-full truncate">{{ item.post_num }}个帖子</p>
          </div>
        </div>
      </div>
    </scroll-x-view>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    items?: any[]
    to?: string
    toMore?: string
  }>(),
  {
    title: '热门论坛',
    items: () => [],
    to: 'forum-detail',
    toMore: '/community/forum'
  }
)
</script>

<style lang="postcss" scoped>
.topic-item {
  width: 135px;
  height: 68px;
  margin-left: 12px;
  border-radius: 6px;
  object-fit: contain;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;

  &:last-child {
    margin-right: 0.26rem;
  }
  .p-txt {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
