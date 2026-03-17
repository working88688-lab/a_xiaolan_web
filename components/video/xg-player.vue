<template>
  <div class="dx-xg-player">
    <div v-show="props.active" ref="playerRef" class="dx-xg-player--placeholder"></div>
    <div
      v-show="!props.active"
      class="dx-xg-player-poster flex-center"
      :style="{
        backgroundImage: `url(${_poster})`
      }"
    >
      <img class="icon-play" :src="play_icon" alt="播放按钮" @click="on_play" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { is_screen_orientation_portrait } from '@utils/helper'
import { useEventListener } from '@vueuse/core'

import { Events, I18N, SimplePlayer } from 'xgplayer'
import HlsJsPlugin from 'xgplayer-hls.js'
import ZH from 'xgplayer/es/lang/zh-cn'
import Enter from 'xgplayer/es/plugins/enter'
import Error from 'xgplayer/es/plugins/error'
import Fullscreen from 'xgplayer/es/plugins/fullscreen'
import Loading from 'xgplayer/es/plugins/loading'
import Mobile from 'xgplayer/es/plugins/mobile'
import Play from 'xgplayer/es/plugins/play'
import Poster from 'xgplayer/es/plugins/poster'
import Playbackrate from 'xgplayer/es/plugins/playbackrate'
// import Progress from 'xgplayer/es/plugins/progress'
import Start from 'xgplayer/es/plugins/start'
// import Time from 'xgplayer/es/plugins/time'
import Volume from 'xgplayer/es/plugins/volume'

import play_icon from '@assets/image/play.png'
import { CustomProgress, MiniProgress, Time } from '@utils/player'

import '~/assets/styles/xgplayer.css'

// 启用中文
I18N.use(ZH)
const props = withDefaults(
  defineProps<{
    src?: string
    cover?: string
    autoplay?: boolean
    loop?: boolean
    short?: boolean
    active?: boolean
    poster?: string
    previewConfig?: {
      mode: number // 0 不是预览， 1为预览
      time?: number // 可预览时间 不传则默认预览完
    }
    orientation?: boolean // 是否在手机横屏播放器全屏
    videoInfo?: any
  }>(),
  {
    src: undefined,
    cover: undefined,
    autoplay: true,
    loop: false,
    short: false,
    active: true,
    poster: undefined,
    previewConfig: () => ({
      mode: 1
    }),
    orientation: false
  }
)

const emit = defineEmits<{
  previewEnded: []
  ended: []
  posterCryptoed: []
}>()

const __ = useNuxtApp()
const _poster = ref('')
const playerRef = ref<HTMLVideoElement>()

let xg_player: SimplePlayer | null

const on_play = () => {
  xg_player?.play()
}

const ended = (e: any) => {
  const { currentTime, duration } = e
  const { mode, time } = props.previewConfig
  if (mode === 1) {
    if (!time && Math.ceil(currentTime) >= Math.floor(duration)) {
      emit('previewEnded')
      // xg_player?.replay()
      // xg_player?.resetState()
    }
  }

  emit('ended')
}

const onVolumeChange = (e: any) => {
  __.$Store.player.update_autoplay_muted(e.muted)
}

const onError = (e: any) => {
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

const init_player = async () => {
  const base_option = {
    el: playerRef.value,
    width: '100%',
    height: '100%',
    lang: 'zh-cn',
    playsinline: true,
    cssFullscreen: false,
    autoplayMuted: __.$Store.player.autoplayMuted,
    autoplay: props.autoplay,
    loop: props.loop,
    url: props.src,
    previewTime: props.previewConfig.time,
    poster: {
      poster: _poster.value,
      hideCanplay: true
    },
    controls: {
      mode: 'normal',
      initShow: true
    },
    volume: 1,
    icons: {
      startPlay: play_icon
    },
    commonStyle: {
      // 播放完成部分进度条底色
      playedColor: 'linear-gradient(-90deg,#FA1F41 0%,#E31106 100%)'
    },
    miniprogress: true,
    on_preview_ended: () => {
      emit('previewEnded')
    },
    hlsJsPlugin: {
      fragLoadPolicy: {
        default: {
          maxTimeToFirstByteMs: 9000,
          maxLoadTimeMs: 100000,
          timeoutRetry: {
            maxNumRetry: 2,
            retryDelayMs: 0,
            maxRetryDelayMs: 0
          },
          errorRetry: {
            maxNumRetry: 5,
            retryDelayMs: 3000,
            maxRetryDelayMs: 15000,
            backoff: 'linear'
          }
        }
      }
    },

    plugins: [
      MiniProgress,
      Start,
      Enter,
      Loading,
      Mobile,
      CustomProgress,
      Time,
      Play,
      Error,
      Poster,
      Volume,
      Playbackrate
    ] as any
  }
  if (!props.short) {
    base_option.plugins.push(Fullscreen)
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
  xg_player.on(Events.VOLUME_CHANGE, onVolumeChange)
  xg_player.on(Events.ERROR, onError)
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

watchEffect(async () => {
  if (props.poster && !_poster.value) {
    __.$ImageDecryption({
      imgurl: props.poster
    }).then(poster => {
      _poster.value = poster
      if (xg_player) {
        xg_player.poster = poster
      }
    })
  }
  if (props.src && props.active) {
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
        xg_player.play()
      } else {
        xg_player.pause()
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

watch(
  () => props.previewConfig,
  val => {
    if (!val.mode && xg_player) {
      xg_player.config.previewTime = 0
    }
  }
)

onDeactivated(() => {
  if (xg_player) {
    xg_player.pause()
  }
})

onBeforeUnmount(() => {
  if (xg_player) {
    xg_player.src = ''
    xg_player.off(Events.ENDED, ended)
    xg_player.off(Events.VOLUME_CHANGE, onVolumeChange)
    xg_player.off(Events.ERROR, onError)
    xg_player.destroy()
    xg_player = null
  }
})

useEventListener(window, 'orientationchange', () => {
  if (xg_player) {
    if (is_screen_orientation_portrait()) {
      if (xg_player.currentTime > 0 && !xg_player.paused) {
        xg_player.getFullscreen()
      }
    } else {
      xg_player.exitFullscreen()
    }
  }
})

defineExpose({
  getReportInfo: getVideoInfo
})
</script>

<style lang="postcss">
@import '@styles/xgplayer-custom.css';
</style>
