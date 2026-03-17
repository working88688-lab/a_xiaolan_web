<script setup lang="ts">
import type { UserInfo } from '@types'

const props = defineProps<{
  item?: UserInfo
}>()
</script>

<template>
  <div v-if="props.item" class="user-item-default">
    <div class="item mr-auto">
      <dx-avatar
        :size="1.2"
        :img="props.item?.avatar_url"
        :uid="props.item?.uid"
        :aff="props.item?.aff"
        box-class="icon"
      />
      <div class="ml-0.5">
        <slot name="nickname">
          <nuxt-link class="flex items-center" :to="`/userdetail?id=${props.item?.uid}`">
            <div class="max-w-14 truncate text-default font-medium">
              {{ props.item?.nickname }}
            </div>
            <img
              v-if="props.item.auth_status"
              class="ml-0.5 h-[20px] w-[20px]"
              src="~/assets/image/community/original.png"
              alt=""
            />
          </nuxt-link>
        </slot>
        <slot name="desc" />
      </div>
    </div>
    <btn-follow use-default-style :attention="props.item?.is_attention" size="tiny" :uid="props.item?.uid"></btn-follow>
  </div>
</template>

<style lang="less" scoped>
.user-item-default {
  padding: 8px 0;
  display: flex;
  align-items: center;

  .item {
    flex: 1;
    display: flex;
    align-items: center;

    .icon {
      margin-right: 0.2rem;
    }

    .info {
      flex: 1;

      .title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #1a1a1a;
      }

      .subtitle {
        margin-top: 0.1rem;
        font-size: 0.3rem;
        color: #666;
      }
    }
  }
}
</style>
