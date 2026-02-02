<script setup lang="ts">
const __ = useNuxtApp()

const faceTab = ref(0)
const closingTab = ref(0)
const route = useRoute()
const router = useRouter()
const dynamicStore = useDynamicStore()
const TABS = [
  {
    title: '排队中',
    poster: 'ground',
    params: {
      status: 1
    }
  },
  {
    title: '生成成功',
    poster: 'face_thumb',
    params: {
      status: 2
    }
  },
  {
    title: '生成失败',
    poster: 'ground',
    params: {
      status: 3
    }
  }
]

const CLOSING_TABS = [
  {
    title: '排队中',
    poster: 'thumb',
    params: {
      status: 1
    }
  },
  {
    title: '生成成功',
    poster: 'strip_thumb',
    params: {
      status: 2
    }
  },
  {
    title: '生成失败',
    poster: 'thumb',
    params: {
      status: 3
    }
  }
]

function on_download(url: string) {
  onWinOpen(__.$GlobalObject._CACHE_IMAGES_MAPS?.[url]?.url)
}

function preview_image(item: any, status: number, type?: number) {
  dynamicStore.update_cache(CACHE_KEY.PREVIEW_AI_FACE, item)
  if (status === 2) {
    router.push(`/ai/preview-face?type=${type}`)
  }
}

const { key, activeTab } = useKeepAlive({
  reset() {
    closingTab.value = 0
    faceTab.value = 0
    activeTab.value = 0
  },

  active() {
    activeTab.value = Number(route.query._index)
  }
})
</script>

<template>
  <div :key="key" class="container">
    <dx-tabs v-model:active="faceTab">
      <van-tab v-for="tab in TABS" :key="tab.title" :title="tab.title">
        <dx-hoc-list class="dx-grid-2" api="api/ai/my_face" :params="tab.params">
          <template #item="{ item }">
            <div>
              <dx-cover class="aspect-h-5 aspect-w-4 overflow-hidden rounded-sm" :poster="item[tab.poster]"
                @click="preview_image(item, tab.params.status, 2)">
                <div v-if="tab.params.status === 2" class="flex-center absolute bottom-0.5 left-0 right-0">
                  <dx-button class="w-[60px]" size="mini" @click.stop="on_download(item.face_thumb)">保存</dx-button>
                </div>

                <div v-if="tab.params.status === 1" class="absolute left-0 top-0 h-full w-full backdrop-blur" />
              </dx-cover>
              <div class="my-0.5 truncate text-sm">时间：{{ item.created_at }}</div>
            </div>
          </template>
        </dx-hoc-list>
      </van-tab>
    </dx-tabs>
  </div>
</template>

<style scoped></style>
