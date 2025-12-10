<template>
  <div class="dx-cover relative overflow-hidden">
    <div>
      <dx-image class="dx-cover-poster rounded-sm" :src="props.poster"></dx-image>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  poster?: string
}>()
</script>

<style scoped></style>
