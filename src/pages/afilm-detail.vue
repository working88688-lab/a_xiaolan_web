<template>
  <div class="container" @touchmove="showInput = false">
    <scroll-list :loading="loading" :is-ready="!loading" :is-empty="isEmpty" :pullup="fetch_recommends" :is-end="isEnd">
      <div class="qp_card_box !mb-0">
        <dx-ads class="mb-1" :items="qiupianInfo?.ads ?? []"></dx-ads>
        <div class="user_info_box">
          <div class="flex_row">
            <dx-avatar
              box-class="user_thumb"
              :size="0.96"
              :is-creater="qiupianInfo.detail?.member?.auth_status > 0"
              :img="qiupianInfo.detail?.member?.thumb"
              :uid="qiupianInfo.detail?.member?.uid"
            />
            <div>
              <p class="xk_num">{{ qiupianInfo.detail?.like }}人想看</p>
            </div>
          </div>
          <span class="user_fb_time">{{ qiupianInfo.detail?.created_at_format }}</span>
        </div>
        <div class="qp_card_content !pl-0">
          <p class="qp_text line-clamp-2">{{ qiupianInfo.detail?.title }}</p>

          <div v-if="qiupianInfo.detail?.mv_info && !Array.isArray(qiupianInfo.detail?.mv_info)" class="video_info">
            <div class="video_thumb">
              <dx-image :src="qiupianInfo.detail?.mv_info.mv.thumb_cover" />
            </div>
            <div class="video_play_info">
              <p class="video_title line-clamp-2">{{ qiupianInfo.detail?.mv_info.mv.title }}</p>
              <div class="play_num truncate">
                {{ qiupianInfo.detail?.mv_info.mv_member.nickname }}{{ ' ' }}
                {{ qiupianInfo.detail?.mv_info.mv.count_play_str }}
              </div>
            </div>
          </div>
          <template v-if="qiupianInfo.detail?.images.length > 0">
            <div class="detai_user_img_list">
              <div v-for="(item, index) in qiupianInfo.detail?.images" :key="index" class="detai_user_img_item">
                <dx-image :src="item" preview />
              </div>
            </div>
          </template>
        </div>
        <div class="flex_row">
          <div
            v-if="qiupianInfo.detail?.coins > 0 && !Boolean(qiupianInfo.detail?.is_match)"
            class="tuipian_btn add_coin_btn"
            @click="openBounty(1)"
          >
            <img src="~/assets/image/community/icon_tb_tag.png" />
            <span>追加打赏</span>
          </div>
          <div
            v-link="`/push-film?id=${find_id}`"
            class="tuipian_btn"
            :styles="{
              width: qiupianInfo.detail?.coins > 0 && !Boolean(qiupianInfo.detail?.is_match) ? '4.48rem' : '100%'
            }"
          >
            <img src="~/assets/image/community/icon_send_video_tag_find.png" />
            <span>我要推片</span>
          </div>
        </div>
        <div v-if="qiupianInfo.detail?.coins > 0">
          <div class="flex_row" :style="{ marginTop: '0.32rem' }">
            <div class="title_text">总赏金</div>
            <span class="coin_text">{{ qiupianInfo.detail?.total_coins }}金币</span>
          </div>
          <div class="ds_users" @click="_openList">
            <div class="avatar_box">
              <div
                v-for="(item, index) in 4"
                :key="item"
                class="fans_avatar"
                :style="{
                  left: `${index * 0.2265}rem`
                }"
              >
                <dx-image
                  v-if="qiupianInfo.append_list.length >= index + 1"
                  :src="qiupianInfo.append_list[index].thumb"
                />
              </div>
            </div>
            <div class="fans_text flex_row">
              <span v-if="qiupianInfo.append_list.length === 0">暂无人追加赏金</span>
              <span v-else>{{ qiupianInfo.append_ct }}人追加了 {{ qiupianInfo.append_sum }}金币</span>
              <img src="~/assets/image/community/icon_right.png" />
            </div>
          </div>
          <time-show
            v-if="!Boolean(qiupianInfo.detail?.is_match)"
            :coin="qiupianInfo.detail?.coins"
            :star-time="qiupianInfo.count_down.now"
            :end-time="qiupianInfo.count_down.expire_at"
          />
        </div>
        <div
          :style="{
            height: '1px',
            width: '100%',
            background: '#332d46',
            margin: '0.4rem 0'
          }"
        ></div>
      </div>
      <div class="rexin_user">
        <div class="rexin_title">
          <div class="title">推荐视频</div>
          <div class="number">{{ qiupianInfo.detail?.reply }}</div>
        </div>
        <div v-for="(item, index) in listData" :key="item.id" class="rexin_card">
          <img v-if="item.is_accept" class="caina" src="~/assets/image/community/icon_find_video_ok.png" />
          <div
            class="flex_row"
            :style="{
              justifyContent: 'space-between'
            }"
          >
            <div class="user_info_head">
              <dx-avatar :img="item?.member?.avatar_url" box-class="user_thumb" :uid="item?.member?.uid" />
              <div>
                <div class="flex_row">
                  <div class="user_name">{{ item?.member?.nickname }}</div>
                  <div class="dian"></div>
                  <btn-follow
                    class="cursor-pointer"
                    :use-toast="false"
                    :attention="item?.member?.is_attention"
                    :uid="item?.member?.uid"
                  >
                    <template #default="{ text, follow }">
                      <div :class="['gz_btn', `${follow ? 'ygz_btn' : ''}`]">
                        {{ text }}
                      </div>
                    </template>
                  </btn-follow>
                </div>
                <div class="fans_num">{{ item?.member?.followed_count }}粉丝</div>
              </div>
            </div>
            <div
              v-if="item.is_accept"
              class="cursor-pointer"
              :style="{
                fontSize: '0.32rem',
                color: '#fc9b3c',
                marginRight: '0.32rem'
              }"
            >
              获得全部赏金{{ item.coins }}
            </div>
            <div v-else class="cursor-pointer" :style="{ color: 'skyblue', marginRight: 20 }" @click="myAccept(item)">
              未采纳
            </div>
          </div>
          <div class="rexin_content">
            <scroll-x-view v-if="item.mvs?.length">
              <div class="rexin_video_list">
                <stack-link v-for="(_item, _index) in item.mvs" :key="_index" :list="item.mvs" :index="_index">
                  <div class="rexin_video_item">
                    <div class="rexin_video_thumb">
                      <div class="video_time">{{ _item.duration_str }}</div>
                      <dx-image :src="_item.cover_thumb_url" />
                    </div>
                    <div class="rexin_video_title truncate">{{ _item.title }}</div>
                  </div>
                </stack-link>
              </div>
            </scroll-x-view>
          </div>
          <div class="rexin_card_fot" :style="{ justifyContent: 'space-between', display: 'flex' }">
            <div :style="{ display: 'flex' }">
              <div
                class="flex_row"
                :style="{
                  marginRight: '0.853rem',
                  color: item.is_like ? '#fd5c18' : '#999999'
                }"
              >
                <dx-btn-like
                  class="cursor-pointer"
                  :like="item.is_like === 1"
                  :likes="Number(item.like_num_str)"
                  :api="__.$Api.Community.praiseReply"
                  :params="{
                    reply_id: item.id,
                    type: item.is_like === 1 ? 'unset' : 'set'
                  }"
                  :use-toast="false"
                  align="row"
                  @success="onLike(item)"
                ></dx-btn-like>
              </div>
              <div class="flex_row">
                <img
                  class="icon-comment"
                  src="~/assets/image/community/icon_message_num.png"
                  @click.stop="showInputContainer(item)"
                />
                <span class="ml-0.5 text-sm text-base2">{{ item.reply_num_str || 0 }}</span>
              </div>
            </div>

            <div class="ds_btn cursor-pointer" @click="openBounty(0, item)">
              <img src="~/assets/image/community/icon_tb_tag.png" />
              <span>打赏</span>
            </div>
          </div>
          <div v-if="item.comment_list.length" class="pl_box">
            <div>
              <div v-for="(commentItem, __index) in item.comment_list" :key="__index" class="pl_item">
                <div class="user_info_box">
                  <div class="flex_row">
                    <dx-avatar
                      box-class="thumb"
                      :img="commentItem?.member?.avatar_url"
                      :uid="commentItem?.member?.uid"
                    />
                    <div class="user_name">{{ commentItem?.member?.nickname }}</div>
                  </div>
                  <div>
                    <div class="flex_row num_box" @click="praiseCommentReply(item, commentItem)">
                      <img :src="commentItem.is_like ? zanLan : zanHui" />
                      <span
                        :style="{
                          color: commentItem.is_like ? '#40a1ff' : '#999999'
                        }"
                      >
                        {{ commentItem.like_num_str }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="pl_content">
                  {{ commentItem.comment }}
                </div>
                <div
                  class="flex_row"
                  :style="{
                    marginTop: '0.3rem',
                    color: '#fff',
                    paddingLeft: '1.02rem'
                  }"
                >
                  <p class="pl_time">{{ commentItem.created_str }}</p>
                </div>
              </div>
            </div>
            <div v-if="!item.showComment && Number(item.reply_num_str) > item.comment_list.length">
              <div class="more_box" @click="getCommentByReply(item)">
                <span>查看更多</span>
                <img src="~/assets/image/community/icon_more_check.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroll-list>
    <div v-if="showInput" class="video-detail-input-layer">
      <div class="video-detail-input">
        <div class="input-box">
          <img src="~/assets/image/community/video_detail_send.png" />
          <input v-model="comment" type="text" placeholder="优质评论优先展示" autoFocus />
        </div>
        <div class="input-sub" @click="onComment">确定</div>
      </div>
      <div class="van-safe-area-bottom"></div>
    </div>
    <add-bounty
      :id="find_id"
      v-model:show="showBounty"
      :type="type"
      :reply-id="reply_id"
      @success="execute"
    ></add-bounty>
    <bounty-list v-model:show="showBountyList" :find-id="find_id"></bounty-list>
  </div>
</template>

<script setup lang="ts">
import type { QiupianData, QiupianRecommend } from '@types'

import zanHui from '~/assets/image/community/zan_hui.png'
import zanLan from '~/assets/image/community/zan_lan.png'

const __ = useNuxtApp()
const route = useRoute()
const type = ref<0 | 1>(1)
const reply_id = ref()
const showInput = ref(false)
const comment = ref()
const find_id = route.query.id as string
const { value: showBounty, toTrue: _open } = useBoolean()
const { value: showBountyList, toTrue: _openList } = useBoolean()
const {
  data: qiupianInfo,
  loading,
  execute
} = useMyFetch<QiupianData>({
  api: __.$Api.Community.filmDetail,
  params: {
    find_id
  },
  immediate: true
})

const {
  listData,
  loading: loadingList,
  isEmpty,
  execute: fetch_recommends,
  isEnd
} = useFetchList<QiupianRecommend>({
  api: __.$Api.Community.replyByFind,
  params: {
    find_id
  },
  immediate: true,
  usePageSize: false
})

const openBounty = (_type: number, item?: QiupianRecommend) => {
  type.value = _type
  if (item) {
    reply_id.value = item.id
  } else {
    reply_id.value = ''
  }

  _open()
}

const myAccept = async (item: QiupianRecommend) => {
  try {
    await __.$Api.Community.myAccept({
      find_id,
      reply_id: item.id
    })

    item.is_accept = 1
  } catch (error) {}
}

const onLike = (item: QiupianRecommend) => {
  listData.value = listData.value.map(_item => {
    return _item.id === item.id
      ? {
          ..._item,
          like_num_str:
            item.is_like === 1 ? String(Number(item.like_num_str) - 1) : String(Number(item.like_num_str) + 1),
          is_like: item.is_like === 1 ? 0 : 1
        }
      : _item
  })
}

const showInputContainer = (item: QiupianRecommend) => {
  showInput.value = true
  reply_id.value = item.id
}

const onComment = () => {
  const id = reply_id.value
  __.$Api.Community.commentReply({
    reply_id: reply_id.value,
    comment: comment.value
  }).then(() => {
    getCommentByReply({
      id
    } as unknown as QiupianRecommend)
  })
  showInput.value = false
  nextTick(() => {
    comment.value = ''
  })
}

const praiseCommentReply = async (_item: QiupianRecommend, sub: QiupianRecommend) => {
  await __.$Api.Community.praiseCommentReply({
    comment_id: sub.id,
    type: sub.is_like ? 'unset' : 'set'
  })
  listData.value = listData.value.map(item => {
    if (_item.id === item.id) {
      return {
        ...item,
        comment_list: item.comment_list.map(_sub => {
          return sub.id === _sub.id
            ? {
                ..._sub,
                is_like: sub.is_like ? 0 : 1,
                like_num_str: sub.is_like
                  ? String(Number(_sub.like_num_str) - 1)
                  : String(Number(_sub.like_num_str) + 1)
              }
            : _sub
        })
      }
    }

    return item
  })
}

const getCommentByReply = async (item: QiupianRecommend) => {
  const { data } = await __.$Api.Community.commentByReply({
    reply_id: item.id
  })

  listData.value = listData.value.map(_item => {
    return _item.id === item.id
      ? {
          ..._item,
          showComment: true,
          comment_list: [...data]
        }
      : _item
  })
}
</script>

<style lang="less" scoped>
@import '@styles/qiupian-card.less';
.qp_card_box {
  padding: 0 12px;
  border-bottom: 0;
}

.rexin_user {
  .rexin_title {
    padding: 0 12px 12px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .title {
      font-size: 0.48rem;
      font-weight: bold;
      color: #000;
      margin-right: 0.32rem;
    }

    .number {
      font-size: 0.4rem;
    }
  }
}
.video-detail-input-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.video-detail-input {
  background-color: white;
  display: flex;
  align-items: center;
  padding: 12px 0;

  .input-box {
    display: flex;
    align-items: center;
    flex: 1;
    background-color: #ededed;
    height: 1rem;
    border-radius: 0.5rem;
    padding: 0 0.4rem;

    img {
      width: 0.25rem;
      height: auto;
      margin-right: 10px;
    }

    input {
      border: none;
      flex: 1;
      background-color: transparent;
      font-size: 0.4rem;
      color: #333;
    }

    input::placeholder {
      color: var(--dx-base2-color);
    }
  }

  .input-sub {
    color: #333;
    font-size: 0.4rem;
    margin: 0 0.4rem;
  }
}
</style>
