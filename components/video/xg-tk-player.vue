<script setup lang="ts">
import { Mobile, SimpleProgress } from '@utils/player'
import { BackRate, Tiktok } from '@utils/player/tiktok'
import { Events, I18N, SimplePlayer } from 'xgplayer'
import HlsJsPlugin from 'xgplayer-hls.js'
import ZH from 'xgplayer/es/lang/zh-cn'
import Enter from 'xgplayer/es/plugins/enter'
import Error from 'xgplayer/es/plugins/error'

import Loading from 'xgplayer/es/plugins/loading'
import Poster from 'xgplayer/es/plugins/poster'

import Start from 'xgplayer/es/plugins/start'

import startPlay from '~/assets/image/play.png'

import '~/assets/styles/xgplayer.css'

const props = withDefaults(
  defineProps<{
    src?: string
    autoplay?: boolean
    loop?: boolean
    short?: boolean
    active?: boolean
    poster?: string
    previewConfig?: {
      mode: number // 0 不是预览， 1为预览
      time?: number // 可预览时间 不传则默认预览完
    }
    disabled?: boolean
    playOnActivated?: boolean
    destroyOnDeactivated?: boolean
    videoInfo?: any
  }>(),
  {
    src: undefined,
    autoplay: true,
    loop: false,
    short: false,
    active: true,
    poster: undefined,
    previewConfig: () => ({
      mode: 1
    }),
    disabled: false,
    playOnActivated: true,
    destroyOnDeactivated: false
  }
)

const emit = defineEmits<{
  end: []
  seekingAction: [e: 'seeking' | 'auto']
}>()

// 启用中文
I18N.use(ZH)

const __ = useNuxtApp()
const { cryptoImage } = useCrypto()
const _poster = ref('')
const playerRef = ref<HTMLVideoElement>()

let xg_player: SimplePlayer | null

const playing = defineModel<boolean>('playing', {
  default: false
})

function on_play(e: any) {
  playing.value = true
}

function on_paused(e: any) {
  playing.value = false
}

function proxy_player<K extends keyof SimplePlayer>(action: K) {
  xg_player?.[action]?.()
}

function ended(_e: any) {
  emit('end')
}
const isSeekingAction = ref(false)
function onSeekingAction(e: 'seeking' | 'auto') {
  isSeekingAction.value = e === 'seeking'

  emit('seekingAction', e)
}

function onError(e: any) {
  if (e.errorType === 'media' && xg_player) {
    xg_player.resetState()
  }
}
function getVideoInfo() {
  const { duration: video_duration, currentTime: play_duration } = (xg_player || {}) as SimplePlayer
  return {
    video_duration: video_duration || props.videoInfo.duration || 0,
    play_duration,
    play_progress:
      !play_duration || !video_duration ? 0 : (parseFloat((play_duration / video_duration).toFixed(2)) * 100).toFixed(0)
  }
}
async function init_player() {
  const base_option = {
    el: playerRef.value,
    width: '100%',
    height: '100%',
    lang: 'zh-cn',
    playsinline: true,
    autoplayMuted: false,
    autoplay: props.autoplay,
    url: props.src,
    poster: {
      poster: _poster.value,
      hideCanplay: true
    },
    controls: {
      autoHide: false,
      initShow: true
    },
    loop: props.loop,
    muted: false,
    fullscreen: false,
    play: false,
    time: false,
    marginControls: false,
    inactive: 1000,
    icons: {
      startPlay,
      loadingIcon: `<div class="xgplayer-enter-spinner"><div class="xgplayer-enter-bar1"></div><div class="xgplayer-enter-bar2"></div><div class="xgplayer-enter-bar3"></div><div class="xgplayer-enter-bar4"></div><div class="xgplayer-enter-bar5"></div><div class="xgplayer-enter-bar6"></div><div class="xgplayer-enter-bar7"></div><div class="xgplayer-enter-bar8"></div><div class="xgplayer-enter-bar9"></div><div class="xgplayer-enter-bar10"></div><div class="xgplayer-enter-bar11"></div><div class="xgplayer-enter-bar12"></div></div>`
    },
    commonStyle: {
      // 播放完成部分进度条底色
      playedColor: 'var(--dx-primary-color)'
    },
    plugins: [Start, Tiktok, Enter, BackRate, Loading, Mobile, SimpleProgress, Error, Poster] as any
  }

  if (document.createElement('video').canPlayType('application/vnd.apple.mpegurl')) {
    xg_player = new SimplePlayer(base_option)
  } else if (HlsJsPlugin.isSupported()) {
    xg_player = new SimplePlayer({
      ...base_option,
      plugins: [...base_option.plugins, HlsJsPlugin]
    })
  } else {
    xg_player = new SimplePlayer(base_option)
  }

  xg_player.on(Events.ENDED, ended)
  xg_player.on(Events.ERROR, onError)
  xg_player.on(Events.PLAY, on_play)
  xg_player.on(Events.PAUSE, on_paused)
  xg_player.on('seeking-action', onSeekingAction)

  // 视频埋点
  if (props.videoInfo) {
    // @ts-ignore

    let seek_at = 0
    const event = 'video_event'
    xg_player.on(Events.PLAY, () => {
      setTimeout(() => {
        __.$Tracker.trackVideoEvent({
          event,
          ...props.videoInfo,
          video_behavior_key: 'video_play',
          ...getVideoInfo(),
          video_behavior_name: '播放'
        })
      })
    })
    xg_player.on(Events.PAUSE, () => {
      __.$Tracker.trackVideoEvent({
        event,
        ...props.videoInfo,
        video_behavior_key: 'video_pause',
        ...getVideoInfo(),
        video_behavior_name: '暂停'
      })
    })
    xg_player.on(Events.ENDED, () => {
      __.$Tracker.trackVideoEvent({
        event,
        ...props.videoInfo,
        video_behavior_key: 'video_complete',
        ...getVideoInfo(),
        video_behavior_name: '播放完成'
      })
    })
    xg_player.on(Events.TIME_UPDATE, () => {
      seek_at = xg_player?.currentTime
    })
    xg_player.on(Events.SEEKING, () => {
      const diff = xg_player?.currentTime - seek_at
      __.$Tracker.trackVideoEvent({
        event,
        ...props.videoInfo,
        video_behavior_key: diff > 0 ? 'video_forward' : 'video_rewind',
        ...getVideoInfo(),
        video_behavior_name: diff > 0 ? '前进' : '后退'
      })
    })
    __.$Tracker.trackVideoEvent({
      event,
      ...props.videoInfo,
      video_behavior_key: 'video_view',
      video_behavior_name: '展示'
    })
  }
}

function _destroy() {
  if (xg_player) {
    playing.value = false
    xg_player.src = ''
    xg_player.off(Events.ENDED, ended)
    xg_player.off(Events.ERROR, onError)
    xg_player.off(Events.PLAY, on_play)
    xg_player.off(Events.PAUSE, on_paused)
    xg_player.off('seeking-action', onSeekingAction)
    xg_player.destroy()
    xg_player = null
  }
}

watchEffect(async () => {
  if (xg_player) {
    xg_player.loop = props.loop
  }
  if (props.poster && !_poster.value) {
    cryptoImage(props.poster).then(poster => {
      _poster.value = poster
      if (xg_player) {
        xg_player.poster = poster
      }
    })
  }

  if (props.src && props.active && !props.disabled) {
    await nextTick()
    if (!xg_player && playerRef.value) {
      init_player()
    }
  }
})

watch(
  () => props.active,
  val => {
    if (xg_player) {
      if (val) {
        if (props.autoplay) {
          xg_player.play()
        }
      } else {
        xg_player.pause()
      }

      if (!val && props.destroyOnDeactivated) {
        _destroy()
      }
    }
  }
)

watch(
  () => props.src,
  (val, oldV) => {
    if (xg_player && val && oldV && val !== oldV) {
      xg_player.playNext({
        url: val,
        poster: _poster.value
      })
    }
  }
)

onDeactivated(() => {
  if (xg_player) {
    xg_player.pause()
  }
})

onBeforeUnmount(() => {
  _destroy()
})

defineExpose({
  proxy_player,
  getReportInfo: getVideoInfo
})
</script>

<template>
  <div class="dx-xg-player is-tiktok" :class="{
    'is-seeking-action': isSeekingAction
  }">
    <div class="dx-xg-player-poster flex-center" :style="{
      backgroundImage: `url(${_poster})`
    }" />
    <div v-show="props.active && !props.disabled" ref="playerRef" class="dx-xg-player--placeholder" />

    <slot :seeking="isSeekingAction" />
  </div>
</template>

<style lang="postcss">
@import '@styles/xgplayer-custom.css';

.is-tiktok {
  .xgplayer-poster {
    background-color: #000;
  }

  .gradient {
    background-image: none;
  }

  .xgplayer .xgplayer-controls {
    z-index: 999;
  }
}

.xgplayer .xgplayer-start {
  width: 44px;
  height: 44px;
}

.xg-back-rate {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 12px;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 13px;
  opacity: 0;

  &.is-active {
    opacity: 1;
  }
}

.xg-back-rate-icon {
  width: 20px;
  height: 20px;
  animation: speed 0.35s linear infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.3s;
  }
}

.xg-back-rate-text {
  margin-left: 4px;
}

@keyframes speed {
  0% {
    opacity: 0.9;
  }

  100% {
    opacity: 0.4;
  }
}
</style>
