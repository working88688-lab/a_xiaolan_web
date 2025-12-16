<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
}>()

const containerRef = ref<HTMLElement>()
const height = ref()

onMounted(() => {
  nextTick(() => {
    const rect = containerRef.value?.getBoundingClientRect()
    height.value = rect?.height
  })
})
usePosition(containerRef)

const { scrollTop } = useScrollTop(containerRef)

const disabledRefresh = computed(() => {
  return scrollTop.value > 0
})
</script>

<template>
  <div ref="containerRef" class="dx-container container">
    <dx-spin v-if="props.loading" />
    <slot :height="height" :scroll-top :disabled-refresh="disabledRefresh" />
  </div>
</template>
