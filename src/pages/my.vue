<!-- 
    desc: 个人中心
    date: 2024.03.28
-->
<template>
  <div class="user-page container">
    <scroll-list :pull-down-refresh="userStore.info">
      <div class="user-content">
        <div class="user-top">
          <img v-link="`/my/notice?_index=1`" class="cursor-pointer" src="~/assets/image/my/icon-bell.png" />
        </div>
        <!-- 头像 start -->
        <div class="user-avatar-box">
          <div class="user-avatar-left">
            <div class="user-avatar cursor-pointer">
              <dx-avatar :uid="user.uid" :size="1.4" :img="user.avatar_url" />
              <div v-if="user.message_tip > 0" class="mark" />
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
          <div v-link="`/fans`" class="user-info-item cursor-pointer">
            <div class="user-info-item-title">{{ user?.fans_count ?? 0 }}</div>
            <div class="user-info-item-subtitle">粉丝</div>
          </div>
          <div v-link="`/follow`" class="user-info-item cursor-pointer">
            <div class="user-info-item-title">{{ user?.followed_count ?? 0 }}</div>
            <div class="user-info-item-subtitle">关注</div>
          </div>
          <div class="user-info-item">
            <div class="user-info-item-title">{{ user?.likes_count ?? 0 }}</div>
            <div class="user-info-item-subtitle">获赞</div>
          </div>
        </div>
        <!-- 关注 end -->
        <!-- 用户级别 start -->
        <div v-link="`/renewal`" class="user-member-box cursor-pointer">
          <div class="user-member-info">
            <div class="info">
              <img class="user-member-icon" src="~/assets/image/my/icon-member.png" />
              <span class="user-member-type">
                <vip-level :value="user.vip_level"></vip-level>
              </span>
              <span class="user-member-line">|</span>
              <span>{{ setVipLevelItem() }}</span>
            </div>
          </div>
          <div class="user-member-btn">
            <img src="~/assets/image/my/icon-renewal.png" />
          </div>
        </div>
        <!-- 用户级别 end -->
        <!-- 导航 start -->
        <div class="user-active-box grid grid-cols-4 gap-1">
          <div v-link="`/my/collect`" class="user-active-item">
            <img class="user-active-icon" src="~/assets/image/my/iconActive1.png" />
            <p class="user-active-title">我的收藏</p>
          </div>
          <div v-link="`/my/buy`" class="user-active-item">
            <img class="user-active-icon" src="~/assets/image/my/iconActive2.png" />
            <p class="user-active-title">我的购买</p>
          </div>
          <div v-link="`/my/watched`">
            <div class="user-active-item">
              <img class="user-active-icon" src="~/assets/image-icon/history.png" />
              <p class="user-active-title">浏览历史</p>
            </div>
          </div>
          <div v-link="`/mypost`">
            <div class="user-active-item">
              <img class="user-active-icon" src="~/assets/image/my/iconActive11.png" />
              <p class="user-active-title">我的帖子</p>
            </div>
          </div>
          <div v-link="`/my/work`">
            <div class="user-active-item">
              <img class="user-active-icon" src="~/assets/image/my/work.png" />
              <p class="user-active-title">作品管理</p>
            </div>
          </div>

          <div v-link="`/coin-recharge`">
            <div class="user-active-item">
              <img class="user-active-icon" src="~/assets/image/my/iconActive6.png" />
              <p class="user-active-title">金币充值</p>
            </div>
          </div>
          <div v-link="`/myinvite`">
            <div class="user-active-item">
              <img class="user-active-icon" src="~/assets/image/my/iconActive8.png" />
              <p class="user-active-title">邀请好友</p>
            </div>
          </div>
          <div v-link="`/my/notice`">
            <div class="user-active-item">
              <img class="user-active-icon" src="~/assets/image/my/iconActive4.png" />
              <p class="user-active-title">消息中心</p>
            </div>
          </div>
        </div>

        <!-- 导航 end -->
        <!-- 设置 start -->
        <div class="user-server-box">
          <div v-link="`/income`" class="user-revenue-item">
            <div class="user-revenue-item_top">
              <img src="~/assets/image/my/revenue_icon.png" />
              <span>我的收入</span>
            </div>
            <div class="user-revenue-item_assets">
              <div class="user-revenue-item_assets_item">
                <p>{{ user.today_mv_score }}</p>
                <span>今日视频收入</span>
              </div>
              <div class="user-revenue-item_assets_item">
                <p>{{ user.today_post_score }}</p>
                <span>今题贴文收入</span>
              </div>
              <div class="user-revenue-item_assets_item">
                <p>{{ user.today_tui_coins }}</p>
                <span>今日推广收入</span>
              </div>
            </div>
          </div>

          <div v-link="`/my/afilm`" class="user-server-item">
            <div class="user-server-item-left">
              <img class="user-server-item-icon" src="~/assets/image/my/iconServer4.png" />
              <div class="user-server-item-title">我的求片</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/customer`" class="user-server-item">
            <div class="user-server-item-left">
              <img class="user-server-item-icon" src="~/assets/image/my/iconActive5.png" />
              <div class="user-server-item-title">客服中心</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/app-center`" class="user-server-item">
            <div class="user-server-item-left">
              <img class="user-server-item-icon" src="~/assets/image/my/iconServer1.png" />
              <div class="user-server-item-title">应用推荐</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div class="user-server-item" @click="onOpenTg">
            <div class="user-server-item-left">
              <img class="user-server-item-icon" src="~/assets/image/my/iconServer2.png" />
              <div class="user-server-item-title">官方聊骚群</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/my/feedback`" class="user-server-item">
            <div class="user-server-item-left">
              <img class="user-server-item-icon" src="~/assets/image-icon/gift.png" />
              <div class="user-server-item-title">有奖反馈</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
          <div v-link="`/setting`" class="user-server-item">
            <div class="user-server-item-left">
              <img class="user-server-item-icon" src="~/assets/image/my/iconServer3.png" />
              <div class="user-server-item-title">设置</div>
            </div>
            <div class="user-server-item-right"></div>
          </div>
        </div>
        <!-- 设置 end -->
      </div>
    </scroll-list>
  </div>
</template>

<script setup lang="ts">
// 状态
const userStore = useUserStore()
const globalStore = useGlobalStore()
const __ = useNuxtApp()
const { u: user } = storeToRefs(userStore)

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
</style>
