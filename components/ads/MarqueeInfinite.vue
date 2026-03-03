<template>
  <div ref="root" class="marquee" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="onPointerUp"
    @pointerleave="onPointerLeave" @pointerenter="onPointerEnter">
    <div ref="track" class="track" :style="trackStyle">
      <!-- 重复渲染多份以实现无缝循环 -->
      <div v-for="(item, index) in renderItems" :key="index" class="item">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  /** 像素/秒，数值越大滚得越快 */
  speed: { type: Number, default: 40 },
  /** item 之间的间距（px），如 '16px' */
  gap: { type: String, default: '16px' },
  /** 渲染多少份副本以保证无缝（2~6 之间即可） */
  copies: { type: Number, default: 2 }
})

const root = ref(null)
const track = ref(null)

const isPaused = ref(false)
const dragging = ref(false)
const offsetX = ref(0) // 当前滚动偏移
let unitWidth = 0 // 单份内容总宽（含间距）
let rafId = null
let lastTs = 0

// 拖拽态
let pointerId = null
let dragStartClientX = 0
let dragStartOffset = 0
const DRAG_THRESHOLD = 8 // px - 超过阈值才认定为拖拽
let moved = false // 本次指针交互是否发生过拖拽（超过阈值）

// NEW: 统一的暂停来源标志
const hoverPaused = ref(false) // 鼠标悬停导致的暂停（仅 PC 鼠标）
const downPaused = ref(false) // 指针按下导致的暂停（触控/鼠标通用）
const prmPaused = ref(false) // 系统“减少动画偏好”导致的暂停

function updatePaused() {
  isPaused.value = hoverPaused.value || downPaused.value || prmPaused.value || dragging.value
}

const baseItems = computed(() => props.items || [])

const renderItems = computed(() => {
  const base = baseItems.value
  if (!base.length) return []
  if (base.length <= 6) return base
  const n = Math.max(2, Math.min(6, props.copies))
  const out = new Array(base.length * n)
  for (let i = 0; i < out.length; i++) out[i] = base[i % base.length]
  return out
})

const trackStyle = computed(() => {
  const w = unitWidth || 1
  const x = -(((offsetX.value % w) + w) % w)
  return {
    transform: `translate3d(${x}px,0,0)`,
    transition: 'none',
    gap: props.gap
  }
})

function tick(ts) {
  if (!lastTs) lastTs = ts
  const dt = (ts - lastTs) / 1000
  lastTs = ts

  if (!isPaused.value && !dragging.value && unitWidth > 0) {
    offsetX.value += props.speed * dt
  }
  rafId = requestAnimationFrame(tick)
}

function start() {
  cancel()
  lastTs = 0
  rafId = requestAnimationFrame(tick)
}

function cancel() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
}

/** 重新测量单份内容的宽度（含间距） */
async function measure() {
  await nextTick()
  if (!track.value) return
  const total = track.value.scrollWidth
  if (baseItems.value.length <= 6) {
    unitWidth = Math.max(1, Math.round(total))
  } else {
    const n = Math.max(2, Math.min(6, props.copies))
    unitWidth = Math.max(1, Math.round(total / n))
  }
}

/** NEW: PC 鼠标滑入暂停 */
function onPointerEnter(e) {
  if (e.pointerType === 'mouse') {
    hoverPaused.value = true
    updatePaused()
  }
}

/** NEW: 离开时恢复 hover 暂停，并复用指针收尾逻辑 */
function onPointerLeave(e) {
  if (e.pointerType === 'mouse') {
    hoverPaused.value = false
  }
  onPointerUp(e) // 确保离开时也结束按下/拖拽等状态
}

/** Pointer 事件：按下立刻暂停；超过阈值才进入拖拽态并 capture 指针 */
function onPointerDown(e) {
  if (baseItems.value.length > 6) {
    pointerId = e.pointerId
    dragging.value = false
    moved = false
    dragStartClientX = e.clientX
    dragStartOffset = offsetX.value

    // NEW: 按下即暂停（不等拖拽阈值）
    downPaused.value = true
    updatePaused()

    window.addEventListener('pointermove', onPointerMove, { passive: false })
  }
}

function onPointerMove(e) {
  if (!pointerId || e.pointerId !== pointerId) return
  const dx = e.clientX - dragStartClientX
  if (!dragging.value && Math.abs(dx) >= DRAG_THRESHOLD) {
    dragging.value = true
    // NEW: 不再直接改 isPaused，由统一函数管理
    root.value?.setPointerCapture?.(pointerId)
    updatePaused()
  }

  if (dragging.value) {
    e.preventDefault()
    offsetX.value = dragStartOffset - dx
  }
}

function onPointerUp(e) {
  if (pointerId && e.pointerId !== pointerId) return

  if (moved) {
    const stopOnce = ev => {
      ev.stopPropagation()
    }
    root.value?.addEventListener('click', stopOnce, { capture: true, once: true })
  }

  dragging.value = false
  pointerId = null
  window.removeEventListener('pointermove', onPointerMove)

  // NEW: 松手后取消“按下暂停”；若仍在 hover，则继续暂停
  downPaused.value = false
  updatePaused()
}

/** 可见性变化：回到可见时重启帧循环；暂停状态由各标志决定 */
const onVis = () => {
  if (document.visibilityState === 'visible') {
    lastTs = 0
    updatePaused()
  }
}

/** 系统减少动画偏好 */
const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
const handlePRM = () => {
  prmPaused.value = !!mql?.matches
  updatePaused()
}

let ro // ResizeObserver

onMounted(async () => {
  await measure()
  ro = new ResizeObserver(() => measure())
  if (track.value) ro.observe(track.value)
  if (root.value) ro.observe(root.value)
  window.addEventListener('resize', measure)

  document.addEventListener('visibilitychange', onVis)
  mql?.addEventListener?.('change', handlePRM)
  handlePRM()

  if (baseItems.value.length > 6) start()
})

onBeforeUnmount(() => {
  cancel()
  ro?.disconnect?.()
  window.removeEventListener('resize', measure)
  document.removeEventListener('visibilitychange', onVis)
  mql?.removeEventListener?.('change', handlePRM)
  window.removeEventListener('pointermove', onPointerMove)
})

// 监听数据变化，重测并按需重启动画
watch(
  () => [props.items, props.gap, props.copies, props.speed],
  async () => {
    await measure()
    if (baseItems.value.length > 6) {
      start()
    } else {
      cancel()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.marquee {
  width: 100%;
  overflow: hidden;
  /* 横向跑马灯，允许页面纵向滚动，避免触摸冲突 */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-drag: none;
  cursor: grab;
}

.marquee:active {
  cursor: grabbing;
}

.track {
  display: inline-flex;
  will-change: transform;
}

.item {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
</style>
