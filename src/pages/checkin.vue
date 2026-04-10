<script setup lang="ts">
definePageMeta({
  keepalive: true
})

const __ = useNuxtApp()

type RewardType = 'tx' | 'cj' | 'jf'
type DayStatus = 'signed' | 'today' | 'future'

type CheckinDay = {
  day: number
  rewardType: RewardType
  rewardText: string
  rewardName: string
  rewardTimes: number
  icon: string
  status: DayStatus
  signed: boolean
  canSign: boolean
}

interface CalendarResponse {
  continuous_day: number
  /** 今日是否可签到：true 可点击签到，false 不可点击 */
  is_sign: boolean
  /** 抽奖机会（与签到日历同接口返回） */
  my_chances?: number
  my_points: number
  my_match_card_times: number
  /** 转盘奖品列表（后台配置，与 lottery_items 一致） */
  lottery_items?: Array<{
    id: number
    title: string
    icon: string
    sort: number
  }>
  calendar: Array<{
    day: number
    reward_key: number
    reward_name: string
    reward_times: number
    /** 服务端展示文案，如「10金币」 */
    reward_text?: string
    icon: string
    signed: boolean
    can_sign: boolean
  }>
}

const qiandaoImgs = import.meta.glob('~/assets/image/qiandao/*', {
  eager: true,
  import: 'default'
}) as Record<string, string>

function resolveQiandaoImg(fileName: string) {
  const direct = Object.entries(qiandaoImgs).find(([k]) => k.endsWith(`/${fileName}`))?.[1]
  if (direct) return direct

  // 兼容你当前目录里出现的 “.png.png” 命名
  const fallback = Object.entries(qiandaoImgs).find(([k]) => k.endsWith(`/${fileName}.png`))?.[1]
  if (fallback) return fallback

  return ''
}

// 你给到的素材命名（assets/image/qiandao/）
const img = {
  bg: resolveQiandaoImg('bg.png'),
  // 信息面板/按钮
  panelTop: resolveQiandaoImg('panel-top.png'),
  btnSign: resolveQiandaoImg('btn-sign.png'),
  btnSigned: resolveQiandaoImg('btn-signed.png'),

  // 日历奖励图标（未领取/已领取）
  tx: resolveQiandaoImg('tx.png'),
  cj: resolveQiandaoImg('cj.png'),
  jf: resolveQiandaoImg('jf.png'),
  txSigned: resolveQiandaoImg('tx-signed.png'),
  cjSigned: resolveQiandaoImg('cj-signed.png'),
  jfSigned: resolveQiandaoImg('jf-signed.png'),

  // 抽奖转盘区
  cjBg: resolveQiandaoImg('cj-bg.png'),
  zbBg: resolveQiandaoImg('zb-bg.png'),
  zbFront: resolveQiandaoImg('zb-front.png'),
  zp: resolveQiandaoImg('zp.png'),
  zbCenter: resolveQiandaoImg('zb-center.png'),
  zbBottom: resolveQiandaoImg('zb-bottom.png'),
  zpPointer: resolveQiandaoImg('zp-pointer.png'),
  // 中奖弹框
  qdBg: resolveQiandaoImg('qd.png'),
  zjBg: resolveQiandaoImg('zj.svg'),
  prizeGift: resolveQiandaoImg('gift.png'),
  prizeCoin: resolveQiandaoImg('coin.png'),
  prizeBigCoin: resolveQiandaoImg('bigcoin.png'),
  prizeVip: resolveQiandaoImg('vip.png'),
  prizeVip7: resolveQiandaoImg('vip7.png'),
  prizeVip15: resolveQiandaoImg('vip15.png'),
  prizeAi: resolveQiandaoImg('ai.png'),
  prizeGame: resolveQiandaoImg('game.png')
}

const state = reactive({
  signedDays: 0,
  tomorrowRewardText: '',
  hasSignedToday: false,
  /** 是否允许点击“今日签到”按钮（由 sign/calendar 的 is_sign 控制） */
  canSignToday: false,
  drawChances: 0,
  drawPoints: 0,
  drawPointsPerDraw: 50,
  myMatchCardTimes: 0,
  calendarData: [] as CheckinDay[],
  lotteryItems: [] as Array<{
    id: number
    title: string
    icon: string
    sort: number
  }>
})

const loading = ref(true)

// 获取日历数据
async function fetchCalendarData() {
  try {
    loading.value = true
    const res = await __.$Api.Checkin.calendar()
    const data = res.data as CalendarResponse

    state.signedDays = Number((data as any)?.continuous_day ?? 0) || 0
    state.canSignToday = Boolean(data.is_sign)
    state.drawPoints = data.my_points
    state.myMatchCardTimes = data.my_match_card_times
    if (typeof data.my_chances === 'number') {
      state.drawChances = data.my_chances
    }
    if (data.lottery_items && data.lottery_items.length > 0) {
      state.lotteryItems = data.lottery_items
    }

    // 转换日历数据（接口按连续签到循环返回 calendar 列表，非自然月）
    state.calendarData = data.calendar.map((item) => {
      const rewardTypeMap: Record<number, RewardType> = {
        1: 'tx', // 金币
        2: 'cj'  // 匹配卡
      }
      const rewardType = rewardTypeMap[item.reward_key] || 'jf'

      return {
        day: item.day,
        rewardType,
        rewardName: item.reward_name,
        rewardTimes: item.reward_times,
        icon: item.icon,
        rewardText: item.reward_text || `${item.reward_times}${item.reward_name}`,
        status: item.signed ? 'signed' : item.can_sign ? 'today' : 'future',
        signed: item.signed,
        canSign: item.can_sign
      }
    })

    // 计算明日奖励文本
    const tomorrowDay = state.calendarData.find((d) => d.status === 'today')
    if (tomorrowDay) {
      state.tomorrowRewardText = tomorrowDay.rewardText
      // “是否已签到”不再从日历推断，今日是否可点由 is_sign 控制
      state.hasSignedToday = !state.canSignToday
    } else {
      const nextDay = state.calendarData.find((d) => d.status === 'future')
      if (nextDay) {
        state.tomorrowRewardText = nextDay.rewardText
      }
    }
  } catch (error) {
    console.error('获取签到日历失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCalendarData()
  fetchDrawConf()
})

// 获取抽奖配置
async function fetchDrawConf() {
  try {
    const res = await __.$Api.Game.drawConf({})
    const data = (res?.data?.list || res?.data || {}) as {
      items: Array<{
        id: number
        title: string
        icon: string
        sort: number
      }>
      my_chances: number
      my_points: number
      points_per_draw: number
    }

    // 更新抽奖机会次数、积分、每次抽奖消耗的积分和奖品列表
    state.drawChances = data.my_chances || 0
    state.drawPoints = data.my_points || 0
    state.drawPointsPerDraw = data.points_per_draw || 50
    state.lotteryItems = data.items || []

    console.log('抽奖配置:', data)
  } catch (error) {
    console.error('获取抽奖配置失败:', error)
  }
}

type PrizeKey = 'gift' | 'coin' | 'bigcoin' | 'vip' | 'vip7' | 'vip15' | 'ai' | 'game'
const showPrize = ref(false)
const prizeKey = ref<PrizeKey>('gift')
const showCheckinPopup = ref(false)
const showSignRecord = ref(false)
const showLotteryRecord = ref(false)

const prizeMap = computed(() => {
  return {
    gift: { title: '视频福利包', img: img.prizeGift },
    coin: { title: '金币', img: img.prizeCoin },
    bigcoin: { title: '大额金币', img: img.prizeBigCoin },
    vip: { title: 'VIP会员', img: img.prizeVip },
    vip7: { title: '7天VIP', img: img.prizeVip7 },
    vip15: { title: '15天VIP', img: img.prizeVip15 },
    ai: { title: 'AI体验券', img: img.prizeAi },
    game: { title: '游戏礼包', img: img.prizeGame }
  } satisfies Record<PrizeKey, { title: string; img: string }>
})

function pickRandomPrize() {
  const keys = Object.keys(prizeMap.value) as PrizeKey[]
  return keys[Math.floor(Math.random() * keys.length)] || 'gift'
}

/** 抽奖机会：至少 1 次才可抽 */
const canDrawByChance = computed(() => state.drawChances >= 1)
/** 积分抽奖：不少于后台单次消耗才可抽 */
const canDrawByPoints = computed(() => state.drawPoints >= state.drawPointsPerDraw)

function onLotteryClick(type: 'chance' | 'points') {
  handleLottery(type)
}

async function handleLottery(type: 'chance' | 'points') {
  if (type === 'chance' && !canDrawByChance.value) return
  if (type === 'points' && !canDrawByPoints.value) return
  try {
    const res =
      type === 'points'
        ? await __.$Api.TaskLottery.drawByPoints({})
        : await __.$Api.TaskLottery.drawByChance({})

    // 只负责触发接口并展示奖品弹框；展示逻辑目前仍用随机奖品
    prizeKey.value = pickRandomPrize()
    showPrize.value = true

    console.log('抽奖结果:', (res as any)?.data ?? res)

    // 同步积分、抽奖机会等与后端一致（并更新日历上的积分展示）
    await fetchCalendarData()
    await fetchDrawConf()
  } catch (error) {
    console.error('抽奖失败:', error)
  }
}

function closePrize() {
  showPrize.value = false
}

const prizePopupBg = computed(() => img.zjBg)
const prizeMessage = computed(() => {
  const t = prizeMap.value[prizeKey.value]?.title || '奖品'
  return `恭喜获得${t}，奖品将自动发放至账户，请在相关页面查看使用。`
})

function onSignClick() {
  if (!state.canSignToday) return
  if (state.hasSignedToday) return
  handleSign()
}

async function handleSign() {
  try {
    await __.$Api.Checkin.sign({})
    state.hasSignedToday = true
    showCheckinPopup.value = true
    // 日历（连续天数、积分等）+ 抽奖区机会/积分与配置
    await fetchCalendarData()
    await fetchDrawConf()
  } catch (error) {
    console.error('签到失败:', error)
  }
}

function closeCheckinPopup() {
  showCheckinPopup.value = false
}

const signRecords = ref<Array<{
  id: string | number
  time: string
  text: string
}>>([])

// 获取签到记录
async function fetchSignRecords() {
  try {
    const res = await __.$Api.Checkin.records({ page: 1, limit: 20 })
    // 兼容不同接口返回形态：有的返回在 `res.data`，有的在 `res.data.data`
    const payload = (res as any)?.data ?? res
    const list: Array<any> = payload?.list ?? payload?.data?.list ?? []

    signRecords.value = list.map((item, index) => ({
      id: item?.id ?? index,
      time: String(item?.created_at ?? item?.sign_date ?? ''),
      text: `${item?.reward_name ?? ''}+${item?.reward_times ?? 0}`
    }))
  } catch (error) {
    console.error('获取签到记录失败:', error)
    signRecords.value = []
  }
}

const lotteryRecords = ref<Array<{
  id: string | number
  time: string
  consume: string
  prize: string
}>>([])

// 获取抽奖记录（任务抽奖 /api/tasklottery/logs，非 Game.drawList）
async function fetchLotteryRecords() {
  try {
    const res = await __.$Api.TaskLottery.logs({})
    const payload = (res as any)?.data ?? res
    const list: Array<any> = payload?.list ?? []

    lotteryRecords.value = list.map((item: any) => ({
      id: item.id,
      time: String(item.created_at ?? ''),
      consume: String(item.cost_desc ?? ''),
      prize: String(item.title ?? '')
    }))
  } catch (error) {
    console.error('获取抽奖记录失败:', error)
    lotteryRecords.value = []
  }
}

const days = computed<CheckinDay[]>(() => {
  return state.calendarData
})

// 抽奖奖品列表
const lotteryItems = computed(() => {
  return state.lotteryItems || []
})

// 计算奖品的位置（10项围绕中心点排列）
const prizePositions = computed(() => {
  const items = lotteryItems.value
  const count = items.length
  const radius = 130 // 距离中心的半径

  return items.map((item, index) => {
    const angle = (index / count) * 360 - 90 // 从顶部开始
    const rad = (angle * Math.PI) / 180
    const x = Math.cos(rad) * radius
    const y = Math.sin(rad) * radius

    return {
      ...item,
      x,
      y,
      angle
    }
  })
})

function isRemoteIconUrl(url: string) {
  const u = url?.trim() ?? ''
  return u.startsWith('http://') || u.startsWith('https://') || u.startsWith('//')
}

/** 日历格本地兜底图（按 reward_key）；远程图请在模板里用 v-lazyLoad，走 worker 解密 */
function getDayIcon(day: CheckinDay) {
  if (day.status === 'signed') {
    return day.rewardType === 'tx' ? img.txSigned : day.rewardType === 'cj' ? img.cjSigned : img.jfSigned
  }
  return day.rewardType === 'tx' ? img.tx : day.rewardType === 'cj' ? img.cj : img.jf
}
</script>

<template>
  <div class="checkin-page" :style="{ backgroundImage: img.bg ? `url(${img.bg})` : '' }">
    <dx-navbar class="checkin-navbar">
      <template #title>
        <div class="checkin-nav-title">签到</div>
      </template>
    </dx-navbar>
    <img class="checkin-panel-bg" :src="img.panelTop" alt="" />

    <!-- 信息面板 + 签到按钮（整块用图做底） -->
    <div class="checkin-panel">
      <div class="checkin-panel-content">
        <div class="checkin-panel-left">
          <div class="checkin-panel-line">明日签到可得：{{ state.tomorrowRewardText }}</div>
          <div class="checkin-panel-sub">
            <span>已连续签到：{{ state.signedDays }}天</span>
            <button class="checkin-panel-link" type="button"
              @click="() => { showSignRecord = true; fetchSignRecords() }">签到记录</button>
          </div>
        </div>

        <button class="checkin-panel-btn" type="button" :disabled="!state.canSignToday || state.hasSignedToday">
          <img class="checkin-panel-btn-img" :src="state.hasSignedToday ? img.btnSigned : img.btnSign" alt="签到"
            @click="onSignClick" />
        </button>
      </div>
      <!-- 30天日历（只做上半部分：到这里为止） -->
      <div class="checkin-calendar">
        <div class="checkin-grid">
          <div v-for="d in days" :key="d.day" class="checkin-cell" :class="[`is-${d.status}`]">
            <div class="checkin-cell-icon">
              <img
                v-if="isRemoteIconUrl(d.icon)"
                :key="d.icon"
                v-lazyLoad="d.icon.trim()"
                class="checkin-cell-icon-img"
                alt=""
              />
              <img v-else class="checkin-cell-icon-img" :src="getDayIcon(d)" alt="" />
              <div class="checkin-cell-text">{{ d.rewardText }}</div>
            </div>
            <div class="checkin-cell-pill" :class="{ 'is-today': d.status === 'today' }">
              {{ d.status === 'today' ? '今天' : `第${d.day}天` }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 抽奖转盘区 -->
    <div class="lottery">
      <img class="lottery-bg" :src="img.cjBg" alt="" />
      <div class="lottery-content">
        <div class="lottery-content-top">
          <div class="lottery-head">
            <div class="lottery-title">抽奖得好礼</div>
            <button class="lottery-link" type="button"
              @click="() => { showLotteryRecord = true; fetchLotteryRecords() }">抽奖记录</button>
          </div>
          <div class="lottery-meta">
            <div class="lottery-meta-item">我的抽奖机会：{{ state.drawChances }}</div>
            <div class="lottery-meta-item">我的抽奖积分：{{ state.drawPoints }}</div>
          </div>
        </div>

        <div class="wheel">
          <div class="wheel-stack">
            <div class="wheel-prizes">
              <div v-for="prize in prizePositions" :key="prize.id" class="wheel-prize-item" :style="{
                transform: `rotate(${prize.angle + 90}deg)`
              }">

                <div class="wheel-prize-title">{{ prize.title }}</div>
                <!--  -->
                <div class="wheel-prize-icon">
                  <img v-if="prize.icon" :src="prize.icon" alt="" />
                </div>
              </div>
            </div>
            <div class="wheel-disk">
              <img class="wheel-disk-layer" :src="img.zbBg" alt="" />
              <img class="wheel-disk-layer" :src="img.zbFront" alt="" />
              <img class="wheel-disk-center" :src="img.zbCenter" alt="" />
              <img class="wheel-pointer" :src="img.zpPointer" alt="" />
            </div>
          </div>
          <img class="wheel-base" :src="img.zbBottom" alt="" />
        </div>
      </div>
    </div>
    <div class="lottery-actions">
      <button class="lottery-btn lottery-btn-yellow" type="button" :disabled="!canDrawByChance"
        @click="onLotteryClick('chance')">抽奖机会</button>
      <button class="lottery-btn lottery-btn-blue" type="button" :disabled="!canDrawByPoints"
        @click="onLotteryClick('points')">{{ state.drawPointsPerDraw }}积分抽奖</button>
    </div>
  </div>

  <van-popup v-model:show="showPrize" teleport="body" :close-on-click-overlay="false" class="zj-popup">
    <div class="zj-card" :style="{ backgroundImage: prizePopupBg ? `url(${prizePopupBg})` : '' }">
      <div class="zj-desc">{{ prizeMessage }}</div>
      <div class="zj-prize">
        <img class="zj-prize-img" :src="prizeMap[prizeKey].img" :alt="prizeMap[prizeKey].title" />
      </div>
      <button class="zj-ok" type="button" @click="closePrize">朕知道了</button>
    </div>
  </van-popup>

  <van-popup v-model:show="showCheckinPopup" teleport="body" :close-on-click-overlay="false" class="qd-popup">
    <div class="qd-card" :style="{ backgroundImage: img.qdBg ? `url(${img.qdBg})` : '' }">
      <div class="qd-text">恭喜获得一次抽奖机会</div>
      <div class="qd-wheel">
        <img class="qd-wheel-img" :src="img.zp" alt="" />
      </div>
      <button class="qd-ok" type="button" @click="closeCheckinPopup">美美收下</button>
    </div>
  </van-popup>

  <van-popup v-model:show="showSignRecord" teleport="body" position="bottom" round closeable class="record-popup">
    <div class="record">
      <div class="record-title">签到记录</div>
      <div class="record-list">
        <div v-for="row in signRecords" :key="row.id" class="record-row">
          <div class="record-time">{{ row.time }}</div>
          <div class="record-right record-right-blue">{{ row.text }}</div>
        </div>
      </div>
    </div>
  </van-popup>

  <van-popup v-model:show="showLotteryRecord" teleport="body" position="bottom" round closeable class="record-popup">
    <div class="record">
      <div class="record-title">抽奖记录</div>
      <div class="record-list">
        <div v-for="row in lotteryRecords" :key="row.id" class="record-row record-row-3">
          <div class="record-time">{{ row.time }}</div>
          <div class="record-mid">{{ row.consume }}</div>
          <div class="record-right record-right-blue">{{ row.prize }}</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.checkin-page {
  min-height: 100vh;
  padding: 12px;
  box-sizing: border-box;
  background-color: #f8faff;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
  padding-top: 60px;
}

.checkin-navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 10;
}

.checkin-navbar :deep(.van-nav-bar) {
  background: transparent !important;
}

.checkin-navbar :deep(.van-nav-bar__content) {
  height: 48px;
}

.checkin-nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
}

.checkin-panel {
  position: relative;
  border-radius: 12px;
  margin-top: -40px;
  overflow: hidden;
  background: #f6fbff;
  box-shadow: 0px 4px 4px 0px #79acff40;
}

.checkin-panel-bg {
  width: 100%;
  height: auto;
  display: block;
}

.checkin-panel-content {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  margin: 12px;
  box-sizing: border-box;
  gap: 10px;
  border-radius: 8px;
  background: linear-gradient(90deg, #ecf5ff 0%, #f2f8ff 100%);
}

.checkin-panel-left {
  font-size: 12px;
  color: #333;
}

.checkin-panel-line {
  font-weight: 700;
  margin-bottom: 6px;
}

.checkin-panel-sub {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #6c6c6c;
}

.checkin-panel-link {
  color: #2494ff;
  border: 0;
  background: transparent;
  padding: 0;
}

.checkin-panel-btn {
  border: 0;
  padding: 0;
  background: transparent;
}

.checkin-panel-btn-img {
  width: 82px;
  height: auto;
  display: block;
}

.checkin-calendar {
  border-radius: 14px;
  padding: 10px;
}

.checkin-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px 8px;
}

.checkin-cell {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
  text-align: center;
  padding-bottom: 28px;
  background: transparent;
}

.checkin-cell.is-signed {
  opacity: 0.95;
}

.checkin-cell.is-today {
  opacity: 1;
}

.checkin-cell-icon {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
  padding: 3px 2px;
  border-radius: 6px;
  gap: 4px;
}

.checkin-cell.is-future .checkin-cell-icon {
  background: #eaf3ff;
}

.checkin-cell.is-signed .checkin-cell-icon {
  background: rgba(176, 176, 176);
}

.checkin-cell.is-today .checkin-cell-icon {
  background: linear-gradient(90deg, #ff3b30 0%, #ff9500 100%);
}

.checkin-cell-icon-img {
  width: 26px;
  height: 26px;
  display: block;
}

.checkin-cell-text {
  font-size: 8px;
  color: #4c4c4c;
  font-weight: 600;
  line-height: 16px;
}

.checkin-cell.is-future .checkin-cell-text {
  color: #1d70b9;
}

.checkin-cell.is-signed .checkin-cell-text,
.checkin-cell.is-today .checkin-cell-text {
  color: #ffffff;
}

.checkin-cell-pill {
  position: absolute;
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
  padding: 0 10px;
  height: 20px;
  border-radius: 999px;
  color: #666666;
  font-size: 10px;
  line-height: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.checkin-cell.is-future .checkin-cell-pill {
  background: #eaf3ff;
}

.checkin-cell.is-signed .checkin-cell-pill {
  background: rgba(176, 176, 176);
  color: #ffffff;
}

.checkin-cell.is-today .checkin-cell-pill {
  background: linear-gradient(90deg, #ff3b30 0%, #ff9500 100%);
  color: #ffffff;
}

.checkin-cell-pill.is-today {
  background: linear-gradient(90deg, #ff3b30 0%, #ff9500 100%);
  color: #ffffff;
}

.lottery {
  position: relative;
  margin-top: 12px;
  border-radius: 14px;
  overflow: hidden;
}

.lottery-bg {
  width: 100%;
  height: auto;
  display: block;
}

.lottery-content {
  position: absolute;
  inset: 0;
  padding: 12px 12px 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.lottery-content-top {
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, #fff1ee 0%, #fff3f2 100%);
  border-radius: 12px;
  padding: 12px;
}

.lottery-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lottery-title {
  font-size: 16px;
  font-weight: 700;
  color: #2d2d2d;
}

.lottery-link {
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  color: #d81e06;
}

:global(.record-popup.van-popup--bottom) {
  max-height: 78vh;
}

.record {
  padding: 14px 14px 18px;
}

.record-title {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  padding: 4px 0 10px;
}

.record-list {
  max-height: 62vh;
  overflow: auto;
}

.record-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
  padding: 10px 4px;
  font-size: 13px;
  color: #6c6c6c;
}

.record-row-3 {
  grid-template-columns: 140px 1fr auto;
}

.record-time {
  color: #9b9b9b;
}

.record-mid {
  color: #6c6c6c;
}

.record-right {
  text-align: right;
  white-space: nowrap;
}

.record-right-blue {
  color: #1d70b9;
}

.lottery-meta {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #6c6c6c;
}

.wheel {
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: visible;
}

.wheel-stack {
  width: 100%;
  max-width: 360px;
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wheel-disk {
  width: 330px;
  height: 330px;
  position: relative;
  flex: 0 0 auto;
  flex-direction: column;
}

.wheel-prizes {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
  z-index: 10;
}

.wheel-prize-item {
  position: absolute;
  width: 60px;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  transform-origin: center bottom;
  padding-bottom: 20%;
}

.wheel-prize-icon {
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.5px;
}

.wheel-prize-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wheel-prize-title {
  font-size: 10px;
  color: #d81e06;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
}

.wheel-disk-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.wheel-disk-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 86px;
  height: 86px;
  object-fit: contain;
  display: block;
  z-index: 6;
}

.wheel-pointer {
  position: absolute;
  left: 50%;
  top: 0px;
  transform: translateX(-50%);
  width: 124px;
  height: auto;
  display: block;
  z-index: 5;
}

.wheel-base {
  margin-top: -40px;
  width: 100%;
  height: auto;
  display: block;
  pointer-events: none;
  z-index: 2;
}

.lottery-actions {
  margin-top: 12px;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.lottery-btn {
  height: 56px;
  border: 0;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
}

.lottery-btn-yellow {
  background: linear-gradient(90deg, #f7b500 0%, #ffcc4d 100%);
  color: #7a4b00;
}

.lottery-btn-blue {
  background: #2494ff;
  color: #ffffff;
}

.lottery-btn:disabled {
  cursor: not-allowed;
  opacity: 1;
  background: #e8e8e8 !important;
  color: #a3a3a3 !important;
  box-shadow: none;
}

:global(.van-popup.zj-popup:not(.van-popup--bottom):not(.van-toast)) {
  width: calc(100vw - 24px) !important;
  max-width: calc(100vw - 24px) !important;
  background: transparent !important;
  box-sizing: border-box !important;
}

.zj-card {
  width: 100%;
  max-width: 380px;
  aspect-ratio: 966 / 1182;
  border-radius: 22px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  padding: 86px 26px 22px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.zj-desc {
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  padding: 0 8px;
}

.zj-prize {
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
}

.zj-prize-img {
  width: 130px;
  height: 130px;
  object-fit: contain;
  display: block;
}

.zj-ok {
  width: 82%;
  height: 56px;
  border-radius: 10px;
  border: 0;
  background: #ff3b30;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}

:global(.van-popup.qd-popup:not(.van-popup--bottom):not(.van-toast)) {
  width: calc(100vw - 24px) !important;
  max-width: calc(100vw - 24px) !important;
  background: transparent !important;
  box-sizing: border-box !important;
}

.qd-card {
  width: 100%;
  max-width: 390px;
  aspect-ratio: 966 / 1182;
  border-radius: 22px;
  background-repeat: no-repeat;
  background-position: right center;
  background-size: contain;
  box-sizing: border-box;
  position: relative;
  padding: 100px 0px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qd-text {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
}

.qd-wheel {
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
}

.qd-wheel-img {
  width: 130px;
  height: 130px;
  object-fit: contain;
  display: block;
}

.qd-ok {
  width: 82%;
  height: 56px;
  border-radius: 10px;
  border: 0;
  background: #2494ff;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}
</style>
