<template>
  <check-line></check-line>
</template>

<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  if (!localStorage.getItem('check_fail')) {
    router.push('/splash')
  }
})
</script>
