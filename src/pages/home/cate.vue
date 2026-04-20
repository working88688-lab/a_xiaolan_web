<script setup lang="tsx">
const __ = useNuxtApp()

const route = useRoute()
const { key } = useKeepAlive({})
useNavbarTitle()
</script>

<template>
  <div :key="key" class="container">
    <dx-hoc-list
      v-if="key"
      class="dx-grid-3"
      :api="__.$Api.Home.construct_list"
      :params="{
        nag_id: route.query.nag_id
      }"
    >
      <template #item="{ item }">
        <nuxt-link
          :key="item.id"
          :to="`/tag?_type=home&${format_url_params({
            construct_id: item.id,
            title: item.title,
            has_sort: 1
          })}`"
          class="block h-full w-full overflow-hidden rounded text-center"
        >
          <div class="relative h-[110px]">
            <dx-image :src="item.bg_thumb"></dx-image>
            <div class="cate-title absolute bottom-0 left-0 right-0 truncate text-center text-base text-white">
              {{ item.title }}
            </div>
          </div>
        </nuxt-link>
      </template>
    </dx-hoc-list>
  </div>
</template>

<style lang="postcss" scoped>
.cate-title {
  backdrop-filter: blur(8px);
}
</style>
