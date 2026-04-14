<script setup lang="ts">
import { useId } from 'vue'

const route = useRoute()
const router = useRouter()
const __ = useNuxtApp()

const recordCancelArcPathId = useId()
const rechargeCloseClipId = useId()

interface TalkProductItem {
  id: number
  name: string
  price: number
  promo_price: number
  duration: number
  free_duration: number
  icon_url: string
  /** 条数（若后端有返回，用于「10条」主文案） */
  msg_count: number
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

/** 对方 uid（路由 query，私信 / 同圈进入均会带） */
const peerUid = computed(() => {
  const uidRaw = route.query.uid
  const s = typeof uidRaw === 'string' ? uidRaw.trim() : Array.isArray(uidRaw) ? String(uidRaw[0] ?? '').trim() : ''
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? n : null
})

const messageText = ref('')
const isSendingText = ref(false)

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

async function sendTextMessage() {
  const uid = peerUid.value
  const text = messageText.value.trim()
  if (uid == null) {
    __.$Toast('缺少聊天对象，请从匹配或私信列表重新进入')
    return
  }
  if (!text || isSendingText.value) return
  if (showInsufficientTip.value) {
    __.$Toast('聊天时长不足，请先充值')
    return
  }
  isSendingText.value = true
  try {
    await __.$Api.User.chat({ uid, content: text })
    messageText.value = ''
    void fetchTalkInfo()
  } catch (e) {
    __.$Toast(scircleErrMsg(e))
  } finally {
    isSendingText.value = false
  }
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

/** 上区主文案：优先条数，其次从 name 里抽「N条」，否则用 name */
function productQuantityLabel(p: TalkProductItem): string {
  const n = Number(p.msg_count)
  if (Number.isFinite(n) && n > 0) return `${Math.round(n)}条`
  const m = String(p.name ?? '').match(/(\d+)\s*条/)
  if (m) return `${m[1]}条`
  return String(p.name || '套餐').trim() || '套餐'
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
    const res = await __.$Api.User.chat_product({})
    if (import.meta.env.DEV && import.meta.client) {
      console.log(
        '%c[chat-room] POST /api/message/product 原始返回',
        'font-weight:bold;color:#1677ff',
        res
      )
      console.log('[chat-room] /api/message/product data：', res?.data)
    }
    const raw: any = res?.data
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.message_product) ? raw.message_product : []
    products.value = list
      .map((it: any) => ({
        id: Number(it?.key ?? it?.id),
        name: String(it?.sub_title ?? it?.name ?? it?.title ?? '').trim(),
        price: Number(it?.value ?? it?.price ?? 0),
        promo_price: Number(it?.promo_price ?? 0),
        duration: Number(it?.duration ?? 0),
        free_duration: Number(it?.free_duration ?? 0),
        icon_url: String(it?.icon ?? it?.icon_url ?? it?.image ?? it?.img ?? it?.cover ?? '').trim(),
        msg_count: (() => {
          const n = Number(it?.num ?? it?.msg_count ?? it?.count ?? it?.msg_num ?? 0)
          return Number.isFinite(n) && n > 0 ? Math.round(n) : 0
        })()
      }))
      .filter((p: TalkProductItem) => Number.isFinite(p.id) && p.id > 0)

    if (import.meta.env.DEV && import.meta.client) {
      console.log(
        '[chat-room] /api/message/product 解析后 products：',
        products.value.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          promo_price: p.promo_price,
          duration: p.duration,
          free_duration: p.free_duration,
          icon_url: p.icon_url,
          msg_count: p.msg_count
        }))
      )
    }
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

function goCoinRecharge() {
  showRecharge.value = false
  router.push('/coin-recharge')
}

function goBuyVip() {
  showRecharge.value = false
  router.push('/renewal')
}

async function onConfirmBuyTime() {
  const id = selectedProductId.value
  if (id == null || buying.value) return
  buying.value = true
  try {
    const product_id_num = Math.round(Number(id))
    const product_id = String(product_id_num)
    if (!Number.isFinite(product_id_num) || product_id_num <= 0) {
      __.$Toast('产品ID无效')
      return
    }
    const selected = products.value.find(p => Number(p.id) === product_id_num)
    const coins = selected ? productPayCoins(selected) : 0
    if (!Number.isFinite(Number(coins)) || Number(coins) <= 0) {
      __.$Toast('金币参数无效')
      return
    }
    if (import.meta.env.DEV && import.meta.client) {
      console.log('[chat-room] /api/message/buy payload：', { product_id, coins })
    }
    const res = await __.$Api.User.chat_buy({ product_id, coins })
    if (import.meta.env.DEV && import.meta.client) {
      console.log('%c[chat-room] POST /api/message/buy 原始返回', 'font-weight:bold;color:#1677ff', res)
      console.log('[chat-room] /api/message/buy data：', res?.data)
    }
    showRecharge.value = false
    await fetchTalkInfo()
  } catch (e) {
    console.error('[chat-room] /api/message/buy', e)
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
          :key="peerAvatar"
          v-lazyLoad="peerAvatar"
          class="chat-avatar chat-avatar-img"
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
            v-model="messageText"
            class="chat-input"
            type="text"
            placeholder="说点好听的吧～"
            enterkeyhint="send"
            maxlength="2000"
            :disabled="isSendingText"
            @focus="showMore = false"
            @keydown.enter.prevent="sendTextMessage"
          />
          <button
            v-if="composerMode === 'text'"
            class="chat-send"
            type="button"
            :disabled="isSendingText || !messageText.trim()"
            @click="sendTextMessage"
          >
            {{ isSendingText ? '…' : '发送' }}
          </button>
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
      :style="{ maxHeight: 'min(88vh, 100dvh)' }"
    >
      <div class="chat-recharge">
        <button class="chat-recharge-close" type="button" aria-label="关闭" @click="showRecharge = false">
          <svg
            class="chat-recharge-close-svg"
            width="14"
            height="14"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g opacity="0.3" :clip-path="`url(#${rechargeCloseClipId})`">
              <path
                d="M20.0002 0.613281C9.27418 0.613281 0.579102 9.3084 0.579102 20.0345C0.579102 30.7605 9.27418 39.4556 20.0002 39.4556C30.7262 39.4556 39.4213 30.7605 39.4213 20.0345C39.4213 9.3084 30.7263 0.613281 20.0003 0.613281H20.0002ZM28.3288 25.8452C29.024 26.5406 29.024 27.6677 28.3288 28.363C27.6336 29.0582 26.5062 29.0582 25.811 28.363L20.0002 22.5522L14.1893 28.363C13.494 29.0582 12.367 29.0582 11.6717 28.363C10.9762 27.6677 10.9762 26.5406 11.6717 25.8452L17.4824 20.0345L11.6717 14.2237C10.9762 13.5284 10.9762 12.4011 11.6717 11.7059C12.367 11.0107 13.494 11.0107 14.1893 11.7059L20.0002 17.5166L25.811 11.7059C26.5062 11.0107 27.6336 11.0107 28.3288 11.7059C29.024 12.4011 29.024 13.5284 28.3288 14.2237L22.518 20.0345L28.3288 25.8452Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath :id="rechargeCloseClipId">
                <rect width="40" height="40" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>

        <div class="chat-recharge-body">
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
              <div class="chat-recharge-card-inner">
                <div class="chat-recharge-card-top">
                  <div class="chat-recharge-card-icon-wrap">
                    <img
                      v-if="p.icon_url"
                      :key="p.icon_url"
                      v-lazyLoad="p.icon_url"
                      class="chat-recharge-card-icon-img"
                      src="~/assets/image/img_loading.png"
                      alt=""
                    />
                    <span v-else class="chat-recharge-card-placeholder">套餐</span>
                  </div>
                  <div class="chat-recharge-card-qty">{{ productQuantityLabel(p) }}</div>
                </div>
                <div class="chat-recharge-card-bottom">
                  <span class="chat-recharge-price-main">{{ productPayCoins(p) }}金币</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div v-if="!productsLoading" class="chat-recharge-hint-row">
          <p class="chat-recharge-hint-left">
            <span class="chat-recharge-hint-text">成为会员后，可无限发布消息，</span>
            <button type="button" class="chat-recharge-hint-link" @click="goBuyVip">去购买会员</button>
          </p>
          <button type="button" class="chat-recharge-hint-link chat-recharge-hint-right" @click="goCoinRecharge">
            充值金币
          </button>
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
  gap: 4px;
  overflow: hidden;
}

.chat-composer.is-voice-mode .chat-input-area {
  background: transparent;
}

.chat-input {
  flex: 1;
  min-width: 0;
  height: 38px;
  border: 0;
  background: #ffffff;
  padding: 0 8px 0 14px;
  font-size: 14px;
  outline: none;
}

.chat-send {
  flex-shrink: 0;
  height: 32px;
  margin-right: 4px;
  padding: 0 10px;
  border: 0;
  border-radius: 16px;
  background: rgba(36, 148, 255, 0.12);
  color: #2494ff;
  font-size: 14px;
  font-weight: 600;
  -webkit-tap-highlight-color: transparent;
}

.chat-send:disabled {
  opacity: 0.45;
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
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* 与同圈 match-goods 弹层一致：内容区略小于 van-popup 的 max-height，避免裁切 */
  max-height: min(82vh, calc(100dvh - 24px));
  padding: 28px 14px 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  overflow: hidden;
  position: relative;
}

.chat-recharge-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.chat-recharge-close {
  position: absolute;
  right: 10px;
  top: 5px;
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: 50%;
  border: 0;
  /* background: rgba(0, 0, 0, 0.12); */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.chat-recharge-close-svg {
  display: block;
  width: 14px;
  height: 14px;
}

.chat-recharge-close:active {
  opacity: 0.9;
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
  padding-top: 10px;
}

/* 上区黄底 + 下区渐变；圆角按 750 设计宽换算 */
.chat-recharge-card {
  --recharge-card-radius: clamp(8px, calc(18 * 100vw / 750), 11px);
  border: 0;
  border-radius: var(--recharge-card-radius);
  padding: 4px;
  background: linear-gradient(180deg, #ff0000 67.44%, #f9a600 100%);
  box-sizing: border-box;
  cursor: pointer;
  font: inherit;
  -webkit-tap-highlight-color: transparent;
  min-height: 0;
}

.chat-recharge-card.is-selected {
  box-shadow: 0 0 0 2px rgba(27, 84, 255, 0.55);
}

.chat-recharge-card-inner {
  display: flex;
  flex-direction: column;
  /* 按 750 设计宽换算卡片高度，避免黄区被拉出一段“空高” */
  height: clamp(112px, calc(224 * 100vw / 750), 124px);
  border-radius: inherit;
  overflow: hidden;
}

.chat-recharge-card-top {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 8px;
  background: rgba(242, 255, 0, 0.75);
  background-image: radial-gradient(ellipse 120% 85% at 50% 35%, rgba(255, 255, 255, 0.55) 0%, transparent 62%);
}

.chat-recharge-card-icon-wrap {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 4px 2px;
  box-sizing: border-box;
}

.chat-recharge-card-icon-img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  display: block;
}

.chat-recharge-card-placeholder {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 600;
}

.chat-recharge-card-qty {
  flex: 0 0 auto;
  margin-top: auto;
  padding: 5px 4px 6px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #2b1a0a;
  line-height: 1.2;
  background: rgba(255, 255, 255, 0.28);
}

.chat-recharge-card-bottom {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 4px 0px;
  box-sizing: border-box;
}

.chat-recharge-price-main {
  font-size: 11px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.chat-recharge-price-promo {
  color: #2494ff;
}

.chat-recharge-price-old {
  display: block;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 400;
  text-decoration: line-through;
}

.chat-recharge-hint-row {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  padding: 0 2px;
}

.chat-recharge-hint-left {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
  color: #666;
}

.chat-recharge-hint-text {
  color: #666;
}

.chat-recharge-hint-link {
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  font-size: 11px;
  color: #2494ff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.chat-recharge-hint-right {
  flex-shrink: 0;
}

.chat-recharge-submit {
  flex-shrink: 0;
  width: 100%;
  height: 46px;
  margin-top: 12px;
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

<style>
/* 与同圈 match-goods-popup-van 一致：抬高 van-popup 根节点 max-height，否则只改内层不生效 */
/* .chat-recharge-popup.van-popup {
  height: 50vh !important;
  min-height: min(55vh, 100dvh) !important;
} */
</style>
