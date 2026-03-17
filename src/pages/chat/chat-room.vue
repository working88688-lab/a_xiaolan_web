<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const title = computed(() => String(route.query.name?.slice(0, 3) || '聊天室'))
const composerMode = ref<'text' | 'voice'>('text')
const showMore = ref(false)

function onBack() {
  router.back()
}

function toggleMode() {
  composerMode.value = composerMode.value === 'text' ? 'voice' : 'text'
  showMore.value = false
}

function toggleMore() {
  showMore.value = !showMore.value
}
</script>

<template>
  <div class="chat-room">
    <dx-navbar class="chat-navbar" @click-left="onBack">
      <template #title>
        <div class="chat-title">{{ title }}</div>
      </template>
      <template #right>
        <div class="chat-right-pill">
          <span class="chat-right-text">可发送消息数量：0</span>
          <span class="chat-right-plus">＋</span>
        </div>
      </template>
    </dx-navbar>

    <div class="chat-tip">请勿发送广告等违规消息，谨防私下交易上当受骗。违规用户将被永久禁言处理。</div>

    <div class="chat-body">
      <div class="chat-msg">
        <div class="chat-avatar" />
        <div class="chat-voice">
          <div class="chat-voice-icon" />
          <div class="chat-voice-bars">
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
            <span class="bar" />
          </div>
          <div class="chat-voice-dur">12"</div>
        </div>
      </div>
    </div>

    <div class="chat-composer-wrap">
      <div class="chat-composer">
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
          <button v-else class="chat-press-talk" type="button">按住说话</button>
        </div>

        <button class="chat-plus" type="button" @click="toggleMore">+</button>
      </div>

      <div v-if="showMore" class="chat-more">
        <button class="chat-more-item" type="button">
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
          <div class="chat-more-text">图片</div>
        </button>
        <button class="chat-more-item" type="button">
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
  </div>
</template>

<style scoped>
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
  background: #e6f4ff;
  border: 1px solid #e6f4ff;
  border-radius: 999px;
  padding: 3px 5px;
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

.chat-body {
  flex: 1;
  padding: 12px 12px 0;
  box-sizing: border-box;
  overflow: auto;
  background: #ffffff;
}

.chat-msg {
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
  background: transparent;
  color: #333;
  font-size: 14px;
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
</style>
