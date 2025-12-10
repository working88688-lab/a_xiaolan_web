<script setup lang="ts">
const tabRef = useTemplateRef('tab')

function onClickCell(index: number) {
  tabRef.value?.scrollTo(index + 1)
}
</script>

<template>
  <div class="container">
    <dx-api-tabs ref="tab" api="api/live/nav" label-key="name" default-key="current">
      <template #tab="{ tab }">
        <dx-hoc-list v-if="tab.type === 1" class="dx-grid-2" fields="lives" api="api/live/index"
          :params="{ id: tab.id }" :start-refresh-empty-data="false">
          <template #banner="{ data }">
            <dx-ads v-if="data?.banners?.length" class="mb-1 px-1" :ad-key="tab.id" :ad-name="tab.name"
              :items="data?.banners ?? []" />
          </template>
          <template #item="{ item }">
            <live-item :key="item.id" :item />
          </template>
        </dx-hoc-list>
        <dx-hoc-list v-else api="api/live/rec" fields="themes" :start-refresh-empty-data="false">
          <template #banner="{ data }">
            <dx-ads class="mb-1 px-1" :items="data?.banners ?? []" :ad-key="tab.id" :ad-name="tab.name" />
          </template>
          <template #item="{ item, index }">
            <div :key="item.id">
              <van-cell class="!sticky left-0 top-[-2px] z-10" :border="false" :clickable="false" is-link>
                <template #title>
                  <div class="flex items-center whitespace-nowrap">
                    <span class="text-default font-semibold">{{ item.name }}</span>
                  </div>
                </template>
                <template #value>
                  <div @click="onClickCell(index)">查看更多</div>
                </template>
              </van-cell>
              <div class="dx-grid-2 pb-0.5">
                <live-item v-for="card in item.lives" :key="card.id" :item="card" />
              </div>
            </div>
          </template>
        </dx-hoc-list>
      </template>
    </dx-api-tabs>
  </div>
</template>

<style scoped></style>
