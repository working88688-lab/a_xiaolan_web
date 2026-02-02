<template>
  <div class="container">
    <dx-hoc-list api="api/tabnew/list_tags" class="dx-grid-3">
      <template #item="{ item }">
        <discover-nav-item :key="item.id" :item></discover-nav-item>
      </template>
    </dx-hoc-list>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
