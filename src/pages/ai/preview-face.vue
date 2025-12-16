<script setup lang="ts">
import type { SwipeInstance } from 'vant'

const swipe_ref = useTemplateRef<SwipeInstance>('swipe')
const route = useRoute()
const { cache } = useDynamicStore()

const items = computed(() => {
  const face_thumb = cache[CACHE_KEY.PREVIEW_AI_FACE]
  return route.query.type === '1'
    ? [
      {
        src: face_thumb.strip_thumb,
        w: face_thumb.strip_thumb_w,
        h: face_thumb.strip_thumb_h
      },

      {
        src: face_thumb.thumb,
        w: face_thumb.thumb_w,
        h: face_thumb.thumb_h
      }
    ]
    : [
      {
        src: face_thumb.face_thumb,
        w: face_thumb.face_thumb_w,
        h: face_thumb.face_thumb_h
      },

      {
        src: face_thumb.ground,
        w: face_thumb.ground_w,
        h: face_thumb.ground_h
      },
      {
        src: face_thumb.thumb,
        w: face_thumb.thumb_w,
        h: face_thumb.thumb_h
      }
    ]
})

function swipe_to(index: number) {
  swipe_ref.value?.swipeTo(index)
}
</script>

<template>
  <div class="container">
    <van-swipe ref="swipe" class="flex-1">
      <van-swipe-item v-for="item in items">
        <dx-pinch-zoom class="h-full w-full overflow-hidden py-4">
          <img v-lazyLoad="item.src" class="dx-media-auto" src="~/assets/image/img_loading.png" alt="" />
        </dx-pinch-zoom>
      </van-swipe-item>

      <template #indicator="{ active, total }">
        <div :class="[route.query.type === '1' ? 'dx-grid-2' : 'dx-grid-3']"
          class="custom-indicator-container mx-auto mt-3 w-[300px]">
          <div v-for="(item, index) in total" :key="index" class="flex-center"
            :class="{ 'is-active': active === item - 1 }">
            <div class="custom-indicator1 w-[56px] rounded-sm px-1 py-0.5 text-center text-sm"
              @click="swipe_to(item - 1)">
              {{ item === 1 ? '生成图' : item === 2 ? '原图' : '目标脸' }}
            </div>
          </div>
        </div>
      </template>
    </van-swipe>
    <div class="van-safe-area-bottom" />
  </div>
</template>

<style lang="postcss" scoped>
.custom-indicator-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateZ(0);
  bottom: 30px;
  z-index: 1;
}

.custom-indicator1 {
  background-color: var(--dx-base3-color);
}

.is-active {
  .custom-indicator1 {
    background: linear-gradient(-90deg, #bab9ff, #bae8ff);
  }
}
</style>
