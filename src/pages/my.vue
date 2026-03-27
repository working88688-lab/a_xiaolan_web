<!-- 
    desc: 个人中心
    date: 2024.03.28
-->
<template>
  <div class="user-page container">
    <scroll-list :pull-down-refresh="userStore.info">
      <div class="user-content">
        <div class="user-top">
          <nuxt-icon
            v-link="`/my/notice?_index=1`"
            class="cursor-pointer text-[24px]"
            name="my/notice"
            filled
          ></nuxt-icon>
          <div v-if="user.message_tip > 0" class="mark" />
        </div>

        <!-- 头像 start -->
        <div class="user-avatar-box">
          <div class="user-avatar-left">
            <div class="user-avatar cursor-pointer">
              <dx-avatar :uid="user.uid" :size="1.4" :img="user.avatar_url" />
            </div>
            <div class="user-avatar-info">
              <div class="user-avatar-title">{{ user?.nickname }}</div>
              <div class="user-avatar-vip">
                <vip-icon :data="user"></vip-icon>
                <!-- <img v-if="user.is_vip == 1" class="vip-level" :src="setVipIcon(user.vip_level)" /> -->

                <div v-if="user.auth_level >= 4" class="auth-level">
                  <img src="~/assets/image/creator.png" />
                  <span>制片人LV.{{ user.auth_level }}</span>
                </div>
              </div>
              <div class="user-avatar-subtitle">
                ID：{{ user?.uid }}
                <span style="margin-left: 0.12rem">{{ user?.is_reg ? `账号：${user?.username}` : '' }}</span>
              </div>
            </div>
          </div>
          <div v-if="!user?.is_reg" v-link="`/login`" class="user-avatar-right cursor-pointer">注册登录</div>
        </div>
        <!-- 头像 end -->
        <!-- 关注 start -->
        <div class="user-info-box">
          <div v-link="`/fans`" class="user-info-item user-info-item-border cursor-pointer">
            <div class="mr-0.5">粉丝</div>
            <div>{{ user?.fans_count ?? 0 }}</div>
          </div>
          <div v-link="`/follow`" class="user-info-item user-info-item-border cursor-pointer">
            <div class="mr-0.5">关注</div>
            <div>{{ user?.followed_count ?? 0 }}</div>
          </div>
          <div class="user-info-item">
            <div class="mr-0.5">获赞</div>
            <div>{{ user?.likes_count ?? 0 }}</div>
          </div>
        </div>
        <!-- 关注 end -->
        <!-- 用户级别 start -->
        <div v-link="`/renewal`" class="user-member-box relative cursor-pointer">
          <div class="user-member-info">
            <div class="info">
              <div class="user-info-container">
                <span class="user-member-type">
                  <vip-level :value="user.vip_level"></vip-level>
                </span>
              </div>
              <div class="flex items-center">
                <div class="mr-0.5">{{ setVipLevelItem() }}</div>
                <div class="user-member-btn">
                  <img src="~/assets/image/my/icon-renewal.png" />
                </div>
              </div>
            </div>
          </div>
          <img src="@/assets/image/my/model.png" class="model" alt="" />
        </div>
        <!-- 用户级别 end -->

        <!-- 同圈入口 banner start -->
        <div v-link="`/community?tab=scircle`" class="user-tongquan-banner cursor-pointer">
          <img class="user-tongquan-banner-img" src="~/assets/image/my-tongquan.png" alt="同圈" />
        </div>
        <!-- 同圈入口 banner end -->

        <!-- 导航 start -->
        <div class="user-active-box grid grid-cols-4 gap-1">
          <div v-link="`/my/collect`" class="user-active-item">
            <nuxt-icon name="my/star" class="icon" filled></nuxt-icon>
            <p class="user-active-title">我的收藏</p>
          </div>
          <div v-link="`/my/buy`" class="user-active-item">
            <nuxt-icon name="my/buy" class="icon" filled></nuxt-icon>
            <p class="user-active-title">我的购买</p>
          </div>
          <div v-link="`/my/watched`">
            <div class="user-active-item">
              <nuxt-icon name="my/record" class="icon" filled></nuxt-icon>
              <p class="user-active-title">浏览历史</p>
            </div>
          </div>
          <div v-link="`/mypost`">
            <div class="user-active-item">
              <nuxt-icon name="my/post" class="icon" filled></nuxt-icon>
              <p class="user-active-title">我的帖子</p>
            </div>
          </div>
          <div v-link="`/my/work`">
            <div class="user-active-item">
              <nuxt-icon name="my/work" class="icon" filled></nuxt-icon>
              <p class="user-active-title">创作中心</p>
            </div>
          </div>

          <div v-link="`/coin-recharge`">
            <div class="user-active-item">
              <nuxt-icon name="my/coin" class="icon" filled></nuxt-icon>
              <p class="user-active-title">金币充值</p>
            </div>
          </div>
          <div v-link="`/myinvite`">
            <div class="user-active-item">
              <nuxt-icon name="my/invite" class="icon" filled></nuxt-icon>
              <p class="user-active-title">邀请好友</p>
            </div>
          </div>
          <div v-link="`/my/notice`">
            <div class="user-active-item">
              <nuxt-icon name="my/message" class="icon" filled></nuxt-icon>
              <p class="user-active-title">消息中心</p>
            </div>
          </div>
        </div>
        <div class="user-active-box income-card">
          <div v-link="`/income`" class="user-revenue-item">
            <div class="user-revenue-item_top px-1.5">
              <nuxt-icon name="my/income" class="mr-0.5 !text-[24px]" filled></nuxt-icon>
              <span>我的收入</span>
            </div>
            <div class="user-revenue-item_assets">
              <div class="user-revenue-item_assets_item">
                <p>{{ user.today_mv_score }}</p>
                <span>今日视频收入</span>
              </div>
              <div class="user-revenue-item_assets_item">
                <p>{{ user.today_post_score }}</p>
                <span>今日贴文收入</span>
              </div>
              <div class="user-revenue-item_assets_item">
                <p>{{ user.today_tui_coins }}</p>
                <span>今日推广收入</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 导航 end -->
        <!-- 设置 start -->
        <div class="user-server-box">
          <div class="user-server-item" @click="showProfilePopup = true">
            <div class="user-server-item-left">
              <nuxt-icon name="my/info" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">我的资料</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/my/afilm`" class="user-server-item">
            <div class="user-server-item-left">
              <nuxt-icon name="my/want" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">我的求片</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/customer`" class="user-server-item">
            <div class="user-server-item-left">
              <nuxt-icon name="my/service" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">客服中心</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/app-center`" class="user-server-item">
            <div class="user-server-item-left">
              <nuxt-icon name="my/app" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">应用推荐</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div class="user-server-item" @click="onOpenTg">
            <div class="user-server-item-left">
              <nuxt-icon name="my/group" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">官方聊骚群</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/my/feedback`" class="user-server-item">
            <div class="user-server-item-left">
              <nuxt-icon name="my/feedback" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">有奖反馈</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/setting`" class="user-server-item">
            <div class="user-server-item-left">
              <nuxt-icon name="my/setting" class="s-icon" filled></nuxt-icon>
              <div class="user-server-item-title">设置</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
        </div>
        <!-- 设置 end -->
      </div>
    </scroll-list>
    <ProfilePopup v-model:show="showProfilePopup" />
  </div>
</template>

<script setup lang="ts">
// 状态
const userStore = useUserStore()
const globalStore = useGlobalStore()
const __ = useNuxtApp()
const { u: user } = storeToRefs(userStore)
const showProfilePopup = ref(false)

const setVipLevelItem = () => {
  const _user = user.value
  let text = '去平台开通会员'
  if (_user?.vip_level == 1) {
    text = '升级续费 >'
  } else if (_user?.vip_level == 2) {
    text = '升级续费 >'
  } else if (_user?.vip_level == 3) {
    text = '升级续费 >'
  } else if (_user?.vip_level == 4) {
    text = '永久畅享小蓝'
  } else if (_user?.vip_level == 6) {
    text = '升级续费 >'
  } else if (_user?.vip_level == 7) {
    text = '升级续费 >'
  }
  return text
}

const onOpenTg = () => {
  __.$Utils.onWinOpen(globalStore.config.tg)
}

useSyncCacheData(cacheData => {
  if (cacheData.module === 'user') {
    const { data: _data } = cacheData

    userStore.updateUserInfo(
      'followed_count',
      _data.is_attention ? user.value.followed_count + 1 : user.value.followed_count - 1
    )
  }
})

// onActivated(userStore.info)
</script>

<style lang="less" scoped>
@import '@styles/my.less';

:deep(.vip-level) {
  margin-top: 2px;
}

.icon {
  font-size: 32px;
}

.s-icon {
  font-size: 24px;
}

.model {
  position: absolute;
  width: 90px;
  height: 106px;
  right: 6px;
  bottom: 0;
}

.user-tongquan-banner {
  margin: 10px 12px 0;
  border-radius: 12px;
  overflow: hidden;
}

.user-tongquan-banner-img {
  display: block;
  width: 100%;
  height: auto;
}

.user-active-box.income-card {
  background: linear-gradient(180deg, #fff2ed 0%, #ffffff 22.12%);
  border: 1px solid #fff;
}

.user-server-box {
  .s-icon,
  .icon {
    margin-right: 6px;
  }
}

.user-info-item-border {
  position: relative;

  &::after {
    display: block;
    content: '';
    height: 10px;
    width: 1px;
    background-color: #fff;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
