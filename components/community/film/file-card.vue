<template>
  <div v-link="`/afilm-detail?id=${props.data?.id}`" class="qp_card_box">
    <div class="user_info_box">
      <p
        v-if="!props.data?.member"
        :style="{
          color: '#ffffff',
          fontSize: '0.373rem'
        }"
      >
        数据错误
      </p>

      <div v-else class="flex_row">
        <dx-avatar
          box-class="user_thumb"
          :img="props.data?.member?.thumb"
          :size="0.92"
          :uid="props.data?.member?.uid"
        />
        <div>
          <p class="user_name">{{ props.data?.member?.nickname }}</p>
          <p class="xk_num">{{ props.data?.like }}人想看</p>
        </div>
      </div>

      <div v-if="props.isSelf"></div>
      <div v-else :class="['xk_btn', `${is_like ? 'yq_btn' : ''}`]" @click.stop="wantLook">
        <img :src="is_like ? yqIcon : xkIcon" />
        <span>{{ is_like ? '已求' : '想看' }}</span>
      </div>
    </div>
    <div class="qp_card_content">
      <p class="qp_tex line-clamp-2">{{ props.data?.title }}</p>
      <div v-if="props.data?.images?.length > 0" class="user_img_list">
        <div v-for="(item, index) in props.data.images.slice(0, 3)" :key="index" class="user_img_item">
          <dx-image :src="item" preview :index="index" :group-id="`qiupian-item-${props.data.id}`" @click.stop />
        </div>
      </div>
      <stack-link
        v-if="!(Array.isArray(props.data?.mv_info) || props.data?.mv_info == null)"
        class="video_info"
        :list="[props.data?.mv_info]"
        :data="props.data?.mv_info"
      >
        <div class="video_thumb">
          <dx-image :src="props.data?.mv_info.mv.thumb_cover" />
        </div>
        <div class="video_play_info">
          <p class="video_title">{{ props.data?.mv_info?.mv?.title }}</p>
          <div class="play_num truncate">
            {{ props.data?.mv_info?.mv_member?.nickname }} {{ props.data?.mv_info?.mv?.count_play_str }}
          </div>
        </div>
      </stack-link>
    </div>
    <div class="qp_fot_box">
      <div v-if="props.data?.coins" class="left_text">
        <img src="~/assets/image/community/icon_tb_tag.png" />
        <span>{{ props.data?.coins }}</span>
      </div>
      <span></span>
      <div class="right_text">
        <img src="~/assets/image/community/icon_send_video_tag_find.png" />
        <span>回复{{ props.data?.reply }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import xkIcon from '~/assets/image/community/xk_icon.png'
import yqIcon from '~/assets/image/community/yq_icon.png'
const props = defineProps<{
  data?: any
  isSelf?: boolean
}>()

const __ = useNuxtApp()

const is_like = ref(props.data.is_like)
const wantLook = async () => {
  if (!is_like.value) {
    await __.$Api.Community.wantLook({
      find_id: props.data.id
    })
    is_like.value = !is_like.value
  }
}
</script>

<style lang="less" scoped>
@import '@styles/qiupian-card.less';
</style>
