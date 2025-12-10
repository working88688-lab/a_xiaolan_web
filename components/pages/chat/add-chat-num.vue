<script setup lang="tsx">
type MessageItem = {
  value: string
  title: string
  sub_title: string
  key: string
}
const props = defineProps<{}>()
const __ = useNuxtApp()

const { value, open, close } = useBoolean()

const { data, execute } = useMyFetch<{
  message_total: number
  message_product: MessageItem[]
}>({
  api: __.$Api.User.chat_product,
  immediate: true
})

const select_index = ref()
const on_select = (_index: number) => {
  select_index.value = _index
}
const loading = ref(false)
const onSubmit = async () => {
  try {
    loading.value = true
    const res = await __.$Api.User.chat_buy({
      value: data.value?.message_product?.[select_index.value]?.value
    })

    if (res.status === 1) {
      execute()
      close()
      return __.$Toast(res.data.tips)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const on_closed = () => {
  select_index.value = undefined
}

const router = useRouter()
const to_recharge = () => {
  router.push('/coin-recharge')
  close()
}
useDectivted(close)

defineExpose({
  refresh: execute
})
</script>

<template>
  <dx-button class="flex items-center !py-0.5 !pl-1 !pr-0" color="#ffc000" size="mini" @click="open">
    <div class="flex items-center text-[#8c4d10]">
      <span class="mr-0.5">可以消息数量：{{ data.message_total || 0 }}</span>

      <nuxt-icon name="plus" class="text-4xl text-morange" />
    </div>
  </dx-button>

  <van-popup
    v-model:show="value"
    close-on-click-overlay
    close-on-popstate
    position="bottom"
    :style="{
      width: '100%',
      height: '56%'
    }"
    teleport="body"
    :lock-scroll="false"
    round
    @closed="on_closed"
  >
    <div class="flex-col-center h-full bg-mgray px-1 pt-1.5">
      <div class="grid w-full flex-1 grid-cols-3 gap-1">
        <div
          v-for="(item, index) in data.message_product"
          :key="item.key"
          class="flex-col-center rounded-sm border border-solid bg-white py-3"
          :class="{
            'is-selected': index === select_index
          }"
          @click="on_select(index)"
        >
          <span class="mb-0.5 text-base">{{ item.title }}</span>
          <span class="sub-title text-sm">{{ item.sub_title }}</span>
        </div>
      </div>
      <div class="mt-2 w-full">
        <dx-button
          block
          :round="false"
          :disabled="!(select_index >= 0)"
          class="btn_item"
          type="warning"
          :loading="loading"
          @click="onSubmit"
        >
          确认支付
        </dx-button>
      </div>
      <div class="mb-1 mt-0.5 w-full text-center">
        <span class="text-sm text-morange" @click="to_recharge">充值金币 ></span>
      </div>
    </div>
  </van-popup>
</template>

<style lang="postcss" scoped>
.sub-title {
  color: var(--dx-base2-color);
}
.is-selected {
  color: #8c4d10;
  background-color: #ffc000;
  border-color: #8c4d10;

  .sub-title {
    color: #8c4d10;
  }
}
</style>
