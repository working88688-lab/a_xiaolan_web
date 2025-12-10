/*
 * @Author: Leo
 * @LastEditors: Leo
 * @LastEditTime: 2024-05-17 17:37:55
 * @Description:  执行异步任务
 */
interface IOption {
  asyncTask: (...args: any[]) => Promise<any | void>
  defaultLoading?: boolean
}

export function useAsync({ asyncTask, defaultLoading = false }: IOption) {
  const { value: loading, open: showLoading, close: hideLoading } = useBoolean(defaultLoading)

  const runTask = async () => {
    showLoading()
    try {
      await asyncTask()
    } catch (error) {
      console.log('error: ', error)
    } finally {
      hideLoading()
    }
  }

  return {
    loading,
    runTask
  }
}
