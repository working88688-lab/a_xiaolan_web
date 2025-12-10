/**
 * desc: 事件bus
 * date: 2024.03.29
 */
import mitt, { type Emitter } from 'mitt'

import type { Events, EventType } from '@types'

const emitter: Emitter<Events> = mitt<Events>()
export default defineNuxtPlugin(({ app, $config }) => {
  // console.log("@$config", $config);
  return {
    provide: {
      Emitter: emitter
    }
  }
})
