<script setup lang="ts">
import type { UserInfo } from '@types'

const props = defineProps<{
  item?: UserInfo
}>()

const emit = defineEmits<{
  /** 操作成功后的目标关注态（用于列表补丁，避免接口滞后把按钮同步错） */
  'follow-change': [uid?: number, nextAttention?: 0 | 1]
}>()

function norm01(v: unknown): 0 | 1 | undefined {
  if (v === 1 || v === '1' || v === true) return 1
  if (v === 0 || v === '0' || v === false) return 0
  return undefined
}

/** 列表里「是否已关注」字段名不统一时，与 btn-follow 对齐为 0 | 1 */
const attentionFromItem = computed(() => {
  const it = props.item
  if (!it) return undefined as undefined
  const a = norm01(it.is_attention)
  const f = norm01(it.is_followed)
  if (a === undefined && f === undefined) return undefined as undefined
  if (a === 1 || f === 1) return 1 as const
  return 0 as const
})

/** btn-follow success：1=当前已关注，-1=当前未关注 */
const onFollowSuccess = (flag: number) => {
  const next: 0 | 1 = flag === 1 ? 1 : 0
  emit('follow-change', props.item?.uid, next)
}
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
    <btn-follow
      use-default-style
      :attention="attentionFromItem"
      size="tiny"
      :uid="props.item?.uid"
      @success="onFollowSuccess"
    ></btn-follow>
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
