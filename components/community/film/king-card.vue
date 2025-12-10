<template>
  <div
    v-link="`/tag?_type=film&uuid=${props.data.member.uuid}&title=${props.data?.member?.nickname}`"
    class="king_item_box"
  >
    <div class="flex_row">
      <div class="user_num">
        <img v-if="props.index <= 2" :src="kingIcon[props.index]" />
        <span v-else>{{ props.index + 1 }}</span>
      </div>
      <div class="user_info_box">
        <dx-avatar
          box-class="user_thumb"
          :size="1.08"
          :img="props.data?.member?.thumb"
          :is-creater="props.data?.member?.auth_status ? true : false"
        />
        <div class="user_column">
          <div class="user_name">{{ props.data?.member?.nickname }}</div>
          <div class="fans_num">粉丝{{ props.data?.member?.fans_count ?? 0 }}</div>
        </div>
      </div>
    </div>
    <span class="tj_text">推荐{{ props.data.receive }}</span>
  </div>
</template>

<script setup lang="ts">
import oneIcon from '~/assets/image/community/icon_fv_rank_one.png'
import threeIcon from '~/assets/image/community/icon_fv_rank_three.png'
import twoIcon from '~/assets/image/community/icon_fv_rank_two.png'

const props = defineProps<{
  data?: any
  index: number
}>()

const kingIcon = [oneIcon, twoIcon, threeIcon]
</script>

<style lang="less" scoped>
.king_item_box {
  margin-bottom: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .tj_text {
    font-size: 0.4rem;
    color: #ff3e3e;
  }

  .user_num {
    width: 0.53rem;

    img {
      width: 100%;
    }

    font-size: 0.423rem;
    color: #aaa4bb;
    text-align: center;
    margin-right: 0.26rem;
  }

  .user_info_box {
    display: flex;
    flex-direction: row;
    align-items: center;

    .user_thumb {
      margin-right: 0.211rem;
    }

    .user_column {
      display: flex;
      flex-direction: column;

      .user_name {
        font-size: 0.423rem;
        color: #000;
      }

      .fans_num {
        font-size: 0.32rem;
        color: #87879b;
      }
    }
  }
}
</style>
