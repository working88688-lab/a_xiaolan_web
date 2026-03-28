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

async function fetchPreStrip() {
  try {
    const res = await __.$Api.AI.preStrip({})
    const d = res?.data as Partial<PreStripData> | undefined
    if (d) {
      stripData.value = {
        free_num: Number(d.free_num ?? 0),
        coin: Number(d.coin ?? 0),
        cost_coin: Number(d.cost_coin ?? 0),
        tips: d.tips ?? ''
      }
    }
  } catch (error) {
    console.error('获取AI去衣预检查失败:', error)
  }
}

onMounted(() => {
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

async function onPay() {
  if (!images.value.length) {
    return __.$Toast('请先上传图片')
  }
  showPayPopup.value = true
}

function toRecharge() {
  router.push('/coin-recharge?type=1')
}

/** strip / magic 成功体可能为 { msg } 或包在 data 内 */
function pickTaskMsg(res: any): string | undefined {
  return res?.msg ?? res?.data?.msg
}

async function confirmPay() {
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
        thumb_h: img.height
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
                    <nuxt-icon class="uploader-delete-icon" name="minus" />
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
            <dx-button
              block
              class="action-bar-btn"
              color="#2494ff"
              :round="false"
              :disabled="!images.length"
              @click="onPay"
            >
              支付{{ stripData.cost_coin }}金币
            </dx-button>
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
        <button class="pay-popup-btn" type="button" :disabled="!images.length" @click="confirmPay">立即支付</button>
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="postcss">
.ai-undress-page {
  min-height: 100vh;
  background-color: #f5f5f7;
}

.ai-undress-content {
  padding: 12px;
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
  width: 36px;
  height: 36px;
  padding: 6px;
  border-radius: 999px;
  background: #ffffff;
  color: var(--dx-primary-color, #2494ff);
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

.action-bar-btn {
  height: 44px;
  font-size: 13px;
}

.action-bar-btn:deep(.van-button--disabled) {
  opacity: 0.45;
  cursor: not-allowed;
}

.action-bar-text {
  margin-top: 20px;
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
