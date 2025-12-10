import accountStore from './modules/account'
import dynamicStore from './modules/dynamic'
import globalStore from './modules/global'
import historyStore from './modules/history'
import playerStore from './modules/player'
import stackStore from './modules/stack'
import userStore from './modules/user'

export default function useStore() {
  const store = {
    user: userStore(),
    global: globalStore(),
    history: historyStore(),
    stack: stackStore(),
    dynamic: dynamicStore(),
    player: playerStore()
    // cache: cacheStore()
  }

  Object.defineProperty(store, '$reset', {
    get() {
      return () => {
        Object.values(store).forEach(_store => {
          _store.$reset()
        })
      }
    }
  })

  return store
}

export {
  accountStore as useAccountStore,
  dynamicStore as useDynamicStore,
  globalStore as useGlobalStore,
  historyStore as useHistoryStore,
  playerStore as usePlayerStore,
  stackStore as useStackStore,
  userStore as useUserStore
}
