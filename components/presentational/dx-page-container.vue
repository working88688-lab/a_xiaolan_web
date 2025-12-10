<script setup lang="ts">
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
  <div ref="containerRef" class="container">
    <slot :height="height" :scroll-top :disabled-refresh />
  </div>
</template>

<style lang="postcss">
.dx-container.container {
  display: block;
}
</style>
