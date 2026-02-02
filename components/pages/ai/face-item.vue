<script setup lang="ts">
import type { Ai } from '@types'

const props = defineProps<{
  item: Ai
}>()

const router = useRouter()
const dynamicStore = useDynamicStore()

function to() {
  dynamicStore.update_cache(CACHE_KEY.AI_FACE, props.item)
  const title = `模板-${props.item.title}`
  router.push(`/ai/replace?id=${props.item.id}&title=${title}`)
}
</script>

<template>
  <div @click="to">
    <dx-cover class="aspect-h-5 aspect-w-4" :poster="item.thumb">
      <dx-pay-type :coins="item.coins" class="absolute left-0.5 top-0.5">
        {{ item.coins }}
      </dx-pay-type>
      <div class="linear-bg absolute bottom-0 left-0 right-0 p-0.5 text-right text-white">
        {{ $Utils.formatNumber(item.like_count) }}点赞
      </div>
    </dx-cover>
    <div class="my-0.5 truncate">
      {{ item.title }}
    </div>
  </div>
</template>

<style scoped></style>
