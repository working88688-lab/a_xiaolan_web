<!-- 
    desc: 首页列表item
    date: 2024.03.27
-->
<template>
  <div class="featured-avItem">
    <div class="featured-avItem-header recommendItem-header">
      <div class="recommendItem-header-row">
        <div class="featured-avItem-avatar" style="width: 1rem; height: 1rem">
          <div class="avItem-avatar">
            <dx-avatar
              :aff="props.data.user?.aff"
              :img="props.data.user?.avatar_url"
              :uid="props.data.user?.uid"
              :is-creater="props.data.user?.auth_status > 0"
            ></dx-avatar>
          </div>
        </div>
        <div class="featured-avItem-name">
          <p>{{ props.data.user.nickname }}</p>
        </div>
        <div style="flex: 1 1 0%"></div>

        <btn-follow :attention="props.data.user.is_attention" :uid="props.data.user.uid">
          <template #default="{ text, follow }">
            <div
              class="recommendItem-focus"
              :class="{
                isLike: follow
              }"
            >
              <span v-if="!follow" class="recommendItem-point">+</span>
              <span>{{ text }}</span>
            </div>
          </template>
        </btn-follow>
      </div>
    </div>
    <stack-link :list="props.list" :index="props.index">
      <div class="featured-avItem-cover">
        <div class="avItem-linear"></div>
        <div class="avItem-cover">
          <dx-image :src="props.data.cover_thumb_url" />
        </div>
        <div class="avItem-layer linear-bg">
          <div>
            <span>{{ $Utils.formatNumber(props.data.rating) }}次播放</span>
            <span>{{ props.data.duration_str }}</span>
          </div>
        </div>
      </div>
    </stack-link>

    <div class="featured-avItem-title line-clamp-2">{{ props.data.title }}</div>
    <div class="featured-avItem-header recommendItem-header">
      <div class="featured-avItem-bottom" style="flex: 1 1 0%">
        <dx-btn-like align="row" icon="comment" icon-type="nuxt" :likes="props.data.comment"></dx-btn-like>

        <dx-btn-like
          :id="props.data.id"
          align="row"
          :like="props.data.is_like === 1"
          :api="__.$Api.Video.liking"
          :likes="props.data.total_likes ?? props.data.like_num ?? props.data.like ?? 0"
          :use-toast="false"
        >
          <template #default="{ likes }">
            {{ $Utils.formatNumber(likes, 'en') }}
          </template>
        </dx-btn-like>
        <div class="avItem-bottom-item" @click="onShare">
          <img src="~/assets/image/home/share.png" />
          <span>分享</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data: any
    list: any
    index: number
  }>(),
  {
    data: () => ({}),
    index: 0,
    list: () => []
  }
)
const __ = useNuxtApp()
const emit = defineEmits<{
  share: [e: any]
  follow: [e: any]
  cache: [e: any]
}>()
const onShare = () => {
  emit('share', props.data)
}
</script>

<style lang="less" scoped>
.recommendItem-focus {
  display: flex;
  align-items: center;
}
.featured-avItem {
  width: 100%;
  box-sizing: border-box;
  padding: 0 0.3rem 0.2rem;
  .featured-avItem-header {
    display: flex;
    flex-direction: row;
    align-items: center;

    .featured-avItem-name {
      margin-left: 0.2rem;

      p {
        font-size: 0.4rem;
        color: #777;
        max-width: 7rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span {
        color: #777;
        font-size: 0.33rem;
      }
    }
  }

  .featured-avItem-cover {
    position: relative;
    display: flex;
    flex-direction: column;

    .avItem-cover {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 5rem;
      object-fit: cover;
      border-radius: 4px;
      overflow: hidden;
      img {
        border-radius: 5px;
      }
    }

    .avItem-linear {
      height: 2.5rem;
      bottom: 0;
      right: 0;
      left: 0;
      background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.2));
      position: absolute;
      z-index: 2;
      display: flex;
    }

    .avItem-layer {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0.15rem 0.3rem;

      div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: white;
        font-size: 0.3rem;
      }
    }

    .avItem-layerCenter {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 1.4rem;
        height: 1.4rem;
      }
    }
  }

  .featured-avItem-bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.3rem 0.5rem;
    justify-content: space-between;
    position: relative;

    .featured-avItem-bottom-layer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
    }

    .avItem-bottom-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #333;
      font-size: 0.35rem;
      position: relative;
      z-index: 1;
      img {
        width: 0.5rem;
        height: auto;
        margin-right: 0.1rem;
      }
    }
  }
}

.recommendItem-header {
  padding: 0.3rem 0 !important;
  justify-content: space-between;

  .recommendItem-header-row {
    display: flex;
    align-items: center;
    width: 100%;
    .featured-avItem-name {
      p {
        max-width: 4rem;
      }
    }
  }

  .featured-avItem-bottom {
    padding: 0 !important;
  }

  .recommendItem-point {
    font-size: 012px;
    display: flex;
    align-items: center;
  }

  .recommendItem-focus {
    color: #428af7;
    font-size: 0.35rem;
    padding: 0 0.3rem;
    border-radius: 35px;
    background-color: #e5f0ff;
    display: flex;
    align-items: center;
    height: 0.8rem;
    line-height: 0.8rem;
    box-sizing: border-box;
    flex-direction: row;
    &.isLike {
      background-color: #efefef;
      color: #b2b2b2;
    }
  }
}

.featured-avItem-title {
  font-size: 0.4rem;
  color: #333;
  padding-top: 0.2rem;
  text-align: left;
}

.featured-avItem-avatar {
  position: relative;

  .avItem-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 1;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .avItem-chuang {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }
}

.avItem-heji-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.3rem;
  background-color: #f6f7f8;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;

  .avItem-heji-image {
    border-radius: 5px;
    overflow: hidden;
    min-width: 1.7rem;
    max-width: 1.75rem;
    height: 1rem;
  }

  .avItem-heji-title {
    padding: 0 0.2rem;
    font-size: 0.35rem;
    color: #333;
  }

  .avItem-heji-button {
    padding: 0.15rem 0.3rem;
    font-size: 0.35rem;
    border-radius: 35px;
    color: #323232;
    background-color: #e3e4e6;
  }
}
</style>
