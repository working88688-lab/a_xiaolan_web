<script setup lang="ts">
const __ = useNuxtApp()
const route = useRoute()
const router = useRouter()
const dynamicStore = useDynamicStore()

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

/** 去衣 / 魔法：0处理中 1已完成 2失败；换脸沿用旧口径 1处理中 2已完成 3失败 */
function listStatusParam(type: AiTypeKey, tab: StatusKey): number {
  if (type === 'face') {
    const legacy: Record<StatusKey, number> = { processing: 1, done: 2, failed: 3 }
    return legacy[tab]
  }
  const v: Record<StatusKey, number> = { processing: 0, done: 1, failed: 2 }
  return v[tab]
}

const API_MAP: Record<AiTypeKey, string> = {
  face: 'api/ai/my_face',
  undress: 'api/ai/my_strip',
  magic: 'api/aimagic/my_magic'
}

const POSTER_FIELDS: Record<AiTypeKey, Record<StatusKey, string[]>> = {
  face: {
    processing: ['ground', 'thumb'],
    done: ['face_thumb', 'result_image', 'thumb'],
    failed: ['ground', 'thumb']
  },
  undress: {
    processing: ['thumb'],
    done: ['result_image', 'thumb'],
    failed: ['thumb']
  },
  magic: {
    processing: ['thumb'],
    done: ['result_video', 'thumb'],
    failed: ['thumb']
  }
}

function onDownload(url: string) {
  onWinOpen(__.$GlobalObject._CACHE_IMAGES_MAPS?.[url]?.url)
}

function onPreview(item: any, type: AiTypeKey) {
  if (type === 'face' && statusTab.value === 'done') {
    dynamicStore.update_cache(CACHE_KEY.PREVIEW_AI_FACE, item)
    router.push(`/ai/preview-face?type=2`)
  }
}

const { key } = useKeepAlive({
  reset() {
    aiType.value = 'face'
    statusTab.value = 'processing'
  },
  active() {
    const idx = Number(route.query._index)
    const match = AI_TYPES.find(t => t.index === idx)
    aiType.value = match?.key ?? 'face'
  }
})

const activeApi = computed(() => API_MAP[aiType.value])
const listParams = computed(() => ({ status: listStatusParam(aiType.value, statusTab.value) }))

function resolvePoster(item: Record<string, any>) {
  const fields = POSTER_FIELDS[aiType.value][statusTab.value] || []
  for (const field of fields) {
    if (item?.[field]) return item[field]
  }
  return ''
}
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

    <dx-hoc-list class="ai-record-grid" :api="activeApi" :params="listParams">
      <template #item="{ item }">
        <div class="ai-record-item">
          <dx-cover
            class="ai-record-cover"
            :poster="resolvePoster(item)"
            @click="onPreview(item, aiType)"
          >
            <div v-if="statusTab === 'processing'" class="ai-record-cover-mask">
              <van-loading class="ai-record-cover-loading" type="spinner" />
            </div>
            <div v-if="aiType === 'face' && statusTab === 'done'" class="ai-record-cover-actions">
              <dx-button class="ai-record-save-btn" size="mini" @click.stop="onDownload(item.face_thumb)">
                保存
              </dx-button>
            </div>
          </dx-cover>
          <div class="ai-record-time">时间：{{ item.created_at }}</div>
        </div>
      </template>
    </dx-hoc-list>
  </div>
</template>

<style scoped>
.ai-record-page {
  padding: 12px 12px 24px;
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
  padding: 0;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 1;
  color: #a8a8a8;
}

.ai-record-type-tab.is-active {
  color: #2494ff;
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

.ai-record-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.ai-record-cover {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 12px;
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

.ai-record-time {
  margin-top: 8px;
  font-size: 12px;
  color: #6c6c6c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
