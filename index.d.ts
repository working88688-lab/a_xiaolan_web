import _Store from '~/src/store'

type Store = ReturnType<typeof _Store>
interface AppStore extends Store {
  $reset: () => void
}

declare module '#app' {
  interface NuxtApp {
    $GlobalObject: {
      _CACHE_IMAGES_MAPS: Record<
        string,
        {
          url: string
          status: 0 | 1 | 2
          pending: Array<(_url: string) => void>
        }
      >
      _IMAGE_PREVIE_GROUPS: Map<number, Array<string>>
      _IMAGE_DECRY_SCHEDULER: Record<string, (_url: any) => void>
    }

    $Store: AppStore
  }
}

export {}
