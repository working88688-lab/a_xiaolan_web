<template>
  <div class="container">
    <div class="scroll-container">
      <scroll-list v-model:loading="loading">
        <div class="publishRule whitespace-pre-line" v-html="data.rule_text"></div>
      </scroll-list>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, loading } = useMyFetch<any>({
  api: '/api/mv/preUpload',
  immediate: true
})
</script>

<style lang="less">
.publishRule {
  display: flex;
  flex-direction: column;
  padding: 0 0.3rem;
}
.publishRule-title1 {
  color: var(--dx-base1-color);
  font-size: 0.6rem;
  font-weight: bold;
  margin-bottom: 0.4rem;
  text-align: center;
}
.publishRule-title2 {
  color: #323232;
  font-size: 0.45rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}
.publishRule-content {
  color: #323232;
  font-size: 0.4rem;
  margin-bottom: 0.4rem;
  margin-left: 0.4rem;
}
</style>
