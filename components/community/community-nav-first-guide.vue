<template>
  <Teleport to="body">
    <div v-if="ready" class="cnfg-root" role="dialog" aria-modal="true" aria-labelledby="cnfg-title">
      <!-- 镂空遮罩：仅视觉，不拦截点击 -->
      <svg class="cnfg-svg" aria-hidden="true">
        <defs>
          <mask :id="maskId">
            <rect width="100%" height="100%" fill="white" />
            <rect :x="m.x" :y="m.y" :width="m.w" :height="m.h" :rx="m.rx" fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.58)" :mask="`url(#${maskId})`" />
      </svg>

      <!-- 高亮描边 -->
      <div
        class="cnfg-ring"
        :style="{
          top: `${m.y}px`,
          left: `${m.x}px`,
          width: `${m.w}px`,
          height: `${m.h}px`,
          borderRadius: `${m.rx}px`
        }"
      />

      <!-- 暗区点击关闭（镂空处可点到下方「同圈」） -->
      <button type="button" class="cnfg-strip cnfg-strip--top" :style="stripTop" @click="emitDismiss" />
      <button type="button" class="cnfg-strip cnfg-strip--bottom" :style="stripBottom" @click="emitDismiss" />
      <button type="button" class="cnfg-strip cnfg-strip--left" :style="stripLeft" @click="emitDismiss" />
      <button type="button" class="cnfg-strip cnfg-strip--right" :style="stripRight" @click="emitDismiss" />

      <!-- 气泡（点空白处也可关闭） -->
      <div class="cnfg-panel" :style="panelStyle" role="presentation" @click="emitDismiss">
        <div class="cnfg-arrow" aria-hidden="true" />
        <div id="cnfg-title" class="cnfg-title">新手提示</div>
        <p class="cnfg-body">
          「同圈」支持快速匹配、完善资料与偏好标签，帮你找到更聊得来的人。点按顶部「同圈」即可进入；首次使用可先完成匹配设置。
        </p>
        <button type="button" class="cnfg-btn" @click.stop="emitDismiss">我知道了</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { useId } from 'vue'

const props = defineProps<{
  /** dx-tabs（内层 van-tabs）组件实例 ref */
  tabsRef: { $el?: HTMLElement } | null
}>()

const emit = defineEmits<{
  dismiss: []
}>()

const maskId = useId()

const vw = ref(0)
const vh = ref(0)
const hole = ref({ x: 0, y: 0, w: 0, h: 0, rx: 10 })
const ready = ref(false)

const pad = 6

const m = computed(() => hole.value)

function emitDismiss() {
  emit('dismiss')
}

function readViewport() {
  if (typeof window === 'undefined') return
  vw.value = window.innerWidth
  vh.value = window.innerHeight
}

function measure() {
  readViewport()
  const root =
    props.tabsRef?.$el ??
    (typeof document !== 'undefined' ? document.querySelector('.community-page-root .van-tabs') : null)
  if (!root) return false
  const items = root.querySelectorAll('.van-tabs__nav .van-tab')
  /** 关注 / 原创 / 同圈 / 求片 */
  const target = items[2] as HTMLElement | undefined
  if (!target) return false
  const r = target.getBoundingClientRect()
  if (r.width <= 0 || r.height <= 0) return false
  hole.value = {
    x: Math.max(0, r.left - pad),
    y: Math.max(0, r.top - pad),
    w: r.width + pad * 2,
    h: r.height + pad * 2,
    rx: 10
  }
  return true
}

function tryMeasure() {
  if (measure()) {
    ready.value = true
    return true
  }
  return false
}

let retryTimer: ReturnType<typeof setTimeout> | null = null

function scheduleMeasure() {
  readViewport()
  if (tryMeasure()) {
    if (retryTimer != null) {
      clearTimeout(retryTimer)
      retryTimer = null
    }
    return
  }
  retryTimer = setTimeout(() => {
    retryTimer = null
    tryMeasure()
  }, 120)
}

const stripTop = computed(() => ({
  top: '0',
  left: '0',
  width: '100%',
  height: `${Math.max(0, m.value.y)}px`
}))

const stripBottom = computed(() => ({
  top: `${m.value.y + m.value.h}px`,
  left: '0',
  width: '100%',
  height: `${Math.max(0, vh.value - m.value.y - m.value.h)}px`
}))

const stripLeft = computed(() => ({
  top: `${m.value.y}px`,
  left: '0',
  width: `${Math.max(0, m.value.x)}px`,
  height: `${m.value.h}px`
}))

const stripRight = computed(() => ({
  top: `${m.value.y}px`,
  left: `${m.value.x + m.value.w}px`,
  width: `${Math.max(0, vw.value - m.value.x - m.value.w)}px`,
  height: `${m.value.h}px`
}))

const panelStyle = computed(() => {
  const top = m.value.y + m.value.h + 14
  return {
    top: `${top}px`,
    left: '50%',
    transform: 'translateX(-50%)'
  }
})

onMounted(() => {
  nextTick(() => {
    scheduleMeasure()
    requestAnimationFrame(scheduleMeasure)
  })
  if (typeof window === 'undefined') return
  useEventListener(window, 'resize', scheduleMeasure)
  useEventListener(window, 'scroll', scheduleMeasure, { capture: true })
})

watch(
  () => props.tabsRef,
  () => scheduleMeasure(),
  { deep: true }
)
</script>

<style scoped>
.cnfg-root {
  position: fixed;
  inset: 0;
  z-index: 100600;
  pointer-events: none;
}

.cnfg-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cnfg-ring {
  position: fixed;
  box-sizing: border-box;
  border: 2px solid rgba(255, 255, 255, 0.95);
  pointer-events: none;
  z-index: 1;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.cnfg-strip {
  position: fixed;
  z-index: 2;
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
}

.cnfg-panel {
  position: fixed;
  z-index: 3;
  width: min(340px, calc(100vw - 28px));
  box-sizing: border-box;
  padding: 16px 16px 14px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
  text-align: left;
}

.cnfg-arrow {
  position: absolute;
  top: -8px;
  left: 50%;
  margin-left: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #fff;
  filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.04));
}

.cnfg-title {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0 0 10px;
  line-height: 1.35;
}

.cnfg-body {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.55;
  color: #444;
}

.cnfg-btn {
  width: 100%;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: #2494ff;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.cnfg-btn:active {
  opacity: 0.92;
}
</style>
