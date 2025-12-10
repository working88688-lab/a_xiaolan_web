<template>
  <div class="forum-layout container">
    <scroll-list :loading="loading" :pull-down-refresh="refresh">
      <p>全部论坛</p>

      <div
        v-for="(item, index) in listData"
        :key="index"
        v-link="`/forum-detail?id=${item.id}`"
        class="forum-layout_item"
      >
        <div class="forum-layout_item_left">
          <dx-avatar class="forum-avatar" :img="item?.bg_thumb_full"></dx-avatar>
          <div class="forum-content">
            <p>#{{ item?.name }}</p>
            <div class="forum-content_info">
              <span>{{ item?.post_num }}个帖子</span>
              <span>{{ $Utils.formatNumber(item?.view_num) }}浏览</span>
              <span>{{ $Utils.formatNumber(item?.follow_num) }}人关注</span>
            </div>
          </div>
        </div>
        <btn-follow
          use-default-style
          :api="__.$Api.Community.follow"
          :attention="item.is_follow"
          :params="{ topic_id: item.id }"
          symbol="+"
        ></btn-follow>
        <!-- <FouceBotton data="{item}" type="{1}" on-click="{followButtonOnClick}"></FouceBotton> -->
      </div>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
import type { ForumItem } from '@types'
const __ = useNuxtApp()

const { listData, refresh, loading } = useFetchList<ForumItem>({
  api: __.$Api.Community.topics,
  immediate: true
})
</script>

<style lang="less" scoped>
.forum-layout {
  padding: 10px;

  p {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 6px;
  }

  &_item {
    padding: 0 5px;
    margin-top: 12px;
    height: 70px;
    border-radius: 5px;
    background-color: #f6f7f8;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &_left {
      display: flex;
      align-items: center;

      .forum-content {
        display: flex;
        flex-direction: column;
        margin-left: 8px;

        p {
          color: #111;
          font-size: 14px;
          font-weight: 600;
        }

        &_info {
          display: flex;
          align-items: center;

          span {
            font-size: 10px;
            color: #666;
            margin-right: 15px;
          }
        }
      }
    }

    &_focus {
      width: 64px;
      height: 30px;
      border-radius: 15px;
      border: solid 1px #548aef;
      text-align: center;
      line-height: 30px;
      color: #548aef;
    }
  }
}
.forum-avatar {
  flex-shrink: 0;
}
:deep(.btn_follow) {
  flex-shrink: 0;
  &.followed {
    background-color: var(--van-tabbar-item-active-color);
    color: #fff;
  }
}
</style>
