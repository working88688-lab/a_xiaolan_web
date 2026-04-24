// @ts-nocheck
export default defineNuxtPlugin(() => {
  const sdk = {
    init(options: { appId: string; uid: string; channel: string; encryptedConfig: string }) {
      window.WebSDK?.init(options)
    },
    setUid(uid: string) {
      window.WebSDK?.setUid(uid)
    },
    setChannel(channel: string) {
      window.WebSDK?.setChannel(channel)
    },
    setContext(ctx: { uid?: string; channel?: string }) {
      window.WebSDK?.setContext(ctx)
    }
  }
  return { provide: { WebSDK: sdk } }
})
