<template>
  <div class="forum-layout container">
    <dx-hoc-list v-if="key" :api="__.$Api.Community.topics">
      <template #item="{ item }">
        <div v-link="`/forum-detail?id=${item.id}`" class="forum-layout_item">
          <div class="forum-layout_item_left">
            <dx-avatar class="forum-avatar" :img="item?.bg_thumb_full"></dx-avatar>
            <div class="forum-content">
              <p>#{{ item?.name }}</p>
              <div class="forum-content_info">
                <span>{{ $Utils.formatNumber(is_girl_topic ? item.girl_num : item?.post_num) }}个帖子</span>
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
        </div>
      </template>
    </dx-hoc-list>
  </div>
</template>

<script setup lang="ts">
const __ = useNuxtApp()

const route = useRoute()

const is_girl_topic = computed(() => {
  return !!route.query.type
})
const { setNavbarTitle } = useNavbarTitle()
const { key } = useKeepAlive({
  effect() {
    setNavbarTitle(is_girl_topic.value ? '约炮论坛' : '原创论坛')
  }
})
</script>

<style lang="postcss" scoped>
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
  height: 32px;
  &.followed {
    background-color: var(--dx-primary-color);
    color: #fff;
  }
}
</style>
