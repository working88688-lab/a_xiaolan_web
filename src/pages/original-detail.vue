<script setup lang="ts">
const { key } = useKeepAlive({
  active() {}
})
</script>

<template>
  <original-player v-if="key" :key="key" />
</template>

<style scoped></style>
