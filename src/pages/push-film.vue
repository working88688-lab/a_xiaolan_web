<template>
  <div :key="key" class="tuipian_page container">
    <div class="head_content">
      <p class="title">可在作品库或从平台上传,最多添加10个</p>
      <div class="btn_list">
        <div class="work_btn" @click="openPopup('my')"></div>
        <div class="pt_btn" @click="openPopup('all')"></div>
      </div>
      <div class="add_num">
        <span>已添加</span>
        {{ videoList.length }}个
      </div>
    </div>
    <div class="scroll-container pb-1">
      <scroll-list>
        <select-video
          v-for="(item, index) in videoList"
          :key="index"
          :index="index"
          :data="item"
          type="delete"
          @delete="onDelete"
        ></select-video>
      </scroll-list>
    </div>
    <div class="sure_btn" @click="onSubmit">确定</div>
    <!-- <choice-file-popup v-model:show="showPopup" :type="type" @select="onSelect"></choice-file-popup> -->
  </div>
</template>

<script setup lang="ts">
import type { VideoItem } from '@types'

const __ = useNuxtApp()
const route = useRoute()

const videoList = ref<VideoItem[]>([])
const router = useRouter()
const dynamicStore = useDynamicStore()
const openPopup = (_type: 'all' | 'my') => {
  router.push(`/post/choice?_type=${_type}`)
}
const selectIds = computed(() => {
  return videoList.value.map(item => item.id)
})

const onDelete = (id: number) => {
  videoList.value = videoList.value.filter(item => item.id !== id)
}

const onSubmit = async () => {
  if (selectIds.value.length === 0) {
    return __.$Toast('请在作品库或平台添加作品')
  }
  await __.$Api.Community.replyMv({
    find_id: route.query.id,
    vid: selectIds.value.join(',')
  })
  videoList.value = []
  __.$Back()
}

const { key } = useKeepAlive({
  reset() {
    videoList.value = []
  },
  effect() {
    dynamicStore.pushVideo.forEach(_item => {
      if (!selectIds.value.includes(_item.id)) {
        videoList.value.push(_item)
      }
    })

    dynamicStore.setPushVideo([])
  }
})
</script>

<style lang="postcss" scoped>
.tuipian_page {
  .right_serch {
    padding-right: 0.32rem;
    font-size: 0.32rem;
  }

  .head_content {
    padding: 0.32rem;

    .add_num {
      margin-top: 0.32rem;
      font-size: 0.347rem;
      color: #999999;

      span {
        font-size: 0.427rem;
        font-weight: bold;
        color: #000;
      }
    }

    .title {
      font-size: 0.427rem;
      color: #000;
      font-weight: bold;
      margin-bottom: 0.32rem;
    }

    .btn_list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      div {
        width: 4.533rem;
        height: 1.0667rem;
      }
      .work_btn {
        background: url('~/assets/image/film/icon_add_work.png') no-repeat;
        background-size: 100% 100%;
      }

      .pt_btn {
        background: url('~/assets/image/film/icon_add_50.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .sure_btn {
    width: 100%;
    height: 1.2rem;
    color: #ffffff;
    font-size: 0.427rem;
    background: linear-gradient(to right, #ff051c, #ff036d);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>
