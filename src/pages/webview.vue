<script setup lang="ts">
const route = useRoute()

useNavbarTitle()

function getUrlParamFromHash() {
  const href = window.location.href
  const key = 'url='
  const idx = href.indexOf(key)
  const result = idx !== -1 ? href.slice(idx + key.length) : null
  return result
}

const url = computed(() => {
  return getUrlParamFromHash()
})
</script>

<template>
  <div class="container">
    <dx-webview :url="url"></dx-webview>
  </div>
</template>

<style scoped></style>
