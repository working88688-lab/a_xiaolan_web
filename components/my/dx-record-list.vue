<script setup lang="ts">
const props = defineProps<{
  tableName: Tables
}>()

const __ = useNuxtApp()

function fetchDataFromIndexDB() {
  return historyDb[props.tableName]
    .where({
      _userID: __.$Store.user.u.uid
    })
    .reverse()
    .sortBy('_watch_at')
}

const items = ref<any[]>([])
const { loading, runTask } = useAsync({
  asyncTask: async () => {
    const res = await fetchDataFromIndexDB()
    items.value = [...res]
  }
})

onMounted(() => {
  runTask()
})
</script>

<template>
  <scroll-list v-model:loading="loading" :pull-down-refresh="runTask" :is-end="true" :is-empty="items.length === 0">
    <slot name="list" :items />
  </scroll-list>
</template>

<style scoped></style>
