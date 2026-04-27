<template>
  <scroll-list ref="list" :loading="props.loading" :is-ready="!props.loading">
    <div class="px-1.5">
      <dx-ads :items="props.data?.ads ?? []" ad-key="recommend" ad-name="推荐"></dx-ads>
    </div>
    <topics-list :items="props.topics"></topics-list>

    <ranking-list page="creative" use-index :data="props?.data?.rank_list"></ranking-list>

    <div class="community_tab_container community_tab_container--flat">
      <dx-tabs v-model:active="activeTab" shrink class="dx-tabs h-full" theme="button">
        <van-tab v-for="tab in post_tab" :key="tab.name" v-bind="tab">
          <dx-hoc-list
            :refresh="false"
            :list-props="{ disabledRefresh: scrollTop > 0 }"
            fields="post"
            api="api/community/listPost"
            :params="{ sort: tab.name }"
          >
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
/*
 * 原创：不与外层列表抢滚动容器。去掉固定高度 + 放开内层 overflow，
 * 二级 tab / 帖子随页面一起上移，不再「卡在分区顶部」嵌套滚动。
 */
.community_tab_container--flat {
  height: auto !important;
  flex-shrink: 0;
}

.community_tab_container--flat :deep(.dx-tabs) {
  height: auto !important;
}

.community_tab_container--flat :deep(.van-tabs__content) {
  overflow: visible !important;
}

.community_tab_container--flat :deep(.van-tab__panel) {
  height: auto !important;
}

.community_tab_container--flat :deep(.van-tab__panel-wrapper) {
  overflow: visible !important;
}

.community_tab_container--flat :deep(.scroll-list.scroller),
.community_tab_container--flat :deep(.scroller) {
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}

.community_tab_container--flat :deep(.van-pull-refresh__track),
.community_tab_container--flat :deep(.van-pull-refresh) {
  overflow: visible !important;
}
</style>
