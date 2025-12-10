<template>
  <div class="user-item-default">
    <div class="item">
      <dx-avatar
        :size="1.2"
        :img="props.item?.avatar_url"
        :uid="props.item?.uid"
        :aff="props.item?.aff"
        box-class="icon"
      />
      <div v-link="`/userdetail?id=${props.item?.uid}`" class="info">
        <div class="titl line-clamp-2">{{ props.item?.nickname }}</div>
        <!-- <div class="subtitle">{{ props.item?.person_signnatrue }}</div> -->
      </div>
    </div>
    <div class="btn" :class="{ 'light-color': is_attention }" @click="onFollow(props.item)">
      <template v-if="is_attention">已关注</template>
      <template v-else>
        <img src="~/assets/image/my/icon_add_blue.png" />
        关注
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from '@types'
const props = defineProps<{
  item?: UserInfo
}>()

const __ = useNuxtApp()
const is_attention = ref(Boolean(props.item?.is_attention))
//关注
const onFollow = async (user: any) => {
  const { data } = await __.$Api.User.updateFollow({
    to_uid: user.uid
  })
  is_attention.value = !is_attention.value

  __.$Toast(data.msg)

  __.$Emitter.emit('cache', {
    module: 'user',
    data: {
      uid: props.item?.uid,
      is_attention: +is_attention.value
    }
  })
}
</script>

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

  .btn {
    margin-left: 0.3rem;
    padding: 0.15rem 0.32rem;
    font-size: 0.3rem;
    color: var(--dx-primary-color);
    background: var(--dx-light-blue-color);
    display: flex;
    align-items: center;
    border-radius: 50px;
    img {
      width: 0.3rem;
      margin-right: 0.1rem;
    }

    &.light-color {
      color: rgb(178, 178, 178);
      background: rgb(246, 247, 248);
    }
  }
}
</style>
