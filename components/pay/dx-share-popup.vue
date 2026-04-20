<script setup lang="ts">
import DOMPurify from 'dompurify'
import type { ResourceType } from '@types'

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    showCancel?: boolean
    cancelText?: string
    confirmText?: string
    type?: ResourceType
  }>(),
  {
    title: '温馨提示',
    cancelText: '取消',
    message: '充值VIP，享受海量福利视频免费看！',
    confirmText: '充值VIP',
    showCancel: true
  }
)

const emit = defineEmits<{
  'update:show': [e: boolean]
}>()

const globalStore = useGlobalStore()

const resource_vip_tip = computed(() => {
  if (props.type) {
    const key = `${props.type}_pop_vip_tips` as const

    return globalStore.config.pop_conf?.[key] ?? props.message
  }
  return props.message
})

function onClose() {
  emit('update:show', false)
}

onDeactivated(onClose)
</script>

<template>
  <van-popup
    close-on-click-overlay
    :lock-scroll="false"
    teleport="body"
    class="no-bg"
    close-on-popstate
    round
    v-bind="$attrs"
    closeable
    transition="van-dialog-bounce"
    :style="{ width: '80%' }"
    @click-overlay="onClose"
    @click-close-icon="onClose"
  >
    <div class="flex flex-col bg-white px-2 py-2 text-normal leading-3">
      <h2 class="mb-1 text-center text-xl font-medium">
        {{ props.title }}
      </h2>
      <div
        v-if="resource_vip_tip"
        class="share-content whitespace-pre-line px-1 pt-2.5 text-center text-base"
        v-html="DOMPurify.sanitize(resource_vip_tip ?? '')"
      />
      <div v-else class="share-content whitespace-pre-line px-1 pt-2.5 text-center text-base">
        {{ props.message }}
      </div>
      <div class="mb-2 mt-4 flex gap-2 text-default">
        <dx-button v-if="showCancel" class="flex-1" @click="onClose">
          {{ props.cancelText }}
        </dx-button>
        <dx-button class="flex-1" linear block to="/renewal" @click="onClose">
          {{ props.confirmText }}
        </dx-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="postcss" scoped></style>
