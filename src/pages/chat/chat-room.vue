<script setup lang="ts">
import { useId } from 'vue'

const route = useRoute()
const router = useRouter()
const __ = useNuxtApp()

const recordCancelArcPathId = useId()

interface TalkProductItem {
  id: number
  name: string
  price: number
  promo_price: number
  duration: number
  free_duration: number
  icon_url: string
}

const matchInfoLoading = ref(false)
/** 对方头像（get_match_info thumb / avatar） */
const peerAvatar = ref('')
const peerVoiceUrl = ref('')
const peerVoiceDuration = ref('0"')
const peerVoicePlaying = ref(false)
const peerVoiceAudioRef = useTemplateRef<HTMLAudioElement>('peerVoiceAudioRef')

/** /api/talk/talk_info */
const talkInfoLoaded = ref(false)
const leftTime = ref(0)
const isTimeout = ref(0)

const showRecharge = ref(false)
const products = ref<TalkProductItem[]>([])
const productsLoading = ref(false)
const selectedProductId = ref<number | null>(null)
const buying = ref(false)

const title = computed(() => {
  const q = route.query.name
  if (typeof q === 'string' && q) return String(q).slice(0, 12)
  return '聊天室'
})

const leftTimeLabel = computed(() => {
  if (!talkInfoLoaded.value) return '…'
  return String(Math.max(0, Math.floor(Number(leftTime.value) || 0)))
})

const showInsufficientTip = computed(() => {
  if (!talkInfoLoaded.value) return false
  if (Number(isTimeout.value) === 1) return true
  return Number(leftTime.value) <= 0
})

const composerMode = ref<'text' | 'voice'>('text')
const showMore = ref(false)

const isUploadingImage = ref(false)
const albumInputRef = useTemplateRef<HTMLInputElement>('albumInputRef')
const cameraInputRef = useTemplateRef<HTMLInputElement>('cameraInputRef')

function resetAndClickInput(el: HTMLInputElement | null | undefined) {
  if (!el) return
  // iOS: 必须在用户点击回调的同步栈内触发 click()
  try {
    el.value = ''
  } catch {
    /* ignore */
  }
  el.click()
}

function pickFromAlbum() {
  if (isUploadingImage.value) return
  showMore.value = false
  resetAndClickInput(albumInputRef.value)
}

function pickFromCamera() {
  if (isUploadingImage.value) return
  showMore.value = false
  resetAndClickInput(cameraInputRef.value)
}

async function onPickedImage(e: Event) {
  const input = e.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  if (showInsufficientTip.value) {
    __.$Toast('聊天时长不足，请先充值')
    return
  }

  isUploadingImage.value = true
  try {
    const compressed = (await __.$ImageCompression.compressor(file)) as File
    const url = (await __.$Api.uploadImage({ file: compressed, useCompress: false })) as unknown as string
    if (!url) throw new Error('图片上传失败')
    __.$Toast('图片已发送')
    void fetchTalkInfo()
  } catch (err) {
    console.error('[chat-room] 图片上传失败', err)
    __.$Toast(scircleErrMsg(err))
  } finally {
    isUploadingImage.value = false
    if (input) {
      try {
        input.value = ''
      } catch {
        /* ignore */
      }
    }
  }
}

function productPayCoins(p: TalkProductItem): number {
  const promo = Number(p.promo_price)
  const price = Number(p.price)
  if (Number.isFinite(promo) && promo > 0 && (!Number.isFinite(price) || promo <= price)) return Math.round(promo)
  return Number.isFinite(price) ? Math.round(price) : 0
}

function voiceUrlFromApiItem(item: any): string {
  const u = item?.voice ?? item?.voice_url ?? item?.audio_url ?? item?.audio ?? item?.voice_file ?? ''
  return typeof u === 'string' ? u.trim() : String(u || '').trim()
}

function voiceDurationLabelFromApi(item: any): string {
  const v = item?.voice_duration ?? item?.voice_len ?? item?.voice_time ?? item?.duration
  if (v == null || v === '') return '0"'
  if (typeof v === 'number' && Number.isFinite(v)) return `${Math.round(v)}"`
  const s = String(v).trim()
  if (s.includes('"')) return s
  const n = Number(s)
  return Number.isFinite(n) ? `${Math.round(n)}"` : '0"'
}

function scircleErrMsg(err: unknown): string {
  if (err == null) return '请求失败'
  if (typeof err === 'string') return err
  const e = err as Record<string, any>
  if (e.msg != null && String(e.msg).trim() !== '') return String(e.msg)
  if (e.message != null && String(e.message).trim() !== '') return String(e.message)
  const ax = e.response?.data
  if (ax && typeof ax === 'object' && ax.msg != null && String(ax.msg).trim() !== '') return String(ax.msg)
  if (e instanceof Error && e.message) return e.message
  return '请求失败'
}

async function fetchMatchPeerVoice() {
  const uidRaw = route.query.uid
  const scoreRaw = route.query.score ?? route.query.scoreNum
  const thumbRaw = route.query.thumb
  const uid = typeof uidRaw === 'string' ? uidRaw.trim() : Array.isArray(uidRaw) ? String(uidRaw[0] ?? '').trim() : ''
  const scoreNum = Number(typeof scoreRaw === 'string' ? scoreRaw : Array.isArray(scoreRaw) ? scoreRaw[0] : scoreRaw)
  const uidNum = Number(uid)
  // score 可能来自「同圈」(带 score) 或其它入口（不带 score）；不带时兜底 0 也允许拉详情
  if (!uid || !Number.isFinite(uidNum)) {
    return
  }

  matchInfoLoading.value = true
  try {
    const res = await __.$Api.Community.usersmatchGetMatchInfo({
      uid: uidNum,
      score: Math.round(Number.isFinite(scoreNum) ? scoreNum : 0)
    })
    console.log(
      '%c[chat-room] POST /api/usersmatch/get_match_info 结果',
      'font-weight:bold;color:#1677ff',
      res
    )
    console.log('[chat-room] get_match_info data 字段：', res?.data)
    const detail = res?.data || {}
    peerAvatar.value = String(detail?.thumb ?? detail?.avatar_url ?? detail?.avatar ?? '').trim()
    if (!peerAvatar.value) {
      const t =
        typeof thumbRaw === 'string'
          ? thumbRaw.trim()
          : Array.isArray(thumbRaw)
            ? String(thumbRaw[0] ?? '').trim()
            : ''
      if (t) peerAvatar.value = t
    }
    const vUrl = voiceUrlFromApiItem(detail)
    peerVoiceUrl.value = vUrl
    const dur = voiceDurationLabelFromApi(detail)
    peerVoiceDuration.value = dur !== '0"' ? dur : '0"'
  } catch (e) {
    console.error('[chat-room] get_match_info', e)
    __.$Toast(scircleErrMsg(e))
  } finally {
    matchInfoLoading.value = false
  }
}

function togglePeerVoicePlay() {
  const el = peerVoiceAudioRef.value
  const url = peerVoiceUrl.value
  if (!el || !url) return
  if (peerVoicePlaying.value) el.pause()
  else void el.play().catch(() => __.$Toast('语音播放失败'))
}

async function fetchTalkInfo() {
  try {
    const res = await __.$Api.Community.talkInfo({})
    const d = res?.data || {}
    leftTime.value = Number(d?.left_time ?? 0)
    isTimeout.value = Number(d?.is_timeout ?? 0)
  } catch (e) {
    console.error('[chat-room] talk_info', e)
    __.$Toast(scircleErrMsg(e))
  } finally {
    talkInfoLoaded.value = true
  }
}

async function loadProductList() {
  productsLoading.value = true
  try {
    const res = await __.$Api.Community.talkProductList({})
    const raw = res?.data
    const list = Array.isArray(raw) ? raw : []
    products.value = list
      .map((it: any) => ({
        id: Number(it?.id),
        name: String(it?.name ?? ''),
        price: Number(it?.price ?? 0),
        promo_price: Number(it?.promo_price ?? 0),
        duration: Number(it?.duration ?? 0),
        free_duration: Number(it?.free_duration ?? 0),
        icon_url: String(it?.icon_url ?? '').trim()
      }))
      .filter(p => Number.isFinite(p.id) && p.id > 0)
    if (products.value.length) {
      const exists = products.value.some(p => p.id === selectedProductId.value)
      if (!exists) selectedProductId.value = products.value[0].id
    } else {
      selectedProductId.value = null
    }
  } catch (e) {
    console.error('[chat-room] product_list', e)
    __.$Toast(scircleErrMsg(e))
    products.value = []
  } finally {
    productsLoading.value = false
  }
}

async function openRecharge() {
  showMore.value = false
  showRecharge.value = true
  if (!products.value.length && !productsLoading.value) {
    await loadProductList()
  }
}

async function onConfirmBuyTime() {
  const id = selectedProductId.value
  if (id == null || buying.value) return
  buying.value = true
  try {
    await __.$Api.Community.talkBuyTime({ product_id: id })
    showRecharge.value = false
    await fetchTalkInfo()
  } catch (e) {
    console.error('[chat-room] buy_time', e)
    __.$Toast(scircleErrMsg(e))
  } finally {
    buying.value = false
  }
}

onMounted(() => {
  void Promise.all([fetchMatchPeerVoice(), fetchTalkInfo()])
})

function abortChatRecording() {
  if (!showRecordOverlay.value) return
  recordGenRef.value++
  showRecordOverlay.value = false
  isMouseDown.value = false
  isRecordCancel.value = false
  const rec = mediaRecorderRef.value
  mediaRecorderRef.value = null
  recordChunksRef.value = []
  stopMediaStream()
  if (rec && rec.state !== 'inactive') {
    try {
      rec.stop()
    } catch {
      /* ignore */
    }
  }
}

function onBack() {
  peerVoiceAudioRef.value?.pause()
  abortChatRecording()
  router.back()
}

function toggleMode() {
  composerMode.value = composerMode.value === 'text' ? 'voice' : 'text'
  showMore.value = false
}

function toggleMore() {
  showMore.value = !showMore.value
}

/** —— 与同圈 scircle-tab 一致的按住录音 UI —— */
const showRecordOverlay = ref(false)
const isRecordCancel = ref(false)
const cancelRef = useTemplateRef<HTMLElement>('cancelRef')
const isMouseDown = ref(false)
const mediaRecorderRef = ref<MediaRecorder | null>(null)
const mediaStreamRef = ref<MediaStream | null>(null)
const recordChunksRef = ref<Blob[]>([])
const isRecordInitializing = ref(false)
const recordGenRef = ref(0)
const isUploadingVoice = ref(false)

function pickAudioRecorderMime(): string {
  if (typeof MediaRecorder === 'undefined') return ''
  const list = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  for (const t of list) {
    if (MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}

async function uploadVoiceToServer(file: File): Promise<string> {
  const url = (await __.$Api.uploadVideo(file)) as unknown as string
  return String(url || '')
}

function isInCancelArea(clientX: number, clientY: number) {
  const el = cancelRef.value
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
}

function stopMediaStream() {
  const s = mediaStreamRef.value
  if (s) {
    s.getTracks().forEach(t => t.stop())
    mediaStreamRef.value = null
  }
}

async function onRecordStart(e: TouchEvent | MouseEvent) {
  if (isUploadingVoice.value) return
  if (showInsufficientTip.value) {
    __.$Toast('聊天时长不足，请先充值')
    return
  }
  if (isRecordInitializing.value || (mediaRecorderRef.value && mediaRecorderRef.value.state === 'recording')) return

  const gen = ++recordGenRef.value
  showMore.value = false

  if (e instanceof MouseEvent) {
    isMouseDown.value = true
  }
  showRecordOverlay.value = true
  isRecordCancel.value = false
  if (e instanceof TouchEvent) {
    const t = e.touches?.[0]
    if (t) isRecordCancel.value = isInCancelArea(t.clientX, t.clientY)
  }

  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    showRecordOverlay.value = false
    __.$Toast('当前环境不支持录音')
    return
  }

  isRecordInitializing.value = true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    if (gen !== recordGenRef.value) {
      stream.getTracks().forEach(t => t.stop())
      return
    }
    mediaStreamRef.value = stream
    recordChunksRef.value = []
    const mime = pickAudioRecorderMime()
    const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
    rec.ondataavailable = ev => {
      if (ev.data.size > 0) recordChunksRef.value.push(ev.data)
    }
    rec.start(120)
    mediaRecorderRef.value = rec
  } catch (err) {
    stopMediaStream()
    mediaRecorderRef.value = null
    showRecordOverlay.value = false
    isMouseDown.value = false
    __.$Toast(scircleErrMsg(err) || '无法使用麦克风')
  } finally {
    isRecordInitializing.value = false
  }
}

function onRecordMove(e: TouchEvent) {
  const t = e.touches?.[0]
  if (!t) return
  isRecordCancel.value = isInCancelArea(t.clientX, t.clientY)
}

function onRecordMouseMove(e: MouseEvent) {
  if (!isMouseDown.value) return
  isRecordCancel.value = isInCancelArea(e.clientX, e.clientY)
}

async function onRecordEnd() {
  if (!showRecordOverlay.value) return
  recordGenRef.value++
  const cancelled = isRecordCancel.value
  showRecordOverlay.value = false
  isMouseDown.value = false
  isRecordCancel.value = false

  const rec = mediaRecorderRef.value
  mediaRecorderRef.value = null
  const chunks = [...recordChunksRef.value]
  recordChunksRef.value = []
  stopMediaStream()

  if (!rec || rec.state === 'inactive') {
    return
  }

  await new Promise<void>(resolve => {
    rec.onstop = () => resolve()
    try {
      rec.stop()
    } catch {
      resolve()
    }
  })

  if (cancelled || !chunks.length) {
    return
  }

  const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' })
  if (blob.size < 80) {
    __.$Toast('录音过短')
    return
  }

  const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('webm') ? 'webm' : 'webm'
  const file = new File([blob], `voice.${ext}`, { type: blob.type || 'audio/webm' })

  isUploadingVoice.value = true
  try {
    await uploadVoiceToServer(file)
    __.$Toast('语音已发送')
    void fetchTalkInfo()
  } catch (error) {
    console.error('[chat-room] 语音上传失败', error)
    __.$Toast(scircleErrMsg(error))
  } finally {
    isUploadingVoice.value = false
  }
}
</script>

<template>
  <div class="chat-room">
    <dx-navbar class="chat-navbar" @click-left="onBack">
      <template #title>
        <div class="chat-title">{{ title }}</div>
      </template>
      <template #right>
        <button class="chat-right-pill" type="button" @click="openRecharge">
          <span class="chat-right-text">可发送消息数量：{{ leftTimeLabel }}</span>
          <span class="chat-right-plus" aria-hidden="true">＋</span>
        </button>
      </template>
    </dx-navbar>

    <div class="chat-tip">请勿发送广告等违规消息，谨防私下交易上当受骗。违规用户将被永久禁言处理。</div>

    <div class="chat-body">
      <div v-if="showInsufficientTip" class="chat-insufficient">
        <span class="chat-insufficient-text">您的聊天时长已不足，补充时间，</span>
        <button class="chat-insufficient-link" type="button" @click="openRecharge">充值金币</button>
      </div>

      <div v-if="matchInfoLoading" class="chat-match-loading">加载中…</div>

      <div v-else-if="peerVoiceUrl" class="chat-msg">
        <img
          v-if="peerAvatar"
          class="chat-avatar chat-avatar-img"
          :key="peerAvatar"
          v-lazyLoad="peerAvatar"
          src="~/assets/image/img_loading.png"
          alt=""
        />
        <div v-else class="chat-avatar" />
        <button class="chat-voice" type="button" @click="togglePeerVoicePlay">
          <div class="chat-voice-icon" />
          <div class="chat-voice-bars" :class="{ 'is-playing': peerVoicePlaying }">
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
          </div>
          <div class="chat-voice-dur">{{ peerVoiceDuration }}</div>
        </button>
        <audio
          ref="peerVoiceAudioRef"
          class="chat-peer-audio"
          :src="peerVoiceUrl"
          preload="metadata"
          @play="peerVoicePlaying = true"
          @pause="peerVoicePlaying = false"
          @ended="peerVoicePlaying = false"
        />
      </div>
    </div>

    <div class="chat-composer-wrap">
      <div class="chat-composer" :class="{ 'is-voice-mode': composerMode === 'voice' }">
        <button class="chat-mode" type="button" @click="toggleMode">
          <span v-if="composerMode === 'text'" class="chat-mode-icon">🔊</span>
          <span v-else class="chat-mode-icon">⌨</span>
        </button>

        <div class="chat-input-area">
          <input
            v-if="composerMode === 'text'"
            class="chat-input"
            type="text"
            placeholder="说点好听的吧～"
            @focus="showMore = false"
          />
          <button
            v-else
            class="chat-press-talk"
            type="button"
            :disabled="isUploadingVoice"
            @touchstart.prevent="onRecordStart"
            @touchmove.prevent="onRecordMove"
            @touchend.prevent="onRecordEnd"
            @touchcancel.prevent="onRecordEnd"
            @mousedown.prevent="onRecordStart"
            @mousemove.prevent="onRecordMouseMove"
            @mouseup.prevent="onRecordEnd"
            @mouseleave.prevent="onRecordEnd"
          >
            {{ isUploadingVoice ? '发送中…' : '按住说话' }}
          </button>
        </div>

        <button class="chat-plus" type="button" @click="toggleMore">+</button>
      </div>

      <div v-if="showMore" class="chat-more">
        <button class="chat-more-item" type="button" :disabled="isUploadingImage" @click="pickFromAlbum">
          <div class="chat-more-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_67_5592)">
                <path
                  d="M41.7223 3.42578H6.28599C2.82116 3.42578 0 6.24619 0 9.71177V38.2893C0 41.7544 2.82046 44.5749 6.28599 44.5749H41.7216C45.1866 44.5749 48.0078 41.7549 48.0078 38.2893V9.71177C48.0074 6.24619 45.1867 3.42578 41.7223 3.42578ZM12.0024 11.9986C12.4527 11.9984 12.8987 12.0871 13.3148 12.2594C13.7309 12.4317 14.1089 12.6843 14.4273 13.0028C14.7458 13.3212 14.9984 13.6993 15.1706 14.1154C15.3429 14.5315 15.4315 14.9774 15.4313 15.4277C15.4315 15.8781 15.3429 16.324 15.1706 16.7401C14.9984 17.1562 14.7458 17.5343 14.4273 17.8527C14.1089 18.1711 13.7308 18.4237 13.3148 18.596C12.8987 18.7682 12.4527 18.8568 12.0024 18.8566C10.1093 18.8566 8.57331 17.3223 8.57331 15.4278C8.57331 13.5334 10.1095 11.9986 12.0024 11.9986ZM41.1491 36.0023C41.1491 36.9504 40.3829 37.6892 39.4341 37.6892L8.67561 37.7162H8.65617C8.11639 37.7162 7.6048 37.4859 7.28062 37.0527C7.11926 36.8387 7.01134 36.5892 6.96583 36.325C6.92032 36.0608 6.93855 35.7896 7.01898 35.5339C7.14265 35.1322 10.1412 25.7 16.6661 25.7C18.7062 25.7478 20.2786 26.226 21.7977 26.6816C23.7107 27.2557 25.5763 27.7499 27.6735 27.4187C28.7688 27.2424 29.2214 26.143 29.9949 23.6714C31.0158 20.4137 32.5567 15.4882 39.3533 15.4882C40.2921 15.4882 41.0562 16.2434 41.0677 17.1821L41.1482 23.9799V36.0023H41.1491Z"
                  fill="#4C4C4C"
                />
              </g>
              <defs>
                <clipPath id="clip0_67_5592">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="chat-more-text">{{ isUploadingImage ? '上传中…' : '图片' }}</div>
        </button>
        <button class="chat-more-item" type="button" :disabled="isUploadingImage" @click="pickFromCamera">
          <div class="chat-more-icon">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 6C31.5524 5.99994 33.0444 6.60157 34.1625 7.67847C35.2806 8.75537 35.9378 10.2237 35.996 11.775L36 12H41C42.5913 12 44.1174 12.6321 45.2426 13.7574C46.3679 14.8826 47 16.4087 47 18V38C47 39.5913 46.3679 41.1174 45.2426 42.2426C44.1174 43.3679 42.5913 44 41 44H9C7.4087 44 5.88258 43.3679 4.75736 42.2426C3.63214 41.1174 3 39.5913 3 38V18C3 16.4087 3.63214 14.8826 4.75736 13.7574C5.88258 12.6321 7.4087 12 9 12L14 11.999L14.004 11.775C14.0622 10.2237 14.7194 8.75537 15.8375 7.67847C16.9556 6.60157 18.4476 5.99994 20 6H30Z"
                fill="#4C4C4C"
              />
              <path
                d="M39 18C39 18.5304 39.2107 19.0391 39.5858 19.4142C39.9609 19.7893 40.4696 20 41 20C41.5304 20 42.0391 19.7893 42.4142 19.4142C42.7893 19.0391 43 18.5304 43 18C43 17.4696 42.7893 16.9609 42.4142 16.5858C42.0391 16.2107 41.5304 16 41 16C40.4696 16 39.9609 16.2107 39.5858 16.5858C39.2107 16.9609 39 17.4696 39 18Z"
                fill="white"
              />
              <path
                d="M18.5 28C18.5 29.7239 19.1848 31.3772 20.4038 32.5962C21.6228 33.8152 23.2761 34.5 25 34.5C26.7239 34.5 28.3772 33.8152 29.5962 32.5962C30.8152 31.3772 31.5 29.7239 31.5 28C31.5 26.2761 30.8152 24.6228 29.5962 23.4038C28.3772 22.1848 26.7239 21.5 25 21.5C23.2761 21.5 21.6228 22.1848 20.4038 23.4038C19.1848 24.6228 18.5 26.2761 18.5 28Z"
                fill="white"
              />
            </svg>
          </div>
          <div class="chat-more-text">相机</div>
        </button>
      </div>
    </div>

    <input ref="albumInputRef" class="sr-only" type="file" accept="image/*" @change="onPickedImage" />
    <input
      ref="cameraInputRef"
      class="sr-only"
      type="file"
      accept="image/*"
      capture="environment"
      @change="onPickedImage"
    />

    <!-- 与同圈 scircle-tab 一致的录音遮罩（Teleport + 波形/取消/松开发送/底弧麦克风） -->
    <Teleport to="body">
      <div v-if="showRecordOverlay" class="scircle-record-overlay">
        <div class="scircle-record-dim">
          <div class="scircle-record-actions" :class="{ 'is-cancel-mode': isRecordCancel }">
            <div class="scircle-record-voice" :class="{ 'is-cancel': isRecordCancel }">
              <div class="scircle-record-bars">
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
                <span class="bar" />
              </div>
            </div>

            <div class="scircle-record-cancel-wrap">
              <svg
                v-if="isRecordCancel"
                class="scircle-record-cancel-arc-text"
                viewBox="0 0 120 36"
                aria-hidden="true"
              >
                <defs>
                  <path :id="recordCancelArcPathId" d="M 8 28 Q 60 4 112 28" fill="none" />
                </defs>
                <text class="scircle-record-cancel-arc-fill" text-anchor="middle">
                  <textPath :href="`#${recordCancelArcPathId}`" startOffset="50%">松手 取消</textPath>
                </text>
              </svg>
              <div ref="cancelRef" class="scircle-record-cancel" :class="{ 'is-active': isRecordCancel }">取消</div>
            </div>
          </div>
          <div class="scircle-record-tip">松开发送</div>
        </div>
        <div class="scircle-record-arch" aria-hidden="true">
          <svg class="scircle-record-mic-icon" width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path
              d="M28 36c4.42 0 8-3.58 8-8V18c0-4.42-3.58-8-8-8s-8 3.58-8 8v10c0 4.42 3.58 8 8 8z"
              stroke="currentColor"
              stroke-width="2.2"
            />
            <path
              d="M18 26v2c0 5.52 4.48 10 10 10s10-4.48 10-10v-2"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
            />
            <path d="M28 40v6M22 46h12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            <path
              d="M38 22c0-5.52-4.48-10-10-10M18 22c0-5.52 4.48-10 10-10"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              opacity="0.45"
            />
          </svg>
        </div>
      </div>
    </Teleport>

    <van-popup
      v-model:show="showRecharge"
      position="bottom"
      teleport="body"
      round
      class="chat-recharge-popup"
      :close-on-click-overlay="true"
    >
      <div class="chat-recharge">
        <div class="chat-recharge-title">充值金币与购买会员</div>

        <div v-if="productsLoading" class="chat-recharge-loading">加载套餐中…</div>
        <div v-else class="chat-recharge-grid">
          <button
            v-for="p in products"
            :key="p.id"
            type="button"
            class="chat-recharge-card"
            :class="{ 'is-selected': selectedProductId === p.id }"
            @click="selectedProductId = p.id"
          >
            <div class="chat-recharge-card-icon">
              <img v-if="p.icon_url" :src="p.icon_url" alt="" />
              <span v-else class="chat-recharge-card-placeholder">套餐</span>
            </div>
            <div class="chat-recharge-card-name">{{ p.name || '套餐' }}</div>
            <div v-if="p.duration > 0" class="chat-recharge-card-dur">{{ p.duration }} 小时</div>
            <div class="chat-recharge-card-price">
              <template v-if="p.promo_price > 0 && p.promo_price < p.price">
                <span class="chat-recharge-price-promo">{{ productPayCoins(p) }} 金币</span>
                <span class="chat-recharge-price-old">{{ p.price }} 金币</span>
              </template>
              <template v-else>
                <span>{{ productPayCoins(p) }} 金币</span>
              </template>
            </div>
          </button>
        </div>

        <div class="chat-recharge-vip-hint">
          成为会员后，可无限发布消息，
          <span class="chat-recharge-link">去购买会员</span>
        </div>

        <div class="chat-recharge-footer">
          <span class="chat-recharge-link" role="button" tabindex="0" @click="openRecharge">充值金币</span>
        </div>

        <button
          class="chat-recharge-submit"
          type="button"
          :disabled="buying || selectedProductId == null || !products.length"
          @click="onConfirmBuyTime"
        >
          {{ buying ? '支付中…' : '确认支付' }}
        </button>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.sr-only {
  position: fixed;
  width: 1px;
  height: 1px;
  left: -9999px;
  top: -9999px;
  opacity: 0;
  pointer-events: none;
}

.chat-room {
  min-height: 100vh;
  background: transparent;
  display: flex;
  flex-direction: column;
}

.chat-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #111;
}

.chat-navbar :deep(.van-nav-bar) {
  background: linear-gradient(180deg, #cfe9ff 0%, #ffffff 78%) !important;
}

.chat-navbar :deep(.van-nav-bar__content) {
  height: 48px;
}

.chat-navbar :deep(.van-nav-bar__left) {
  padding-left: 8px;
}

.chat-navbar :deep(.van-nav-bar__right) {
  padding-right: 8px;
}

.chat-right-pill {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  max-width: 52vw;
  background: #e6f4ff;
  border: 1px solid #e6f4ff;
  border-radius: 999px;
  padding: 3px 5px;
  cursor: pointer;
  font: inherit;
  -webkit-tap-highlight-color: transparent;
}

.chat-right-pill:active {
  opacity: 0.92;
}

.chat-right-text {
  font-size: 11px;
  color: #2494ff;
  white-space: nowrap;
}

.chat-right-plus {
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: rgba(36, 148, 255, 0.12);
  color: #2494ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 18px;
}

.chat-tip {
  padding: 8px 12px;
  font-size: 11px;
  line-height: 16px;
  color: #d81e06;
  background: transparent;
}

.chat-insufficient {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f5f5f5;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
}

.chat-insufficient-text {
  color: #666;
}

.chat-insufficient-link {
  border: 0;
  padding: 0;
  background: none;
  color: #2494ff;
  font-size: inherit;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 12px 12px 0;
  box-sizing: border-box;
  overflow: auto;
  background: #ffffff;
}

.chat-match-loading {
  font-size: 13px;
  color: #999;
  padding: 8px 0;
}

.chat-msg {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.chat-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e6e6e6;
  flex: 0 0 auto;
}

.chat-avatar-img {
  object-fit: cover;
  display: block;
}

.chat-peer-audio {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.chat-voice {
  height: 34px;
  min-width: 220px;
  max-width: 78%;
  border-radius: 10px;
  background: #16c60c;
  display: grid;
  grid-template-columns: 20px 1fr 32px;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.chat-voice-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.9;
}

.chat-voice-bars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chat-voice-bars .bar {
  width: 3px;
  height: 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  transform-origin: center bottom;
}

.chat-voice-bars.is-playing .bar {
  animation: chatPeerVoiceBar 720ms infinite ease-in-out;
}

.chat-voice-bars.is-playing .bar:nth-child(2) {
  animation-delay: 90ms;
  height: 13px;
}
.chat-voice-bars.is-playing .bar:nth-child(3) {
  animation-delay: 180ms;
  height: 16px;
}
.chat-voice-bars.is-playing .bar:nth-child(4) {
  animation-delay: 270ms;
  height: 13px;
}
.chat-voice-bars.is-playing .bar:nth-child(5) {
  animation-delay: 360ms;
}
.chat-voice-bars.is-playing .bar:nth-child(6) {
  animation-delay: 450ms;
  height: 13px;
}

@keyframes chatPeerVoiceBar {
  0%,
  100% {
    transform: scaleY(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scaleY(1.25);
    opacity: 1;
  }
}

.chat-voice-dur {
  text-align: right;
  font-size: 12px;
  color: #fff;
}

.chat-composer-wrap {
  background: #e3e3e3;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.chat-composer {
  height: 54px;
  padding: 8px 10px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 38px 1fr 38px;
  gap: 10px;
  align-items: center;
}

.chat-mode {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: #ffffff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-mode-icon {
  font-size: 18px;
  line-height: 1;
}

.chat-input-area {
  height: 38px;
  border-radius: 19px;
  background: #ffffff;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.chat-composer.is-voice-mode .chat-input-area {
  background: transparent;
}

.chat-input {
  height: 38px;
  border: 0;
  background: #ffffff;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  width: 100%;
}

.chat-press-talk {
  width: 100%;
  height: 38px;
  border: 0;
  border-radius: 19px;
  background: #ffffff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.chat-press-talk:disabled {
  opacity: 0.65;
}

/* 与同圈 scircle-tab 录音遮罩一致（类名沿用便于对照） */
.scircle-record-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
  max-width: 100vw;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.45);
}

.scircle-record-dim {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px 20px;
  box-sizing: border-box;
}

.scircle-record-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 340px;
  transition: gap 0.2s ease;
}

.scircle-record-actions.is-cancel-mode {
  justify-content: flex-end;
  padding-right: 8px;
  gap: 14px;
}

.scircle-record-voice {
  width: min(236px, 72vw);
  height: 54px;
  border-radius: 10px;
  background: #2494ff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  transition:
    width 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.scircle-record-voice::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #2494ff;
  transition: border-top-color 0.2s ease;
}

.scircle-record-voice.is-cancel {
  width: 120px;
  background: #ff3b30;
  transform: translateX(6px);
}

.scircle-record-voice.is-cancel::after {
  border-top-color: #ff3b30;
}

.scircle-record-bars {
  display: flex;
  align-items: center;
  gap: 6px;
}

.scircle-record-bars .bar {
  width: 6px;
  height: 16px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  animation: chatRoomRecordBar 900ms infinite ease-in-out;
}

.scircle-record-bars .bar:nth-child(2) {
  animation-delay: 120ms;
  height: 22px;
}
.scircle-record-bars .bar:nth-child(3) {
  animation-delay: 240ms;
  height: 28px;
}
.scircle-record-bars .bar:nth-child(4) {
  animation-delay: 360ms;
  height: 22px;
}
.scircle-record-bars .bar:nth-child(5) {
  animation-delay: 480ms;
  height: 16px;
}

@keyframes chatRoomRecordBar {
  0%,
  100% {
    transform: scaleY(0.8);
    opacity: 0.75;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
}

.scircle-record-cancel-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  min-height: 88px;
  padding-bottom: 2px;
}

.scircle-record-cancel-arc-text {
  width: 120px;
  height: 36px;
  margin-bottom: 2px;
  overflow: visible;
}

.scircle-record-cancel-arc-fill {
  fill: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.scircle-record-cancel {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(120, 120, 120, 0.55);
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  transition:
    width 0.2s ease,
    height 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.scircle-record-cancel.is-active {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #2494ff;
  color: #fff;
  box-shadow: 0 4px 14px rgba(36, 148, 255, 0.45);
}

.scircle-record-tip {
  position: relative;
  z-index: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
  font-size: 15px;
  font-weight: 500;
  margin-top: 22px;
  letter-spacing: 0.04em;
}

.scircle-record-arch {
  flex-shrink: 0;
  width: 100%;
  height: min(168px, 28vh);
  min-height: 120px;
  background: linear-gradient(180deg, #e4e4e6 0%, #d6d6d8 100%);
  border-top-left-radius: 50% 36px;
  border-top-right-radius: 50% 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  box-sizing: border-box;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.scircle-record-mic-icon {
  color: rgba(0, 0, 0, 0.38);
}

.chat-plus {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: #ffffff;
  font-size: 22px;
  color: #333;
}

.chat-more {
  background: #e3e3e3;
  padding: 18px 0 22px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 34px;
}

.chat-more-item {
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.chat-more-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-more-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #333;
}

.chat-more-text {
  font-size: 12px;
  color: #666;
}

.chat-recharge {
  padding: 14px 14px calc(14px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  max-height: 78vh;
  overflow: auto;
}

.chat-recharge-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 14px;
}

.chat-recharge-loading {
  text-align: center;
  font-size: 13px;
  color: #999;
  padding: 24px 0;
}

.chat-recharge-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.chat-recharge-card {
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 10px 8px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 118px;
  box-sizing: border-box;
  cursor: pointer;
  font: inherit;
  -webkit-tap-highlight-color: transparent;
}

.chat-recharge-card.is-selected {
  border-color: #2494ff;
  background: #f0f8ff;
  box-shadow: 0 0 0 1px rgba(36, 148, 255, 0.25);
}

.chat-recharge-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eee;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-recharge-card-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-recharge-card-placeholder {
  font-size: 11px;
  color: #999;
}

.chat-recharge-card-name {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  text-align: center;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chat-recharge-card-dur {
  font-size: 11px;
  color: #888;
}

.chat-recharge-card-price {
  font-size: 12px;
  color: #2494ff;
  font-weight: 600;
  text-align: center;
}

.chat-recharge-price-promo {
  color: #2494ff;
}

.chat-recharge-price-old {
  display: block;
  font-size: 10px;
  color: #999;
  font-weight: 400;
  text-decoration: line-through;
}

.chat-recharge-vip-hint {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 8px;
}

.chat-recharge-link {
  color: #2494ff;
  cursor: pointer;
}

.chat-recharge-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  font-size: 12px;
}

.chat-recharge-submit {
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 10px;
  background: #2494ff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.chat-recharge-submit:disabled {
  opacity: 0.55;
}
</style>
