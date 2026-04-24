<script setup lang="ts">
const __ = useNuxtApp()
const router = useRouter()
const globalStore = useGlobalStore()
const appConfig = useAppConfig()

definePageMeta({
  keepalive: true
})

/** 素材 cover 多为根相对路径，需拼资源域；完整 URL 仍走 dx-image + lazyLoad 解密 */
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

interface MaterialItem {
  id: number
  title: string
  cover: string
  preview_url: string
  sort_num: number
  status: number
  /** list_material 返回的金币单价（字段名后端可能不同，见 normalizeMaterialRow） */
  cost_coin: number
}

const showPopup = ref(false)
const activeItem = ref<MaterialItem | null>(null)
const isPreviewing = ref(false)

const previewVideoUrl = computed(() => resolveMediaUrl(activeItem.value?.preview_url))
const previewPosterUrl = computed(() => resolveMediaUrl(activeItem.value?.cover))

function resetPopupState() {
  isPreviewing.value = false
  images.value = []
  activeItem.value = null
}

watch(showPopup, v => {
  if (!v) resetPopupState()
})

const MAX_SIZE = 2 * 1024 * 1024
const images = ref<any[]>([])
const showPayPopup = ref(false)

/** /api/aimagic/pre_magic */
interface PreMagicData {
  free_num: number
  /** 当前金币余额（后端可能返回 coin / coins） */
  coin: number
  cost_coin: number
  tips: string
  exp_correct_img?: string
  exp_error1_img?: string
  exp_error2_img?: string
  exp_error3_img?: string
}

const magicData = ref<PreMagicData>({
  free_num: 0,
  coin: 0,
  cost_coin: 0,
  tips: ''
})

/** 单价优先用当前选中素材（list_material 里的金币字段），否则用预检查 */
const magicDisplayCost = computed(() => {
  const fromItem = activeItem.value?.cost_coin
  if (fromItem != null && Number.isFinite(fromItem) && fromItem > 0) return fromItem
  const pre = magicData.value.cost_coin
  return Number.isFinite(pre) && pre > 0 ? pre : 0
})

const magicMainPayLabel = computed(() => {
  const c = magicDisplayCost.value
  return c > 0 ? `支付${c}金币` : '立即制作'
})

async function fetchPreMagic() {
  try {
    const res = await __.$Api.AI.preMagic({})
    if (import.meta.dev) {
      console.log('[AI魔法] pre_magic 原始响应', res)
    }
    const d = res?.data as Partial<PreMagicData> | undefined
    if (d) {
      const anyD = d as any
      magicData.value = {
        free_num: Number(d.free_num ?? 0),
        // 余额字段：兼容 coin / coins
        coin: Number(anyD.coins ?? d.coin ?? 0),
        // 单价字段：兼容 cost_coin / ai_magic_coins（后端常见命名）
        cost_coin: Number(d.cost_coin ?? anyD.ai_magic_coins ?? 0),
        // 提示字段：兼容 tips / ai_magic_tips
        tips: (d.tips ?? anyD.ai_magic_tips ?? '') as string,
        exp_correct_img: anyD.exp_correct_img,
        exp_error1_img: anyD.exp_error1_img,
        exp_error2_img: anyD.exp_error2_img,
        exp_error3_img: anyD.exp_error3_img
      }
    }
  } catch (error) {
    console.error('获取AI魔法预检查失败:', error)
  }
}

const expCorrectImg = computed(() => resolveMediaUrl(magicData.value.exp_correct_img))
const expError1Img = computed(() => resolveMediaUrl(magicData.value.exp_error1_img))
const expError2Img = computed(() => resolveMediaUrl(magicData.value.exp_error2_img))
const expError3Img = computed(() => resolveMediaUrl(magicData.value.exp_error3_img))

onMounted(() => {
  fetchPreMagic()
  fetchMaterials()
})

onActivated(() => {
  fetchPreMagic()
  fetchMaterials()
})

const materials = ref<MaterialItem[]>([])

function pickNumericField(row: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    const v = row[k]
    if (v === undefined || v === null || v === '') continue
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return 0
}

function normalizeMaterialRow(row: Record<string, unknown>): MaterialItem | null {
  const id = Number(row.id)
  if (!Number.isFinite(id)) return null
  const cost_coin = pickNumericField(row, ['cost_coin', 'coin', 'price', 'need_coin', 'gold_coin', 'gold', 'coins'])
  return {
    id,
    title: String(row.title ?? row.name ?? ''),
    cover: String(row.cover ?? row.thumb ?? row.cover_url ?? ''),
    preview_url: String(row.preview_url ?? row.preview ?? row.video ?? row.preview_video ?? ''),
    sort_num: Number(row.sort_num ?? row.sort ?? 0),
    status: Number(row.status ?? 0),
    cost_coin
  }
}

/** 拦截器返回的是解密后的整包：常见为 { status, data }；data 可能是数组或再包一层 */
function parseListMaterialRows(res: any): MaterialItem[] {
  const d = res?.data
  let raw: unknown[] = []
  if (Array.isArray(d)) raw = d
  else if (d && Array.isArray(d.list)) raw = d.list
  else if (d && Array.isArray(d.data)) raw = d.data
  else {
    if (import.meta.dev) console.warn('[AI魔法] list_material 未解析到数组', res)
    return []
  }
  const out: MaterialItem[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const m = normalizeMaterialRow(item as Record<string, unknown>)
    if (m) out.push(m)
  }
  return out
}

async function fetchMaterials() {
  try {
    let res: any
    try {
      res = await __.$Api.AI.listMaterial({ page: 1, limit: 20 })
      // 后端新接口未上线时会返回 status=0 且 msg 类似 “Call to undefined method ...::list_material()”
      if (Number(res?.status) === 0 && String(res?.msg ?? '').includes('list_material')) {
        throw res
      }
    } catch (e: any) {
      // 兼容旧接口
      res = await __.$Api.AI.list({ page: 1, limit: 20 })
    }
    if (import.meta.dev) {
      const d = res?.data
      const sample = Array.isArray(d)
        ? d[0]
        : Array.isArray(d?.list)
          ? d.list[0]
          : Array.isArray(d?.data)
            ? d.data[0]
            : d
      console.log('[AI魔法] list_material 原始响应', res)
      console.log(
        '[AI魔法] 素材首条原始字段',
        sample && typeof sample === 'object' ? Object.keys(sample as object) : sample
      )
    }
    materials.value = parseListMaterialRows(res)
    if (import.meta.dev) {
      console.log('[AI魔法] 解析后素材列表', materials.value)
    }
  } catch (error) {
    console.error('[AI魔法] 获取素材列表失败:', error)
    materials.value = []
  }
}

function open(item: MaterialItem) {
  activeItem.value = item
  images.value = []
  isPreviewing.value = false
  showPopup.value = true
  fetchPreMagic()
}

function close() {
  isPreviewing.value = false
  showPopup.value = false
  showPayPopup.value = false
}

async function onPreviewClick() {
  const url = previewVideoUrl.value
  if (!url) return
  isPreviewing.value = true
}

function onOversize() {
  __.$Toast({
    message: '图片过大，请重新上传',
    position: 'bottom'
  })
}

async function afterRead(file: any) {
  const size = file?.file?.size ?? 0
  if (size > MAX_SIZE) {
    images.value = []
    onOversize()
  }
}

function toRecharge() {
  router.push('/coin-recharge?type=1')
}

function pickTaskMsg(res: any): string | undefined {
  return res?.msg ?? res?.data?.msg
}

function onPay() {
  if (!images.value.length) {
    return __.$Toast('请先上传图片')
  }
  showPayPopup.value = true
}

async function submitMagic() {
  if (!images.value.length) {
    return __.$Toast('请先上传图片')
  }
  if (!activeItem.value) {
    return __.$Toast('请选择魔法素材')
  }
  try {
    const entry = images.value[0] as any
    const rawFile = entry?.file as File | undefined
    if (!rawFile) {
      return __.$Toast('图片读取失败，请重新上传')
    }

    // 1) 取尺寸（用本地 File，避免 base64/域名拼接导致后端 getimagesize 异常）
    const size = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(rawFile)
      img.onload = () => {
        try {
          resolve({ width: img.width, height: img.height })
        } finally {
          try {
            URL.revokeObjectURL(objectUrl)
          } catch {
            /* ignore */
          }
        }
      }
      img.onerror = () => {
        try {
          URL.revokeObjectURL(objectUrl)
        } catch {
          /* ignore */
        }
        reject(new Error('获取图片尺寸失败'))
      }
      img.src = objectUrl
    })

    // 2) 先上传图片，拿到可访问 URL，再提交生成接口
    const uploadRes = await __.$Api.uploadImage({ file: rawFile, useCompress: true })
    let thumbUrl = String((uploadRes as any) ?? '').trim()
    if (!thumbUrl) {
      return __.$Toast('图片上传失败，请重试')
    }
    // 兜底清洗：避免出现空白/重复斜杠
    thumbUrl = thumbUrl.replace(/\s+/g, '')
    if (/^https?:\/\//i.test(thumbUrl)) {
      try {
        const u = new URL(thumbUrl)
        // 提交给后端时只传路径，避免传全域名 URL
        thumbUrl = `${u.pathname}${u.search}`.replace(/\/{2,}/g, '/')
      } catch {
        thumbUrl = thumbUrl.replace(/\/{2,}/g, '/')
      }
    } else {
      thumbUrl = thumbUrl.replace(/\/{2,}/g, '/')
    }

    const payload = {
      thumb: thumbUrl,
      thumb_w: size.width,
      thumb_h: size.height,
      material_id: activeItem.value?.id,
      type: 0
    }
    if (import.meta.client) {
      // eslint-disable-next-line no-console
      console.log('[AI魔法] generate_video payload', payload)
    }

    const res = await __.$Api.AI.magic(payload)
    if (import.meta.client) {
      // eslint-disable-next-line no-console
      console.log('[AI魔法] generate_video 响应', res)
      // eslint-disable-next-line no-console
      console.log('[AI魔法] generate_video 响应.data', (res as any)?.data)
    }
    const tip = pickTaskMsg(res)
    if (tip) __.$Toast(tip)

    showPayPopup.value = false
    showPopup.value = false
    await __.$Alert({
      title: '提交成功',
      message: '正在生成，稍后请前往 AI科技-我的\n记录中查看',
      confirmButtonText: '朕知道了',
      confirmButtonColor: '#2494ff',
      className: 'ai-magic-success-dialog'
    })
    router.push('/ai/record?_index=3')
  } catch (error: any) {
    const errorMsg = error?.message || '提交失败'
    __.$Toast(errorMsg)
    console.error('提交AI魔法任务失败:', error)
  }
}

async function confirmPay() {
  await submitMagic()
}
</script>

<template>
  <div class="ai-magic-page">
    <div class="ai-magic-content">
      <div class="ai-magic-grid">
        <button v-for="item in materials" :key="item.id" class="ai-magic-card" type="button" @click="open(item)">
          <div class="ai-magic-card-thumb">
            <dx-image class="ai-magic-card-cover" :src="resolveMediaUrl(item.cover)" />
            <span class="ai-magic-card-coin-badge" aria-hidden="true">
              {{ item.cost_coin > 0 ? `${item.cost_coin}金币` : '金币' }}
            </span>
          </div>
          <div class="ai-magic-card-title">{{ item.title }}</div>
        </button>
      </div>
    </div>

    <van-popup v-model:show="showPopup" position="bottom" teleport="body" round closeable @click-overlay="close">
      <div class="magic-popup">
        <div class="magic-popup-title">{{ activeItem?.title ?? 'XXXXXXXXXX名称' }}</div>

        <button class="magic-popup-video" type="button" @click="onPreviewClick">
          <template v-if="previewVideoUrl">
            <xg-player
              :key="previewVideoUrl || 'no-preview-video'"
              class="magic-popup-xg"
              :active="isPreviewing"
              :src="previewVideoUrl"
              :poster="previewPosterUrl"
              :autoplay="true"
              :loop="true"
              :short="true"
              :preview-config="{ mode: 0 }"
            />
            <div v-if="!isPreviewing" class="magic-popup-play">▶</div>
          </template>
          <dx-image v-else-if="previewPosterUrl" class="magic-popup-video-cover" :src="previewPosterUrl" />
          <div v-else class="magic-popup-video-placeholder skeleton" aria-hidden="true" />
        </button>

        <div class="magic-upload-card">
          <van-field class="magic-my-upload" name="uploader" label-align="top">
            <template #input>
              <van-uploader
                v-model="images"
                reupload
                :max-size="MAX_SIZE"
                :preview-full-image="false"
                preview-size="120px"
                accept="image/*"
                :max-count="1"
                :after-read="afterRead"
                @oversize="onOversize"
              >
                <div v-if="images.length < 1" class="magic-uploader-empty">
                  <img class="magic-uploader-empty-icon" src="~/assets/image-icon/upload_image_2.png" alt="icon" />
                  <span class="magic-uploader-empty-text">
                    点击上传人物信息
                    <br />
                    图片大小不超过2MB
                  </span>
                </div>
                <template #preview-delete>
                  <dx-icon-close class="magic-uploader-delete-icon" />
                </template>
              </van-uploader>
            </template>
          </van-field>
        </div>

        <div class="magic-popup-tips">
          <div class="magic-popup-tip">
            <div class="magic-popup-tip-img-wrap">
              <div class="magic-popup-tip-img-clip">
                <dx-image v-if="expCorrectImg" class="magic-popup-tip-img" :src="expCorrectImg" />
                <div v-else class="magic-popup-tip-img magic-popup-tip-img-placeholder skeleton" aria-hidden="true" />
              </div>
              <div class="magic-popup-tip-badge is-ok">✓</div>
            </div>
            <div class="magic-popup-tip-text">正面无遮挡</div>
          </div>
          <div class="magic-popup-tip">
            <div class="magic-popup-tip-img-wrap">
              <div class="magic-popup-tip-img-clip">
                <dx-image v-if="expError1Img" class="magic-popup-tip-img" :src="expError1Img" />
                <div v-else class="magic-popup-tip-img magic-popup-tip-img-placeholder skeleton" aria-hidden="true" />
              </div>
              <div class="magic-popup-tip-badge is-bad">✕</div>
            </div>
            <div class="magic-popup-tip-text">上身有遮挡</div>
          </div>
          <div class="magic-popup-tip">
            <div class="magic-popup-tip-img-wrap">
              <div class="magic-popup-tip-img-clip">
                <dx-image v-if="expError2Img" class="magic-popup-tip-img" :src="expError2Img" />
                <div v-else class="magic-popup-tip-img magic-popup-tip-img-placeholder skeleton" aria-hidden="true" />
              </div>
              <div class="magic-popup-tip-badge is-bad">✕</div>
            </div>
            <div class="magic-popup-tip-text">不是正面</div>
          </div>
          <div class="magic-popup-tip">
            <div class="magic-popup-tip-img-wrap">
              <div class="magic-popup-tip-img-clip">
                <dx-image v-if="expError3Img" class="magic-popup-tip-img" :src="expError3Img" />
                <div v-else class="magic-popup-tip-img magic-popup-tip-img-placeholder skeleton" aria-hidden="true" />
              </div>
              <div class="magic-popup-tip-badge is-bad">✕</div>
            </div>
            <div class="magic-popup-tip-text">过于模糊</div>
          </div>
        </div>

        <button class="magic-popup-pay-btn" type="button" :disabled="!images.length" @click="onPay">
          {{ magicMainPayLabel }}
        </button>
        <div class="magic-popup-balance">
          当前余额：{{ magicData.coin }}，
          <button class="magic-popup-recharge" type="button" @click="toRecharge">去充值</button>
        </div>
      </div>
    </van-popup>

    <van-popup v-model:show="showPayPopup" position="bottom" teleport="body" round closeable @click-overlay="close">
      <div class="pay-popup">
        <div class="pay-popup-title">支付金币</div>
        <div class="pay-popup-row">
          <div class="pay-popup-label">
            金币余额：
            <span class="pay-popup-balance">{{ magicData.coin }}</span>
          </div>
          <button class="pay-popup-recharge" type="button" @click="toRecharge">立即充值</button>
        </div>
        <div class="pay-popup-row">
          <div class="pay-popup-label">支付金额</div>
          <div class="pay-popup-value">{{ magicDisplayCost }} 金币</div>
        </div>
        <div class="pay-popup-divider" />
        <div class="pay-popup-row pay-popup-row-strong">
          <div class="pay-popup-label">实际支付</div>
          <div class="pay-popup-value pay-popup-value-strong">{{ magicDisplayCost }} 金币</div>
        </div>
        <button class="pay-popup-btn" type="button" :disabled="!images.length" @click="confirmPay">立即支付</button>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.ai-magic-page {
  min-height: 100vh;
  background: #ffffff;
}

.ai-magic-content {
  padding: 12px;
}

.ai-magic-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ai-magic-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.ai-magic-card-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
}

.ai-magic-card-coin-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  padding: 2px 7px;
  border-radius: 4px;
  background: linear-gradient(180deg, #ff9f43 0%, #ff7a00 100%);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.02em;
  pointer-events: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.ai-magic-card-cover {
  width: 100%;
  height: 100%;
}

.ai-magic-card-title {
  margin-top: 6px;
  width: 100%;
  min-width: 0;
  flex-shrink: 0;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.35;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.magic-popup {
  padding: 16px 14px 22px;
}

.magic-popup-title {
  text-align: center;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
}

.magic-popup-video {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #e9e9e9;
  border: 0;
  padding: 0;
  width: 100%;
  display: block;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.magic-popup-video-cover {
  width: 100%;
  height: 160px;
  display: block;
}

.magic-popup-video-placeholder {
  width: 100%;
  height: 160px;
  border-radius: 12px;
}

.magic-popup-xg {
  width: 100%;
  height: 160px;
}

.magic-popup-play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  pointer-events: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.magic-upload-card {
  margin-top: 12px;
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  background: #f0f0f0;
  border: 1px dashed #7a7a7a;
}

.magic-my-upload {
  --van-cell-background: #f0f0f0;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  height: 120px;
}

.magic-my-upload :deep(.van-uploader__preview),
.magic-my-upload :deep(.van-uploader__wrapper),
.magic-my-upload :deep(.van-field__control),
.magic-my-upload :deep(.van-field__body),
.magic-my-upload :deep(.van-uploader),
.magic-my-upload :deep(.van-cell__value) {
  width: 100%;
  height: 120px;
  margin: 0;
}

.magic-my-upload :deep(.van-cell),
.magic-my-upload :deep(.van-field) {
  padding: 0;
}

.magic-my-upload :deep(.van-field__body) {
  width: 100% !important;
}

.magic-my-upload :deep(.van-cell__value) {
  flex: 1 !important;
  min-width: 0;
  width: 100% !important;
}

.magic-my-upload :deep(.van-uploader) {
  display: block;
  width: 100% !important;
}

.magic-my-upload :deep(.van-uploader__wrapper) {
  display: flex;
  flex: 1;
  width: 100% !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.magic-my-upload :deep(.van-uploader__upload),
.magic-my-upload :deep(.van-uploader__preview) {
  width: 100% !important;
  height: 120px;
}

.magic-my-upload :deep(.van-uploader__preview-image),
.magic-my-upload :deep(.van-image),
.magic-my-upload :deep(.van-image__img) {
  width: 100% !important;
  height: 100% !important;
}

.magic-my-upload :deep(.van-image__img) {
  object-fit: cover;
}

.magic-uploader-empty {
  height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
}

.magic-uploader-empty-icon {
  width: 30px;
  height: 30px;
}

.magic-uploader-empty-text {
  margin-top: 6px;
  text-align: center;
  font-size: 10px;
  line-height: 14px;
  color: #6c6c6c;
}

.magic-uploader-delete-icon {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.magic-my-upload :deep(.van-uploader__preview-delete) {
  top: 8px;
  right: 8px;
  left: auto;
  bottom: auto;
  width: 28px;
  height: 28px;
  margin: 0;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.magic-my-upload :deep(.van-uploader__preview-delete):active {
  background: rgba(0, 0, 0, 0.6);
}

.magic-popup-tips {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.magic-popup-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.magic-popup-tip-img-wrap {
  position: relative;
  width: 64px;
  height: 64px;
}

.magic-popup-tip-img-clip {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  overflow: hidden;
}

.magic-popup-tip-img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  display: block;
}

.magic-popup-tip-img:deep(img) {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
  display: block;
}

.magic-popup-tip-img-placeholder {
  background-color: #f0f0f0;
}

.magic-popup-tip-badge {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  line-height: 14px;
}

.magic-popup-tip-badge.is-ok {
  background: #2ecc71;
}

.magic-popup-tip-badge.is-bad {
  background: #ff4d4f;
}

.magic-popup-tip-text {
  font-size: 10px;
  color: #1a1a1a;
}

.magic-popup-pay-btn {
  margin-top: 14px;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 0;
  background: #2494ff;
  color: #ffffff;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
}

.magic-popup-pay-btn:disabled {
  background: #c8c9cc;
  color: #ffffff;
  cursor: not-allowed;
  opacity: 0.85;
}

.magic-popup-balance {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #a8a8a8;
  line-height: 1.5;
}

.magic-popup-recharge {
  margin: 0;
  padding: 0;
  color: #2494ff;
  background: transparent;
  border: 0;
  font-size: 12px;
  font-family: inherit;
}

:global(.ai-magic-success-dialog) {
  --van-dialog-border-radius: 8px;
}

:global(.ai-magic-success-dialog .van-action-bar-button),
:global(.ai-magic-success-dialog .van-dialog__confirm),
:global(.ai-magic-success-dialog .van-dialog__footer .van-button) {
  display: block !important;
  width: calc(100% - 48px) !important;
  height: 44px !important;
  min-height: 44px !important;
  border-radius: 8px !important;
}

:global(.ai-magic-success-dialog .van-dialog__footer) {
  display: flex !important;
  justify-content: center !important;
}

.pay-popup {
  padding: 20px 18px 26px;
  background: #ffffff;
}

.pay-popup-title {
  text-align: center;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.2;
  color: #111111;
  margin-bottom: 16px;
}

.pay-popup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}

.pay-popup-label {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  color: #6c6c6c;
}

.pay-popup-balance {
  color: #ff0000;
  margin-left: 6px;
  font-weight: 600;
}

.pay-popup-recharge {
  background: transparent;
  border: 0;
  padding: 0;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #2494ff;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.pay-popup-value {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #6c6c6c;
}

.pay-popup-divider {
  height: 0;
  border-top: 1px dashed #d8d8d8;
  margin: 8px 0;
}

.pay-popup-row-strong .pay-popup-label {
  font-weight: 600;
  color: #111111;
}

.pay-popup-value-strong {
  font-weight: 700;
  color: #ff0000;
}

.pay-popup-btn {
  margin-top: 18px;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border: 0;
  background: #2494ff;
  color: #ffffff;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 600;
  font-size: 18px;
}

.pay-popup-btn:disabled {
  background: #c8c9cc;
  cursor: not-allowed;
  opacity: 0.85;
}
</style>
