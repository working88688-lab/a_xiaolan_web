<template>
  <div ref="webview" class="h-full w-full"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  url: string
}>()

const viewRef = useTemplateRef('webview')
const view = new Webview(props.url)

onMounted(() => {
  view.create(viewRef.value)
})

onBeforeUnmount(() => {
  view.destory()
})
</script>
