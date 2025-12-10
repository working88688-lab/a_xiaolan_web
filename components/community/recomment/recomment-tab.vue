<template>
  <scroll-list ref="list" :loading="props.loading" :is-ready="!props.loading">
    <div class="px-1.5">
      <dx-ads :items="props.data?.ads ?? []" ad-key="recommend" ad-name="推荐"></dx-ads>
    </div>
    <topics-list :items="props.topics"></topics-list>

    <ranking-list page="creative" use-index :data="props?.data?.rank_list"></ranking-list>

    <div class="community_tab_container">
      <dx-tabs v-model:active="activeTab" shrink class="dx-tabs h-full" theme="button">
        <van-tab v-for="tab in post_tab" :key="tab.name" v-bind="tab">
          <dx-hoc-list :list-props="{ disabledRefresh: scrollTop > 0 }" fields="post" api="api/community/listPost"
            :params="{ sort: tab.name }">
            <template #item="{ item }">
              <post-item :key="item.id" show-original :item="item"></post-item>
            </template>
          </dx-hoc-list>
        </van-tab>
      </dx-tabs>
    </div>
  </scroll-list>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any
  loading: boolean
  topics?: any[]
}>()

const { post_tab } = storeToRefs(useGlobalStore())

const activeTab = ref(0)

const listRef = useTemplateRef('list')
const { scrollTop } = useScrollTop(listRef)
</script>

<style lang="postcss" scoped>
.community_tab_container {
  height: 540px;
}
</style>
