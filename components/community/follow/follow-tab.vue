<template>
  <scroll-list ref="list">
    <div class="px-1.5">
      <dx-ads :items="props.data?.ads ?? []" ad-key="follow" ad-name="关注"></dx-ads>
    </div>

    <div class="community_tab_container">
      <feeds-list :disabled-refresh="scrollTop > 0" :tabs="tabs"></feeds-list>
    </div>
  </scroll-list>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any
}>()

const tabs = [
  {
    name: '话题',
    type: 'topic',
    api: 'api/community/follow_topic_post'
  },
  {
    name: '用户',
    type: 'user',
    api: 'api/community/follow_user_post'
  }
]
const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)
</script>

<style lang="postcss" scoped>
.community_tab_container {
  height: 540px;
}

:deep(.dx-tabs) {
  margin-top: 8px;
}
</style>
