<template>
  <van-popup
    teleport="body"
    v-bind="$attrs"
    position="right"
    :lock-scroll="false"
    :style="{ width: '100% !important', height: '100%' }"
    @open="onOpen"
    @closed="onClosed"
  >
    <div class="append_page container">
      <dx-navbar class="my-nav-bar" :border="false" title="追加赏金列表" left-arrow @click-left="onClose"></dx-navbar>
      <div class="add_total">赏金总额{{ data.list?.reduce((sum, e) => sum + Number(e.coins), 0) }}金币</div>
      <div class="scroll-container">
        <scroll-list v-model:loading="loading" :is-empty="data.list?.length === 0">
          <div class="dx-list">
            <div v-for="(item, index) in data.list" :key="index" class="user_item">
              <div class="flex_row">
                <dx-avatar
                  box-class="thumb"
                  :size="1.1"
                  :img="item.thumb"
                  :is-creater="Boolean(item.auth_status)"
                  :uid="item.uid"
                />
                <div>
                  <div class="nickname">{{ item.nickname }}</div>
                  <div class="fans_number">{{ item.followed_count }}粉丝</div>
                </div>
              </div>
              <span class="coin_number">追加了{{ item.coins }}金币</span>
            </div>
          </div>
        </scroll-list>
      </div>
      <div class="append_btn" @click="_open">追加赏金</div>
    </div>
    <add-bounty :id="props.findId" v-model:show="showBounty" :type="1" @success="execute"></add-bounty>
  </van-popup>
</template>

<script setup lang="ts">
import type { UserInfo } from '@types'
const props = defineProps<{
  findId?: string
}>()
const emit = defineEmits<{
  'update:show': [e: boolean]
}>()

const __ = useNuxtApp()

const onClose = () => {
  emit('update:show', false)
}
const { value: showBounty, toTrue: _open } = useBoolean()
const { data, execute, loading } = useMyFetch<{
  list: UserInfo[]
}>({
  api: __.$Api.Community.appendDetail,
  params: {
    find_id: props.findId
  }
})

const onOpen = () => {
  return execute()
}

const onClosed = () => {
  data.value.list = []
}
</script>

<style lang="less" scoped>
.append_page {
  .add_total {
    height: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.667rem;
    color: #ed9f2f;
    font-weight: bold;
  }

  .append_btn {
    width: 100%;
    height: 1.2rem;
    background: #fd5c18;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.427rem;
  }

  .user_item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.4rem;
    margin-bottom: 0.4rem;
    // border-bottom: 1px solid #332d46;

    .thumb {
      margin-right: 0.16rem;
    }

    .nickname {
      color: #000;
      font-size: 0.427rem;
    }

    .fans_number {
      font-size: 0.347rem;
      color: #999999;
      margin-top: 0.16rem;
    }

    .coin_number {
      font-size: 0.4rem;
      color: #fc5b17;
    }
  }
}
</style>
