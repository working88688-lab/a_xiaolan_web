<template>
  <div class="follow-recommend">
    <div v-if="!list.length" class="empty-text">暂无推荐用户（mock）</div>

    <div v-for="user in list" :key="user.uid" class="recommend-card">
      <div class="recommend-card-header">
        <div class="user-info">
          <dx-image class="avatar" :src="user.avatar" round></dx-image>
          <span class="nickname">{{ user.nickname }}</span>
        </div>
        <btn-follow :uid="user.uid" :attention="user.is_attention" :use-default-style="true" />
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.video_num) }}</div>
          <div class="stat-label">视频</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.fans_num) }}</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.total_play_num || user.play_num) }}</div>
          <div class="stat-label">播放</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.like_num) }}</div>
          <div class="stat-label">点赞</div>
        </div>
      </div>

      <div v-if="(user.videos || []).length" class="video-list-wrapper">
        <div class="video-list">
          <div v-for="video in (user.videos || []).slice(0, 10)" :key="video.id" class="video-card">
            <dx-image class="video-cover" :src="video.cover || video.thumb"></dx-image>
            <div class="video-info-overlay">
              <span class="play-count">▶ {{ formatNumber(video.play_num || video.play_count) }}</span>
              <span class="duration">
                {{ formatDuration(video.duration || video.duration_sec) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  list: any[]
}>()

const formatNumber = (value: number | string | undefined) => {
  const n = Number(value || 0)
  if (n >= 10000) return (n / 10000).toFixed(1) + 'W'
  return n.toString()
}

const formatDuration = (seconds: number | undefined) => {
  const sec = Number(seconds || 0)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="postcss">
.follow-recommend {
  padding: 0.5rem 0.5rem 0.75rem;
}

.empty-text {
  text-align: center;
  color: #86909c;
  font-size: 13px;
  margin: 12px 0;
}

.recommend-card {
  background: linear-gradient(180deg, #eef5ff 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(15, 71, 161, 0.08);
  margin-bottom: 12px;
}

.recommend-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin-right: 10px;
  overflow: hidden;
}

.nickname {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.stat {
  flex: 1;
  text-align: center;
}

.stat-number {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
}

.stat-label {
  margin-top: 2px;
  font-size: 11px;
  color: #86909c;
}

.video-list-wrapper {
  margin-top: 10px;
  overflow: hidden;
}

.video-list {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 4px;
}

.video-card {
  position: relative;
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
}

.video-cover {
  width: 100%;
  height: 100%;
}

.video-info-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 3px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #ffffff;
  background: linear-gradient(180deg, transparent 0, rgba(0, 0, 0, 0.7) 100%);
}

/* 首页关注 Tab 推荐列表中的“关注”按钮样式 */
:deep(.btn_follow.has_style) {
  background-color: #3da7fd;
  border-color: #3da7fd;
  border-radius: 4px;
}
</style>
