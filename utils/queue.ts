export class ConcurrencyQueue {
  private tasks: (() => Promise<void>)[] = []
  private activeCount = 0
  private maxConcurrency: number
  private errorMsg: string

  constructor(maxConcurrency: number, tasks: Array<() => Promise<void>>) {
    this.maxConcurrency = maxConcurrency
    this.tasks = tasks
    this.errorMsg = ''
  }

  addTask(task: () => Promise<void>) {
    this.tasks.push(task)
  }

  startTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      const processNext = async () => {
        if (this.errorMsg) {
          return
        }
        if (this.tasks.length === 0 && this.activeCount === 0) {
          resolve()
          return
        }

        if (this.activeCount >= this.maxConcurrency || this.tasks.length === 0) {
          return
        }

        const task = this.tasks.shift()
        if (task) {
          try {
            this.activeCount++
            await task()
            this.activeCount--
            processNext() // 任务完成后继续处理下一个任务
          } catch (error) {
            this.activeCount--
            // @ts-ignore
            this.errorMsg = error
            this.activeCount--
            reject(error) // 一旦有一个任务失败，整个队列失败
          }
        } else {
          resolve()
        }
      }

      // 启动处理任务
      while (this.activeCount < this.maxConcurrency && this.tasks.length > 0) {
        if (this.errorMsg) {
          break
        }
        processNext()
      }
    })
  }

  stopTask() {
    this.errorMsg = 'cancel by user'
    this.tasks = []
  }
}
