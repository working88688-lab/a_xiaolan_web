<!-- 
    desc: 首页官方消息
    date: 2024.03.27
-->
<template>
  <van-dialog v-bind="$attrs" class="offical-dialog" :close-on-popstate="true" title="官方消息" :lock-scroll="false"
    teleport="body" close-on-click-overlay>
    <div class="scroller">
      <scroll-list>
        <!-- eslint-disable-next-line -->
        <div v-html="offcialContent"></div>
      </scroll-list>
    </div>

    <template #footer>
      <van-row class="dialog-footer" justify="center">
        <van-col class="dx dx-justify-center" span="12">
          <van-button color="linear-gradient(to left, #6de6fb, #428af7)" class="btn-item" round type="primary"
            @click="onClose">
            应用中心
          </van-button>
        </van-col>
        <van-col class="dx dx-justify-center" span="12">
          <van-button color="linear-gradient(to left, #6de6fb, #428af7)" class="btn-item" round type="primary"
            @click="onConfrim">
            朕知道了
          </van-button>
        </van-col>
      </van-row>
    </template>
  </van-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  content?: string
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const onClose = () => {
  emit('close')
}

const onConfrim = () => {
  emit('confirm')
}

const offcialContent = computed(() => {
  return props.content
    ?.replaceAll('\n', '<br />')
    .replaceAll('【', '<div class="dialog-item-title" >【')
    .replaceAll('】', '】</div>')
    .replaceAll(/(https?:\/\/[^\s\r\n]+)/gi, $1 => {
      return `<a href="${$1}" class="dialog-item-link" target="__blank">${$1}</a>`
    })
    .replaceAll(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, $1 => {
      return `<strong class="dialog-item-strong" ">${$1}</strong>`
    })
    .replaceAll(/@(\w+)/g, ($1, $2) => {
      return `<a href="https://t.me/${$2}" class="dialog-item-link" target="__blank">${$1}</a>`
    })
})
</script>

<style lang="less" scoped>
:deep(.dialog-item-title) {
  color: var(--van-button-warning-background);
  margin: 4px 0;

  &+br {
    display: none;
  }
}

// :deep(.dialog-item-strong) {
//   color: var(--van-primary-color);
// }
:deep(.dialog-item-link) {
  color: var(--van-primary-color);
}

.scroller {
  height: 220px;
  padding: 12px;
  overflow: hidden;
  z-index: 99;
}

.btn-item {
  width: 130px;
}

.dialog-footer {
  padding: 12px;
}
</style>
<style lang="less">
.offical-dialog {
  .van-dialog__header {
    font-size: 20px;
    padding: 18px 0 8px;
  }
}
</style>
