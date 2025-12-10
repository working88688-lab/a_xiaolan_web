<template>
  <div>
    <div class="top mb-1 grid grid-cols-3 gap-0.5 px-1 text-center text-white">
      <div v-for="item in topItems" :key="item.uid" class="top1 flex flex-col items-center justify-end">
        <dx-avatar
          class="tablent_tab_date_list_item_center_img"
          :size="1.4"
          :img="item.avatar_url"
          :uid="item.uid"
        ></dx-avatar>

        <span class="my-0.5 w-full truncate">{{ item.nickname }}</span>
        <span class="mb-1 text-sm text-[#e4e4e4]">{{ renderNum(item) }}</span>
        <btn-follow :key="item.uid" :attention="item.is_attention" :uid="item.uid" class="!mb-1">
          <template #default="{ text, follow }">
            <span
              :class="{
                tablent_tab_date_list_item_right_active: follow
              }"
              class="tablent_tab_date_list_item_right_"
            >
              <van-icon v-show="!follow" name="plus"></van-icon>
              {{ text }}
            </span>
          </template>
        </btn-follow>
        <img class="top-icon" :src="item._img" alt="" />
      </div>
    </div>
    <div v-for="(_item, index) in data.slice(3, data.length)" :key="_item.uid" class="tablent_tab_date_list_item">
      <div class="tablent_tab_date_list_item_left">
        <span class="tablent_tab_date_list_item_left_span">{{ index + 4 }}</span>
      </div>
      <div v-link="`/userdetail?id=${_item?.uid}`" class="tablent_tab_date_list_item_center">
        <dx-avatar
          class="tablent_tab_date_list_item_center_img"
          :size="1.1"
          :img="_item?.avatar_url"
          :uid="_item?.uid"
        ></dx-avatar>
        <div class="tablent_tab_date_list_item_center_detail">
          <span class="tablent_tab_date_list_item_center_detail_name">{{ _item?.nickname }}</span>
          <span>{{ renderNum(_item) }}</span>
        </div>
      </div>
      <btn-follow :key="_item?.uid" :attention="_item?.is_attention" :uid="_item?.uid">
        <template #default="{ text, follow }">
          <span
            :class="{
              tablent_tab_date_list_item_right_active: follow
            }"
            class="tablent_tab_date_list_item_right_"
          >
            <van-icon v-show="!follow" name="plus"></van-icon>
            {{ text }}
          </span>
        </template>
      </btn-follow>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RankItem } from '@types'
import ranking1 from '~/assets/image/rank/top1.png'
import ranking2 from '~/assets/image/rank/top2.png'
import ranking3 from '~/assets/image/rank/top3.png'

const props = defineProps<{
  item?: any
  isRender?: boolean
  type?: string
  active?: boolean
}>()

const __ = useNuxtApp()
const renderNum = (item: RankItem) => {
  if (props.type === 'praize') {
    return `获赞数：${item?.val}`
  } else if (props.type === 'upload') {
    return `上传数：${item?.val}`
  } else {
    return `收益数：${item?.val}`
  }
}
const topItems = computed(() => {
  if (data.value.length) {
    const [item1, item2, item3] = data.value
    return [
      {
        ...item1,
        _img: ranking2
      },
      {
        ...item2,
        _img: ranking1
      },
      {
        ...item3,
        _img: ranking3
      }
    ]
  }
  return []
})

const { data, execute, isEmpty, loading, refresh } = useFetchList<RankItem>({
  api: props.item.api,
  params: {
    ...props.item.params,
    size: 20
  }
})

onMounted(() => {
  execute({
    ...props.item.params
  })
})
</script>

<style lang="less" scoped>
.tablent_tab_date_list_item {
  padding: 0 0.29rem;
  display: flex;
  height: 1.3rem;
  margin-bottom: 0.64rem;
  align-items: center;
  &:last-child {
    padding-bottom: 0.64rem;
  }
}
.tablent_tab_date_list_item_right_ {
  width: 1.5rem;
  height: 0.7rem;
  border: 1px solid #cb4aed;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.32rem;
  justify-content: center;
  border-radius: 50px;
  .tablent_tab_date_list_item_right_icon {
    width: 0.28rem;
    height: 0.3rem;
    margin-right: 0.05rem;
  }
}

.tablent_tab_date_list_item_right_active {
  width: 1.5rem;
  height: 0.7rem;
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #b030da, #050188);
  font-size: 0.32rem;
  justify-content: center;
  .tablent_tab_date_list_item_right_icon {
    display: none;
  }
}

.tablent_tab_date_list_item_left {
  width: 0.746rem;
  text-align: center;

  .tablent_tab_date_list_item_left_img {
    width: 0.7rem;
    height: 0.7rem;
  }

  .tablent_tab_date_list_item_left_span {
    font-family: FZLTZHK-GBK1-0;
    color: #fff;
    font-size: 0.42rem;
    line-height: 1.25;
  }
}

.tablent_tab_date_list_item_center {
  flex: 1;
  margin: 0 0.16rem;
  display: flex;

  .tablent_tab_date_list_item_center_img {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    margin-right: 0.24rem;
    overflow: hidden;
  }

  .tablent_tab_date_list_item_center_detail {
    display: flex;
    flex-direction: column;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.32rem;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tablent_tab_date_list_item_center_detail_name {
      font-size: 0.4rem;
      color: #fff;
      margin-bottom: 0.2rem;
    }
  }
}
.top-icon {
  max-width: 100%;
  width: unset;
  height: auto;
}
</style>
