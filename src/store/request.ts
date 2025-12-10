export const useRequestStore = defineStore('request', {
  // 初始状态
  state: () => ({
    bigFileUploadQueue: null as InstanceType<typeof ConcurrencyQueue> | null,
    abortController: [] as AbortController[]
  }),

  // 提交状态
  actions: {
    setBigFileUploadQueue(instance: InstanceType<typeof ConcurrencyQueue>) {
      this.bigFileUploadQueue = instance
    },
    addAbort(abort: AbortController) {
      this.abortController.push(abort)
    },
    stopBigVideoUpload() {
      this.bigFileUploadQueue?.stopTask()

      this.abortController.forEach(controller => {
        controller.abort()
      })
      this.bigFileUploadQueue = null
      this.abortController = []
    }
  }
})
