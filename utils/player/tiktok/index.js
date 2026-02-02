import { Events, Plugin } from 'xgplayer'

import startPlay from '~/assets/image/play.png'

const { POSITIONS } = Plugin
export class Tiktok extends Plugin {
  static get pluginName() {
    return 'tiktok'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.ROOT,
    }
  }

  afterCreate() {
    this.on(Events.PAUSE, () => {
      this.root.classList.remove('hide')
    })
    this.on(Events.PLAY, () => {
      this.root.classList.add('hide')
    })

    this.on([Events.SEEKING], () => {
      this.player.getPlugin('start')?.focusHide()
      this.root.classList.add('hide')
    })

    this.clickFn = () => {
      this.player.play()
    }
    this.root.addEventListener('click', this.clickFn)
  }

  destroy() {
    this.root.removeEventListener('click', this.clickFn)
  }

  render() {
    return `<xg-start class='xgplayer-start hide' data-type="tiktok">
      <xg-start-inner>
        <img src="${startPlay}" alt="" />
      </xg-start-inner>
    </xg-start> `
  }
}

export class BackRate extends Plugin {
  static get pluginName() {
    return 'backRate'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.ROOT,
    }
  }

  afterCreate() {
    const { player } = this
    let timer
    let touchAt = 0
    this.moveHandler = (e) => {
      const moveAt = Date.now()
      const difftime = moveAt - touchAt
      // 大于1s 快进
      if (difftime >= 1000) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
      else {
        clearTimeout(timer)
        timer = null
        player.root.removeEventListener('touchmove', this.moveHandler)
      }
    }

    const controlsRoot = player.getPlugin('controls')?.root
    const tiktokRoot = player.getPlugin('tiktok')?.root
    const startRoot = player.getPlugin('start')?.root
    this.startHandler = (e) => {
      const target = e.target
      if (e.targetTouches.length === 1 && !startRoot?.contains(target) && !tiktokRoot?.contains(target) && !controlsRoot?.contains(target)) {
        touchAt = Date.now()
        player.root.addEventListener('touchmove', this.moveHandler)
        timer = setTimeout(() => {
          this.root.classList.add('is-active')
          player.playbackRate = 2
          player.emit('seeking-action', 'seeking')
        }, 1000)
        e.preventDefault()
      }
    }
    this.endHandler = () => {
      const endAt = Date.now()
      const difftime = endAt - touchAt
      player.playbackRate = 1
      player.emit('seeking-action', 'auto')
      if (difftime <= 300) {
        if (player.paused) {
          player.play()
        }
        else {
          player.pause()
        }
      }
      this.root.classList.remove('is-active')
      player.root.removeEventListener('touchmove', this.moveHandler)
      clearTimeout(timer)
      timer = null
    }

    player.root.addEventListener('touchend', this.endHandler)
    player.root.addEventListener('touchstart', this.startHandler)
  }

  destroy() {
    const { root } = this.player
    root.removeEventListener('touchstart', this.startHandler)
    root.removeEventListener('touchend', this.endHandler)
  }

  render() {
    return `<xg-back-rate class="xg-back-rate">
    <svg class="xg-back-rate-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12 12"><g fill="none"><path d="M4.496 1.994A1 1 0 0 0 3 2.862v6.277a1 1 0 0 0 1.496.868l5.492-3.139a1 1 0 0 0 0-1.736L4.496 1.994z" fill="currentColor"></path></g></svg>
    <svg class="xg-back-rate-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12 12"><g fill="none"><path d="M4.496 1.994A1 1 0 0 0 3 2.862v6.277a1 1 0 0 0 1.496.868l5.492-3.139a1 1 0 0 0 0-1.736L4.496 1.994z" fill="currentColor"></path></g></svg>
    
    <span class="xg-back-rate-text">2倍速度播放中</span>
    </xg-back-rate>`
  }
}
