/* TODO:
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-06-27 20:51:13
 * @Description: 播放器单击播放展厅  see: https://h5player.bytedance.com/plugins/custom_plugin.html#%E6%92%AD%E6%94%BE%E5%99%A8%E6%8F%92%E4%BB%B6%E5%9F%BA%E7%B1%BB
 */

import { BasePlugin } from 'xgplayer'

export class CustomPlugin extends BasePlugin {
  public onClick: (e: Event) => void
  public _control: HTMLDivElement | null
  static get pluginName() {
    return 'custom'
  }

  constructor(args: any) {
    super(args)
    this._control = null

    this.onClick = (e: Event) => {
      if (this._control?.contains(e.target as HTMLDivElement)) {
        return
      }
      if (this.paused) {
        this.player.play()
      } else {
        this.player.pause()
      }
    }
  }

  get paused() {
    return this.player?.paused ?? false
  }

  afterCreate() {
    if (!this.player.root) {
      return
    }

    this._control = this.player.root.querySelector('.xgplayer-controls')

    this.player.root.addEventListener('click', this.onClick)
  }

  destroy() {
    this.player.root?.removeEventListener('click', this.onClick)
  }
}
