/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-06-29 11:55:52
 * @Description: 播放器mini进度条插件  see: https://h5player.bytedance.com/plugins/custom_plugin.html#%E6%92%AD%E6%94%BE%E5%99%A8%E6%8F%92%E4%BB%B6%E5%9F%BA%E7%B1%BB
 */

import { Events, Plugin, Util } from 'xgplayer'

function getBgColor(color?: string) {
  return color ? `background:${color};` : ''
}

export class MiniProgressPlugin extends Plugin {
  static get pluginName() {
    return 'miniProgressPlugin'
  }

  static get defaultConfig() {
    return {
      height: 2,
      hidewhenfullscreen: true
    }
  }

  constructor(args: any) {
    super(args)
  }

  get offsetDuration() {
    return this.playerConfig.customDuration || this.player.offsetDuration || this.player.duration
  }

  get currentTime() {
    const { offsetCurrentTime, currentTime } = this.player
    return offsetCurrentTime >= 0 ? offsetCurrentTime : currentTime
  }

  afterCreate() {
    if (!this.root) {
      return
    }
    this.on(Events.TIME_UPDATE, this.onTimeupdate)
    this.on(Events.EMPTIED, () => {
      this.reset()
    })

    if (this.config.hidewhenfullscreen) {
      this.on(Events.FULLSCREEN_CHANGE, (isFullScreen: boolean) => {
        if (isFullScreen) {
          this.root?.classList.add('xg-mini-progress-hide')
        } else {
          this.root?.classList.remove('xg-mini-progress-hide')
        }
      })
    }
  }
  onTimeupdate = () => {
    const { ended, bufferedPoint, duration } = this.player
    const { offsetDuration, currentTime } = this
    const played = Util.adjustTimeByDuration(currentTime, offsetDuration, ended)
    const cached = Util.adjustTimeByDuration(bufferedPoint.end, duration, ended)
    this.update({ played, cached }, offsetDuration)
  }

  reset() {
    this.update({ played: 0, cached: 0 }, 0)
  }

  update(data = { cached: 0, played: 0 }, duration = 0) {
    if (!duration || !this.root) {
      return
    }
    if (data.cached) {
      this.find('.xg-progress-cache')!.style.width = `${(data.cached / duration) * 100}%`
    }
    if (data.played) {
      this.find('.xg-progress-played')!.style.width = `${(data.played / duration) * 100}%`
    }
  }

  render() {
    const { commonStyle, miniprogress } = this.playerConfig
    if (!miniprogress) {
      return ''
    }

    const { height } = this.config
    const _style = {
      cached: getBgColor(commonStyle?.cachedColor),
      played: getBgColor(commonStyle?.playedColor),
      progress: getBgColor(commonStyle?.progressColor),
      height: height > 0 && height !== 2 ? `height: ${height}px;` : ''
    }
    return `<div class="xg-mini-progress" style="${_style.progress} ${_style.height}">
    <div class="xg-progress-cache" style="${_style.cached}"></div>
    <div class="xg-progress-played" style="${_style.played}"></div>
    </div>`
  }
}
