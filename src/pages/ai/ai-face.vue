<script setup lang="ts">
interface Tab {
  id: number
  name: string
}
const __ = useNuxtApp()
const router = useRouter()
const dynamicStore = useDynamicStore()
const { key } = useKeepAlive({})

function to() {
  dynamicStore.update_cache(CACHE_KEY.AI_FACE, {} as any)

  router.push(`/ai/replace?&title=定制模板`)
}
</script>

<template>
  <div :key="key" class="container">
    <dx-api-tabs v-if="key" ref="tab" :fetch-options="{ fields: 'list' }" line-width="0" line-height="0"
      api="api/ai/list_face_cate" label-key="name" default-key="">
      <template #tab="{ tab }">
        <face-tab-item :id="tab.id" />
      </template>
    </dx-api-tabs>

    <div class="custom-face-bubble" magnetic="x" icon="chat">
      <div class="flex-center w-full whitespace-nowrap text-sm" @click="to">
        <nuxt-icon name="upload" class="mr-0.5 text-2xl" />
        定制模版
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.custom-face-bubble {
  position: absolute;
  bottom: 24px;
  right: 12px;

  background-color: #2494ff;
  color: #fff;
  padding: 6px 10px;
  border-radius: 50px;
}
</style>
