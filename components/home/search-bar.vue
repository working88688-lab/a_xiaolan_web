<template>
  <div class="searchHeader">
    <img class="searchHeader-everyday" src="~/assets/image/logo.png" />

    <div class="searchHeader-input" @click="$router.push('/search')">
      <img src="~/assets/image/search.png" />
      <span>可搜索用户/视频/喜好</span>
    </div>
    <dx-link v-if="props.showPublishButton" to="/publish/video" class="mr-1 flex flex-shrink-0 items-center text-sm">
      <img class="mr-0.5 !w-2.5" src="~/assets/image/home/ic_camera.png" alt="" />
      发布
    </dx-link>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showPublishButton?: boolean
}>()
</script>

<style lang="less" scoped>
.searchHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
  z-index: 1;
}

.searchHeader .searchHeader-everyday {
  width: 36px;
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
  background-color: #f6f7f8;
  border-radius: 30px;
  height: 36px;
  padding: 0 15px;
  margin-right: 10px;
}
.searchHeader-input img {
  width: 0.4rem;
  height: 0.4rem;
}
.searchHeader-input span {
  color: #b3b3b3;
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
