<template>
  <check-line></check-line>
</template>

<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  router.push('/splash')
})
</script>

<style scoped></style>
