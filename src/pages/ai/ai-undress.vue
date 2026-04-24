<script setup lang="ts">
import beforeImg from '~/assets/image/before.png'
import undressedImg from '~/assets/image/undressed.png'

const __ = useNuxtApp()
const router = useRouter()

definePageMeta({
  keepalive: true
})

const MAX_SIZE = 2 * 1024 * 1024
const images = ref<any[]>([])
const showPayPopup = ref(false)

/** /api/ai/pre_strip */
interface PreStripData {
  free_num: number
  coin: number
  cost_coin: number
  tips: string
}

const stripData = ref<PreStripData>({
  free_num: 0,
  coin: 0,
  cost_coin: 0,
  tips: ''
})

function pickNumericField(row: Record<string, unknown> | undefined, keys: string[]): number {
  if (!row) return 0
  for (const k of keys) {
    const v = row[k]
    if (v === undefined || v === null || v === '') continue
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return 0
}

function pickStringField(row: Record<string, unknown> | undefined, keys: string[]): string {
  if (!row) return ''
  for (const k of keys) {
    const v = row[k]
    if (v === undefined || v === null) continue
    const s = String(v).trim()
    if (s) return s
  }
  return ''
}

// 左侧“次数卡”只用 free_num
const canUseFree = computed(() => stripData.value.free_num > 0)
const canPayCoin = computed(() => stripData.value.cost_coin > 0)

async function fetchPreStrip() {
  try {
    const res = await __.$Api.AI.preStrip({})
    console.log(
      '%c[AI-UNDRESS] 进入页面接口返回：/api/ai/pre_strip',
      'color:#fff;background:#ff3b30;padding:4px 10px;border-radius:6px;font-weight:800;'
    )
    console.log(
      '%c[AI-UNDRESS] res.data（醒目重点）',
      'color:#000;background:#ffd60a;padding:3px 8px;border-radius:6px;font-weight:800;',
      res?.data
    )
    console.log(
      '%c[AI-UNDRESS] res（完整）',
      'color:#fff;background:#333;padding:3px 8px;border-radius:6px;font-weight:800;',
      res
    )
    const d = (res?.data ?? {}) as Record<string, unknown>
    stripData.value = {
      // free_num / 次数：兼容后端不同命名
      free_num: pickNumericField(d, [
        'free_num',
        'freeNum',
        'free_times',
        'free_time',
        'free_count',
        'free',
        'num',
        'left_free_num',
        'remain_free_num',
        'ai_ty_free_num'
      ]),
      // coin / 余额：兼容你截图里的 ai_ty_coins
      coin: pickNumericField(d, ['coin', 'coins', 'balance', 'ai_type_coins', 'ai_ty_coin', 'ai_type_coin']),
      // cost_coin / 价格：兼容 cost_coin、need_coin、price 以及 ai_ty_price/ai_strip_price 之类
      cost_coin: pickNumericField(d, [
        'cost_coin',
        'cost',
        'need_coin',
        'needCoins',
        'price',
        'gold_coin',
        'gold',
        // 你当前 pre_strip 返回里：ai_ty_coins=190（支付价格）
        'ai_ty_coins',
        'ai_ty_cost',
        'ai_ty_price',
        'ai_strip_price',
        'strip_price',
        'pay_coin',
        'payCoins'
      ]),
      tips: pickStringField(d, ['tips', 'tip', 'message', 'msg'])
    }
  } catch (error) {
    console.error('获取AI去衣预检查失败:', error)
  }
}

onMounted(() => {
  console.log(
    '%c[AI-UNDRESS] onMounted 触发 fetchPreStrip（即将请求 /api/ai/pre_strip）',
    'color:#fff;background:#0b84ff;padding:4px 10px;border-radius:6px;font-weight:800;'
  )
  fetchPreStrip()
})

function onOversize() {
  __.$Toast({
    message: '超过2M，吐司提示：图片过大，请重新上传',
    position: 'bottom'
  })
}

async function afterRead(file: any) {
  const size = file?.file?.size ?? 0
  if (size > MAX_SIZE) {
    images.value = []
    onOversize()
    return
  }
}

async function onUseFree() {
  if (!images.value.length) return __.$Toast('请先上传图片')
  if (!canUseFree.value) return
  await confirmPay(1)
}

async function onPayCoins() {
  if (!images.value.length) return __.$Toast('请先上传图片')
  if (!canPayCoin.value) return
  showPayPopup.value = true
}

function toRecharge() {
  router.push('/coin-recharge?type=1')
}

/** strip / magic 成功体可能为 { msg } 或包在 data 内 */
function pickTaskMsg(res: any): string | undefined {
  return res?.msg ?? res?.data?.msg
}

async function confirmPay(payType: number) {
  if (!images.value.length) {
    return __.$Toast('请先上传图片')
  }

  try {
    const file = images.value[0]
    // 获取图片尺寸
    const img = new Image()
    img.onload = async () => {
      const res = await __.$Api.AI.strip({
        thumb: file.content || file.url,
        thumb_w: img.width,
        thumb_h: img.height,
        // 约定：1=使用免费次数卡，0=支付金币
        type: payType
      })
      const tip = pickTaskMsg(res)
      if (tip) __.$Toast(tip)
      showPayPopup.value = false
      await __.$Alert({
        title: '提交成功',
        message: '正在生成，稍后请前往 AI科技-我的\n记录中查看',
        confirmButtonText: '朕知道了',
        confirmButtonColor: '#2494ff',
        className: 'ai-undress-success-dialog'
      })
      router.push('/ai/record?_index=2')
    }
    img.src = file.content || file.url
  } catch (error: any) {
    const errorMsg = error?.message || '提交失败'
    __.$Toast(errorMsg)
    console.error('提交AI去衣任务失败:', error)
  }
}
</script>

<template>
  <div class="ai-undress-page">
    <dx-container class="!block">
      <template #default>
        <div class="ai-undress-content">
          <div class="upload-card">
            <van-field class="my-upload" name="uploader" label-align="top">
              <template #input>
                <van-uploader
                  v-model="images"
                  reupload
                  :max-size="MAX_SIZE"
                  :preview-full-image="false"
                  preview-size="160px"
                  accept="image/*"
                  :max-count="1"
                  :after-read="afterRead"
                  @oversize="onOversize"
                >
                  <div v-if="images.length < 1" class="uploader-empty">
                    <img class="uploader-empty-icon" src="~/assets/image-icon/upload_image_2.png" alt="icon" />
                    <span class="uploader-empty-text">
                      点击上传人脸图片
                      <br />
                      图片大小不超过2MB
                    </span>
                  </div>
                  <template #preview-delete>
                    <dx-icon-close class="uploader-delete-icon" />
                  </template>
                </van-uploader>
              </template>
            </van-field>
          </div>

          <div class="example-section">
            <div class="example-title">效果示例图：</div>
            <div class="example-grid">
              <div class="example-item">
                <div class="example-tag">去衣前</div>
                <img class="example-img" :src="beforeImg" alt="去衣前" />
              </div>
              <div class="example-item">
                <div class="example-tag">去衣后</div>
                <img class="example-img" :src="undressedImg" alt="去衣后" />
              </div>
            </div>
          </div>

          <div class="action-bar">
            <div class="action-choice">
              <dx-button
                block
                class="action-choice-btn action-free-btn"
                color="#2494ff"
                :round="false"
                :disabled="!canUseFree"
                @click="onUseFree"
              >
                使用次数卡（可用{{ stripData.free_num }}次）
              </dx-button>
              <dx-button
                block
                class="action-choice-btn action-pay-btn"
                color="#2494ff"
                :round="false"
                :disabled="!canPayCoin"
                @click="onPayCoins"
              >
                支付{{ stripData.cost_coin }}金币
              </dx-button>
            </div>

            <div class="action-bar-text">
              当前余额：{{ stripData.coin }}，
              <button class="action-bar-recharge" type="button" @click="toRecharge">去充值</button>
            </div>
          </div>
        </div>
      </template>
    </dx-container>

    <van-popup v-model:show="showPayPopup" position="bottom" teleport="body" round closeable>
      <div class="pay-popup">
        <div class="pay-popup-title">支付金币</div>
        <div class="pay-popup-row">
          <div class="pay-popup-label">
            金币余额：
            <span class="pay-popup-balance">{{ stripData.coin }}</span>
          </div>
          <button class="pay-popup-recharge" type="button" @click="toRecharge">立即充值</button>
        </div>
        <div class="pay-popup-row">
          <div class="pay-popup-label">支付金额</div>
          <div class="pay-popup-value">{{ stripData.cost_coin }}</div>
        </div>
        <div class="pay-popup-divider" />
        <div class="pay-popup-row pay-popup-row-strong">
          <div class="pay-popup-label">实际支付</div>
          <div class="pay-popup-value pay-popup-value-strong">{{ stripData.cost_coin }}</div>
        </div>
        <button class="pay-popup-btn" type="button" :disabled="!images.length || !canPayCoin" @click="confirmPay(0)">
          立即支付
        </button>
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="postcss">
.ai-undress-page {
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f7;
}

.ai-undress-content {
  padding: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

:deep(.dx-container.container) {
  overflow-y: hidden !important;
}

.upload-card {
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  background: #f0f0f0;
  border: 1px dashed #7a7a7a;
}

.my-upload {
  --van-cell-background: #f0f0f0;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  height: 160px;
}

.my-upload :deep(.van-uploader__preview),
.my-upload :deep(.van-uploader__wrapper),
.my-upload :deep(.van-field__control),
.my-upload :deep(.van-field__body),
.my-upload :deep(.van-uploader),
.my-upload :deep(.van-cell__value) {
  width: 100%;
  height: 160px;
  margin: 0;
}

.my-upload :deep(.van-cell),
.my-upload :deep(.van-field) {
  padding: 0;
}

.my-upload :deep(.van-field__body) {
  width: 100% !important;
}

.my-upload :deep(.van-cell__value) {
  flex: 1 !important;
  min-width: 0;
  width: 100% !important;
}

.my-upload :deep(.van-uploader) {
  display: block;
  width: 100% !important;
}

.my-upload :deep(.van-uploader__wrapper) {
  display: flex;
  flex: 1;
  width: 100% !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.my-upload :deep(.van-uploader__upload),
.my-upload :deep(.van-uploader__preview) {
  width: 100% !important;
  height: 160px;
}

.my-upload :deep(.van-uploader__preview-image),
.my-upload :deep(.van-image),
.my-upload :deep(.van-image__img) {
  width: 100% !important;
  height: 100% !important;
}

.my-upload :deep(.van-image__img) {
  object-fit: cover;
}

.uploader-empty {
  height: 160px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
}

.uploader-empty-icon {
  width: 30px;
  height: 30px;
}

.uploader-empty-text {
  margin-top: 6px;
  text-align: center;
  font-size: 10px;
  line-height: 14px;
  color: #6c6c6c;
}

.uploader-delete-icon {
  width: 16px;
  height: 16px;
  color: #ffffff;
}

.my-upload :deep(.van-uploader__preview-delete) {
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

.my-upload :deep(.van-uploader__preview-delete):active {
  background: rgba(0, 0, 0, 0.6);
}

.example-section {
  margin-top: 18px;
}

.example-title {
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0px;
  margin-bottom: 15px;
}

.example-grid {
  display: flex;
  gap: 15px;
}

.example-item {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: #fff;
  flex: 1;
}

.example-tag {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 1;
  font-family: 'PingFang SC', sans-serif;
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0px;
  padding: 2.5px 5px;
  border-radius: 4px;
  background: #3da7fd;
  color: #fff;
}

.example-img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50px;
  padding: 0 12px;
  z-index: 10;
}

.action-choice {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.action-choice-btn {
  height: 44px;
  font-size: 12px;
}

.action-choice-btn:deep(.van-button--disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}

.action-bar-text {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #a8a8a8;
}

.action-bar-recharge {
  margin: 0;
  padding: 0;
  color: #2494ff;
  background: transparent;
  border: 0;
  font-size: 12px;
  font-family: inherit;
}

:global(.ai-undress-success-dialog) {
  --van-dialog-border-radius: 8px;
}

/* Dialog(theme: round-button) uses .van-action-bar-button for confirm */
:global(.ai-undress-success-dialog .van-action-bar-button),
:global(.ai-undress-success-dialog .van-dialog__confirm),
:global(.ai-undress-success-dialog .van-dialog__footer .van-button) {
  display: block !important;
  width: calc(100% - 48px) !important;
  height: 44px !important;
  min-height: 44px !important;
  border-radius: 8px !important;
}

:global(.ai-undress-success-dialog .van-dialog__footer) {
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

.skeleton {
  background: linear-gradient(90deg, #f2f2f2 25%, #e8e8e8 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: skeleton 1.2s ease-in-out infinite;
}

@keyframes skeleton {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
