<script setup lang="ts">
const __ = useNuxtApp()
const route = useRoute()
const globalStore = useGlobalStore()
const appConfig = useAppConfig()

type AiTypeKey = 'face' | 'undress' | 'magic'
type StatusKey = 'done' | 'processing' | 'failed'

const aiType = ref<AiTypeKey>('face')
const statusTab = ref<StatusKey>('processing')

const AI_TYPES: Array<{ key: AiTypeKey; title: string; index: number }> = [
  { key: 'face', title: 'AI换脸', index: 1 },
  { key: 'undress', title: 'AI去衣', index: 2 },
  { key: 'magic', title: 'AI魔法', index: 3 }
]

const STATUS_TABS: Array<{ key: StatusKey; title: string }> = [
  { key: 'done', title: '已完成' },
  { key: 'processing', title: '处理中' },
  { key: 'failed', title: '已失败' }
]

function listStatusParam(type: AiTypeKey, tab: StatusKey): number {
  if (type === 'face') {
    const legacy: Record<StatusKey, number> = { processing: 1, done: 2, failed: 3 }
    return legacy[tab]
  }
  const v: Record<StatusKey, number> = { processing: 1, done: 2, failed: 3 }
  return v[tab]
}

const API_MAP: Record<AiTypeKey, string> = {
  face: 'api/ai/my_face',
  undress: 'api/ai/my_strip',
  magic: 'api/aimagic/my_generate_video'
}

const POSTER_FIELDS: Record<AiTypeKey, Record<StatusKey, string[]>> = {
  face: {
    processing: ['ground', 'thumb'],
    done: ['face_thumb', 'result_image', 'thumb'],
    failed: ['ground', 'thumb']
  },
  undress: {
    processing: ['thumb'],
    done: ['strip_thumb', 'thumb'],
    failed: ['thumb']
  },
  magic: {
    processing: ['thumb'],
    done: ['cover', 'thumb'],
    failed: ['thumb']
  }
}

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

function onDownload(url: string) {
  if (!url) return
  onWinOpen(__.$GlobalObject._CACHE_IMAGES_MAPS?.[url]?.url)
}

const showVideoPopup = ref(false)
const activeVideoItem = ref<any>(null)

const listRef = ref<{
  listData: any[]
  refresh_data: () => void
} | null>(null)

/** 全屏看图（图3） */
const previewShow = ref(false)
const previewUrls = ref<string[]>([])
const previewIndex = ref(0)

function resolvePoster(item: Record<string, any>) {
  const fields = POSTER_FIELDS[aiType.value][statusTab.value] || []
  for (const field of fields) {
    if (item?.[field]) return item[field]
  }
  return ''
}

function openFullscreenFromIndex(index: number) {
  const list = listRef.value?.listData ?? []
  if (!list.length) return
  /** 与列表行一一对应，避免筛选后下标错位 */
  previewUrls.value = list.map(it => resolveMediaUrl(resolvePoster(it)))
  const hasAny = previewUrls.value.some(Boolean)
  if (!hasAny) return
  previewIndex.value = Math.min(Math.max(0, index), list.length - 1)
  previewShow.value = true
}

function closeFullscreen() {
  previewShow.value = false
}

function onFullscreenSave() {
  const list = listRef.value?.listData ?? []
  const item = list[previewIndex.value]
  if (!item) return
  if (aiType.value === 'face') {
    const u = item.face_thumb || item.result_image || item.thumb
    if (u) onDownload(u)
  } else if (aiType.value === 'undress') {
    const u = item.strip_thumb || item.thumb
    if (u) onDownload(u)
  } else if (aiType.value === 'magic') {
    if (item.down_url) onWinOpen(item.down_url)
    else {
      const u = resolvePoster(item)
      if (u) onDownload(u)
    }
  }
}

function openMagicVideoPopup(item: any) {
  activeVideoItem.value = item
  showVideoPopup.value = true
}

function onCoverAreaClick(item: any, index: number) {
  openFullscreenFromIndex(index)
}

const { key } = useKeepAlive({
  reset() {
    aiType.value = 'face'
    statusTab.value = 'processing'
    previewShow.value = false
  },
  active() {
    const idx = Number(route.query._index)
    const match = AI_TYPES.find(t => t.index === idx)
    aiType.value = match?.key ?? 'face'
  }
})

const activeApi = computed(() => API_MAP[aiType.value])
const listParams = computed(() => ({ status: listStatusParam(aiType.value, statusTab.value) }))
</script>

<template>
  <div :key="key" class="ai-record-page">
    <div class="ai-record-type-tabs">
      <button
        v-for="t in AI_TYPES"
        :key="t.key"
        class="ai-record-type-tab"
        :class="{ 'is-active': aiType === t.key }"
        type="button"
        @click="aiType = t.key"
      >
        {{ t.title }}
      </button>
    </div>

    <div class="ai-record-status-tabs">
      <button
        v-for="s in STATUS_TABS"
        :key="s.key"
        class="ai-record-status-tab"
        :class="{ 'is-active': statusTab === s.key }"
        type="button"
        @click="statusTab = s.key"
      >
        {{ s.title }}
      </button>
    </div>

    <dx-hoc-list
      ref="listRef"
      class="ai-record-grid"
      :api="activeApi"
      :params="listParams"
      :pullup="true"
    >
      <template #item="{ item, index }">
        <div class="ai-record-item">
          <dx-cover
            class="ai-record-cover"
            :poster="resolveMediaUrl(resolvePoster(item))"
            @click="onCoverAreaClick(item, index)"
          >
            <div v-if="statusTab === 'processing'" class="ai-record-cover-mask">
              <van-loading class="ai-record-cover-loading" type="spinner" />
            </div>
            <div v-if="statusTab === 'done'" class="ai-record-cover-actions">
              <dx-button
                v-if="aiType === 'face'"
                class="ai-record-save-btn"
                size="mini"
                @click.stop="onDownload(item.face_thumb)"
              >保存</dx-button>
              <dx-button
                v-else-if="aiType === 'undress'"
                class="ai-record-save-btn"
                size="mini"
                @click.stop="onDownload(item.strip_thumb)"
              >保存</dx-button>
              <dx-button
                v-else-if="aiType === 'magic'"
                class="ai-record-save-btn ai-record-save-btn--magic"
                size="mini"
                @click.stop="onWinOpen(item.down_url)"
              >保存</dx-button>
            </div>
            <div
              v-if="aiType === 'magic' && statusTab === 'done' && item.video"
              class="ai-record-play-icon"
              @click.stop="openMagicVideoPopup(item)"
            >
              ▶
            </div>
          </dx-cover>
          <div class="ai-record-time">提交时间：{{ item.created_at }}</div>
        </div>
      </template>
    </dx-hoc-list>

    <van-popup v-model:show="showVideoPopup" position="bottom" teleport="body" round closeable @closed="activeVideoItem = null">
      <div class="ai-record-video-popup">
        <xg-player
          v-if="activeVideoItem"
          :key="activeVideoItem.id"
          class="ai-record-video-player"
          :active="showVideoPopup"
          :src="activeVideoItem.video"
          :poster="activeVideoItem.cover"
          :autoplay="true"
          :loop="true"
          :short="true"
        />
      </div>
    </van-popup>

    <Teleport to="body">
      <div v-if="previewShow" class="ai-record-fs">
        <button type="button" class="ai-record-fs-close" aria-label="关闭" @click="closeFullscreen">×</button>

        <div class="ai-record-fs-body">
          <van-swipe
            class="ai-record-fs-swipe"
            :initial-swipe="previewIndex"
            :show-indicators="false"
            :loop="false"
            @change="i => (previewIndex = i)"
          >
            <van-swipe-item v-for="(url, i) in previewUrls" :key="`${i}-${url}`" class="ai-record-fs-slide">
              <dx-image class="ai-record-fs-img" :src="url" fit="contain" />
            </van-swipe-item>
          </van-swipe>
        </div>

        <div class="ai-record-fs-footer">
          <span class="ai-record-fs-index">{{ previewIndex + 1 }}/{{ previewUrls.length }}</span>
          <button type="button" class="ai-record-fs-save" @click="onFullscreenSave">保存</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ai-record-page {
  padding: 12px 12px 24px;
  box-sizing: border-box;
}

.ai-record-type-tabs {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 6px;
  margin-bottom: 14px;
}

.ai-record-type-tab {
  border: 0;
  background: transparent;
  padding: 0 2px 6px;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 1;
  color: #a8a8a8;
}

.ai-record-type-tab.is-active {
  color: #2494ff;
  border-bottom: 3px solid #2494ff;
}

.ai-record-status-tabs {
  display: flex;
  gap: 22px;
  margin-bottom: 14px;
}

.ai-record-status-tab {
  border: 0;
  background: transparent;
  padding: 0;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
  color: #a8a8a8;
}

.ai-record-status-tab.is-active {
  color: #111111;
  font-weight: 600;
}

/*
 * 两列网格：class 通过 dx-hoc-list 透传到内部 div，必须用 :deep 才能命中 scoped 子树
 */
.ai-record-page :deep(div.ai-record-grid) {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  row-gap: 14px;
  align-content: start;
  width: 100%;
  box-sizing: border-box;
}

.ai-record-item {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

.ai-record-cover {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 12px;
  background: #e8e8e8;
}

.ai-record-cover-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-record-cover-loading {
  --van-loading-spinner-color: #2d7cff;
  --van-loading-spinner-size: 28px;
}

.ai-record-cover-actions {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8px;
  display: flex;
  justify-content: center;
}

.ai-record-save-btn {
  width: 60px;
}

.ai-record-save-btn--magic {
  background: linear-gradient(90deg, #ffb347 0%, #ff7a45 100%) !important;
  border: none !important;
  color: #fff !important;
}

.ai-record-time {
  margin-top: 8px;
  font-size: 12px;
  color: #6c6c6c;
  line-height: 1.35;
  word-break: break-all;
}

.ai-record-play-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  pointer-events: auto;
  z-index: 4;
}

.ai-record-video-popup {
  padding: 16px 0 32px;
}

.ai-record-video-player {
  width: 100%;
  height: 460px;
}

/* 图3：全屏预览 */
.ai-record-fs {
  position: fixed;
  inset: 0;
  z-index: 4000;
  background: #000;
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.ai-record-fs-close {
  position: absolute;
  top: calc(12px + env(safe-area-inset-top));
  right: 16px;
  z-index: 2;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.ai-record-fs-body {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-record-fs-swipe {
  width: 100%;
  height: 100%;
}

.ai-record-fs-slide {
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  padding: 48px 12px 72px;
}

.ai-record-fs-img {
  max-width: 100%;
  max-height: min(72vh, 100%);
}

.ai-record-fs-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 20px;
  color: #fff;
  font-size: 14px;
}

.ai-record-fs-index {
  opacity: 0.95;
}

.ai-record-fs-save {
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 15px;
  padding: 8px 4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.ai-record-fs-save:active {
  opacity: 0.85;
}
</style>
