<script setup lang="ts">
import type { VideoItem } from '@types'

const props = defineProps<{
  api: string
  params: any
  active: boolean
}>()

const loading = ref(false)
const { listData, execute } = useFetchList({
  ...props,
  immediate: true,
  success() {
    if (!loading.value) {
      loading.value = true
    }
  },
  fields: 'mv_list'
})
</script>

<template>
  <div class="h-full w-full">
    <div v-if="!loading" class="mt-[56px] h-full w-full text-normal">
      <dx-spin color="var(--dx-blue-color)" />
    </div>
    <tiktok-player v-bind="$attrs" :active="props.active" :items="listData" @load="execute" />
  </div>
</template>

<style scoped></style>
