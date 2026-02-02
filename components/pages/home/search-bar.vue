<template>
  <div class="searchHeader">
    <img class="searchHeader-everyday" src="~/assets/image/logo.png" />

    <div class="searchHeader-input" @click="$router.push('/search')">
      <!-- <img src="~/assets/image/search.png" /> -->
      <div class="mr-1">
        <nuxt-icon name="search" filled class="icon-search !text-[20px] !text-black"></nuxt-icon>
      </div>
      <span>{{ config.search_hot_keywords }}</span>
    </div>
    <dx-link v-if="props.showPublishButton" to="/publish/video" class="flex-col-center mr-1 flex-shrink-0 text-tiny">
      <img class="!w-[24px]" src="~/assets/image/home/ic_camera.png" alt="" />
      发布
    </dx-link>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showPublishButton?: boolean
}>()

const { config } = storeToRefs(useGlobalStore())
</script>

<style lang="postcss" scoped>
.searchHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  z-index: 1;

  .icon-search :deep(svg) {
    fill: none !important;
  }
}

.searchHeader .searchHeader-everyday {
  width: 32px;
  height: auto;
  margin: 0 12px;
}

.searchHeader .searchHeader-publish {
  width: 0.6rem;
  height: auto;
  margin: 0 12px;
}

.searchHeader-input {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(90deg, rgba(235, 244, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 100%);

  border-radius: 30px;
  height: 36px;
  padding: 0 15px;
  margin-right: 10px;
  border: 1px solid #fff;
}

.searchHeader-input img {
  width: 0.4rem;
  height: 0.4rem;
}

.searchHeader-input span {
  color: #666;
  font-size: 0.35rem;
  display: flex;
  flex: 1;
}

.searchHeader-input input {
  color: #777;
  font-size: 0.35rem;
  display: flex;
  flex: 1;
  border: none;
  background-color: transparent;
}

.searchHeader-input input::placeholder {
  color: #777;
}
</style>
