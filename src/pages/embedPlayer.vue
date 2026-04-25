<script setup lang="ts">
useNavbarTitle()

const isActive = ref(false)

onMounted(() => {
  isActive.value = true
})

onActivated(() => {
  isActive.value = true
})

onDeactivated(() => {
  isActive.value = false
})
</script>

<template>
  <div class="embed-player-page">
    <xg-player
      :active="isActive"
      autoplay
      :src="$route.query.url as string"
      :poster="$route.query.poster as string"
    />
  </div>
</template>

<style scoped>
.embed-player-page {
  width: 100%;
  height: 100vh;
  background: #000;
}
</style>
