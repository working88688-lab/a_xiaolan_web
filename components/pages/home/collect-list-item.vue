<template>
  <div v-link="`/collect/detail?id=${props.item.id}`" class="bg-white">
    <div class="hotlist_content_content_list_item">
      <div class="hotlist_content_content_list_item_content">
        <div v-if="props.index" :class="['video_cover_top', props.index <= 3 ? `top${props.index}` : 'top4']">
          TOP{{ props.index }}
        </div>
        <div class="hotlist_content_content_list_item_conten_img">
          <dx-image :src="props.item.image_url" />
        </div>
        <div class="hotlist_content_content_list_item_conten_text">
          <p class="hotlist_content_content_list_item_conten_text_title line-clamp-2">{{ props.item.title }}</p>
          <p class="line-clamp-2 text-sm">{{ props.item.desp }}</p>

          <div class="hotlist_content_content_list_item_conten_text_time">
            <div class="hotlist_content_content_list_item_conten_text_time">
              <div>{{ $Utils.formatNumber(props.item.like_count) }}人喜欢</div>
              <span class="hotlist_content_content_list_item_conten_text_time_center">·</span>
              <div>共{{ props.item.video_count }}集</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  index?: number
  item: any
}>()
</script>

<style lang="less" scoped>
.hotlist_content_content_list_item {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 0.16rem;
  .hotlist_content_content_list_item_content {
    display: flex;
    position: relative;
    .top1 {
      background: url('~/assets/image/discover/top1.png') no-repeat;
    }
    .top2 {
      background: url('~/assets/image/discover/top2.png') no-repeat;
    }
    .top3 {
      background: url('~/assets/image/discover/top3.png') no-repeat;
    }
    .top4 {
      background: url('~/assets/image/discover/top4.png') no-repeat;
    }
    .video_cover_top {
      position: absolute;
      width: 1.5rem;
      height: 0.6rem;
      line-height: 0.6rem;
      background-size: 100%;
      left: -0.32rem;
      padding: 0 0 0 0.2rem;
      z-index: 4;
      top: -0.5rem;
      font-size: 0.3rem;
      color: #fff;
    }
    .hotlist_content_content_list_item_conten_img {
      width: 4rem;
      height: 2.5rem;
      border-radius: 0.16rem;
      vertical-align: middle;
      margin-right: 0.26rem;
      overflow: hidden;
    }
    .hotlist_content_content_list_item_conten_text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      .hotlist_content_content_list_item_conten_text_title {
        font-family: PingFangSC;
        font-size: 0.38rem;
      }
      .hotlist_content_content_list_item_conten_text_tag {
        display: flex;
        align-items: center;
        .avatar {
          width: 0.6rem;
          height: 0.6rem;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 0.2rem;
        }
      }
      .hotlist_content_content_list_item_conten_text_time {
        color: #999999;
        font-size: 0.32rem;
        display: flex;
        align-items: center;
        .hotlist_content_content_list_item_conten_text_time_like {
          display: flex;
          align-items: center;
          .icon_like {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.1rem;
          }
        }
        .hotlist_content_content_list_item_conten_text_time_center {
          margin: 0 0.1rem;
        }
      }
    }
  }
}
</style>
