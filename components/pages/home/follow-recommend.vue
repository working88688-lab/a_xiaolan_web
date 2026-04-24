<template>
  <div class="follow-recommend">
    <div v-if="!list.length" class="empty-text">暂无推荐用户（mock）</div>

    <div v-for="user in list" :key="user.uid" class="recommend-card">
      <div class="recommend-card-header">
        <div
          v-link="user.uid ? `/userdetail?id=${user.uid}` : ''"
          class="user-info"
          :class="{ 'cursor-pointer': user.uid }"
        >
          <dx-image
            class="avatar"
            :src="resolveMediaUrl(user.avatar_url || user.avatar || user.headimg || user.face_url || user.thumb)"
            round
          ></dx-image>
          <span class="nickname">{{ user.nickname }}</span>
        </div>
        <btn-follow :uid="user.uid" :attention="user.is_followed ?? user.is_attention" :use-default-style="true" />
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.videos_count ?? user.video_num) }}</div>
          <div class="stat-label">视频</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.fans_count ?? user.fans_num) }}</div>
          <div class="stat-label">粉丝</div>
        </div>
        <div class="stat">
          <div class="stat-number">
            {{ formatNumber(user.total_plays ?? user.total_play_num ?? user.play_num) }}
          </div>
          <div class="stat-label">播放</div>
        </div>
        <div class="stat">
          <div class="stat-number">{{ formatNumber(user.total_likes ?? user.like_num) }}</div>
          <div class="stat-label">点赞</div>
        </div>
      </div>

      <div v-if="(user.works || user.videos || []).length" class="video-list-wrapper">
        <div
          class="video-list-scroll"
          @touchstart.stop="onWorksStripTouchStart"
          @touchmove="onWorksStripTouchMove"
          @touchend="onWorksStripTouchEnd"
          @touchcancel="onWorksStripTouchEnd"
        >
          <div class="video-list">
            <div
              v-for="(video, vIdx) in user.works || user.videos || []"
              :key="video.id ?? video.mv_id ?? vIdx"
              class="video-card"
            >
              <dx-image
                class="video-cover"
                :src="resolveMediaUrl(video.cover_thumb || video.cover_thumb_url || video.cover || video.thumb)"
              ></dx-image>
              <div class="video-info-overlay">
                <span class="play-count">▶ {{ formatNumber(video.play_num || video.play_count || video.plays) }}</span>
                <span class="duration">
                  {{ formatDuration(video.duration || video.duration_sec) }}
                </span>
              </div>
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

const globalStore = useGlobalStore()
const appConfig = useAppConfig()

/** 与 my/watched.vue 一致：相对路径需拼到资源域名，否则 worker fetch 会打到前端站点根路径而失败 */
function getMediaOrigin(): string {
  const thumb = globalStore.config?.activity_thumb || globalStore.config?.index_ads_thumb
  if (thumb) {
    try {
      return new URL(thumb).origin
    } catch {
      /* use api host */
    }
  }
  const base = appConfig.api?.baseURL as string | undefined
  if (base) {
    try {
      return new URL(base).origin
    } catch {
      /* ignore */
    }
  }
  return ''
}

function resolveMediaUrl(path: string | undefined): string {
  if (!path?.trim()) return ''
  const p = path.trim()
  if (/^https?:\/\//i.test(p) || p.startsWith('data:') || p.startsWith('blob:')) return p
  if (p.startsWith('//')) {
    if (import.meta.client) return window.location.protocol + p
    return 'https:' + p
  }
  const origin = getMediaOrigin()
  if (!origin) return p
  if (p.startsWith('/')) return origin + p
  return `${origin}/${p}`
}

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

/**
 * 首页 dx-tabs 默认 swipeable，横滑会与作品列表冲突。
 * touchstart.stop 参考 feature-tab-item 里 mid 分类条；再按「横向优先」阻截 touchmove 冒泡，避免外层 tabs 跟手。
 */
let worksStripStartX = 0
let worksStripStartY = 0
let worksStripTracking = false

function onWorksStripTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  worksStripStartX = t.clientX
  worksStripStartY = t.clientY
  worksStripTracking = true
}

function onWorksStripTouchMove(e: TouchEvent) {
  if (!worksStripTracking) return
  const t = e.touches[0]
  if (!t) return
  const dx = t.clientX - worksStripStartX
  const dy = t.clientY - worksStripStartY
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)
  if (ax > 10 && ax > ay) {
    e.stopPropagation()
  }
}

function onWorksStripTouchEnd() {
  worksStripTracking = false
}
</script>

<style scoped lang="postcss">
.follow-recommend {
  padding: 0.5rem 0.3rem 0.75rem;
  min-width: 0;
  box-sizing: border-box;
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
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
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

/* 外层限宽；内层 max-content 撑开宽度，滚动只发生在外层，避免 flex 子项把整页横向撑开 */
.video-list-wrapper {
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.video-list-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
}

.video-list-scroll::-webkit-scrollbar {
  height: 4px;
}

.video-list-scroll::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
}

.video-list {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 8px;
  padding-bottom: 4px;
  width: max-content;
  max-width: none;
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
