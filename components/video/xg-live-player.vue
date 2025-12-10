<script setup lang="ts">
import { Events, I18N, SimplePlayer } from 'xgplayer'
import HlsJsPlugin from 'xgplayer-hls.js'
import ZH from 'xgplayer/es/lang/zh-cn'
import Danmu from 'xgplayer/es/plugins/danmu'
import Enter from 'xgplayer/es/plugins/enter'
import Error from 'xgplayer/es/plugins/error'
import Loading from 'xgplayer/es/plugins/loading'
import Poster from 'xgplayer/es/plugins/poster'

import Start from 'xgplayer/es/plugins/start'

import '~/assets/styles/xgplayer.css'
import 'xgplayer/es/plugins/danmu/index.css'

const props = withDefaults(
  defineProps<{
    src?: string
    autoplay?: boolean
    loop?: boolean
    short?: boolean
    active?: boolean
    poster?: string
    disabled?: boolean
    playOnActivated?: boolean
    destroyOnDeactivated?: boolean
  }>(),
  {
    src: undefined,
    autoplay: true,
    loop: false,
    short: false,
    active: true,
    poster: undefined,
    disabled: false,
    playOnActivated: true,
    destroyOnDeactivated: false
  }
)

const emit = defineEmits<{
  played: []
  end: []
}>()

// 启用中文
I18N.use(ZH)

const { cryptoImage } = useCrypto()
const _poster = ref('')
const playerRef = ref<HTMLVideoElement>()

let xg_player: SimplePlayer | null

// const playing = defineModel<boolean>('playing', {
//   default: false,
// })

// function on_play(e: any) {
//   playing.value = true

// }

// function on_paused(e: any) {
//   playing.value = false
// }

function ended(e: any) {
  emit('end')
}

function proxy_player<K extends keyof SimplePlayer>(action: K, ...args: any[]) {
  return xg_player?.[action]?.(...args)
}

function getAttr(key: keyof SimplePlayer) {
  return xg_player?.[key]
}

function onError(e: any) {
  if (e.errorType === 'media' && xg_player) {
    xg_player.resetState()
  }
}

async function init_player() {
  const playerStore = usePlayerStore()
  const base_option = {
    el: playerRef.value,
    width: '100%',
    height: '100%',
    lang: 'zh-cn',
    isLive: true,
    playsinline: true,
    autoplayMuted: false,
    autoplay: true,
    url: props.src,
    poster: {
      poster: _poster.value,
      hideCanplay: true
    },
    controls: false,
    marginControls: true,
    volume: 1,
    icons: {
      loadingIcon: `<div class="xgplayer-enter-spinner"><div class="xgplayer-enter-bar1"></div><div class="xgplayer-enter-bar2"></div><div class="xgplayer-enter-bar3"></div><div class="xgplayer-enter-bar4"></div><div class="xgplayer-enter-bar5"></div><div class="xgplayer-enter-bar6"></div><div class="xgplayer-enter-bar7"></div><div class="xgplayer-enter-bar8"></div><div class="xgplayer-enter-bar9"></div><div class="xgplayer-enter-bar10"></div><div class="xgplayer-enter-bar11"></div><div class="xgplayer-enter-bar12"></div></div>`
      // loadingIcon:
    },
    plugins: [Enter, Start, Loading, Error, Poster, Danmu] as any,
    danmu: {
      area: {
        start: 0,
        end: 1
      },
      closeDefaultBtn: false,
      defaultOff: false,
      panel: false,
      chaseEffect: true,
      defaultOpen: playerStore.danmuOpen
    }
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

  xg_player.on(Events.ERROR, onError)
  // xg_player.on(Events.PLAY, on_play)
  // xg_player.on(Events.PAUSE, on_paused)
  xg_player.off(Events.ENDED, ended)
  xg_player.once(Events.PLAYING, () => {
    emit('played')
  })
}

function _destroy() {
  if (xg_player) {
    xg_player.src = ''
    xg_player.off(Events.ERROR, onError)
    // playing.value = false
    // xg_player.off(Events.PLAY, on_play)
    // xg_player.off(Events.PAUSE, on_paused)
    xg_player.off(Events.ENDED, ended)
    xg_player.destroy()
    xg_player = null
  }
}

watchEffect(async () => {
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
        if (props.destroyOnDeactivated) {
          _destroy()
        }
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

if (props.playOnActivated) {
  onActivated(() => {
    if (xg_player) {
      xg_player.play()
    }
  })
}

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
  getAttr
})
</script>

<template>
  <div class="dx-xg-player dx-live-player">
    <div v-show="props.active && !props.disabled" ref="playerRef" class="dx-xg-player--placeholder" />
    <div
      v-show="!props.active || props.disabled"
      class="dx-xg-player-poster flex-center h-full"
      :style="{
        backgroundImage: `url(${_poster})`
      }"
    />
  </div>
</template>

<style lang="postcss">
.dx-live-player {
  width: 100%;
  height: 100%;
  .xgplayer .xg-inner-controls {
    height: 32px;
    bottom: unset;
    top: 50%;
    transform: translateY(-50%);
  }
  .xgplayer .xgplayer-controls {
    background-color: var(--dx-base8-color);
  }

  .xgplayer xg-video-container.xg-video-container {
    bottom: 0;
  }
}
</style>
