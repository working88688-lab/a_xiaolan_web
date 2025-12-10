/**
 * 获取一个vue 组件 ref
 * @param _comp 组件类型
 * @returns
 */
export const useComRef = <T extends abstract new (...args: any) => any>(_comp: T) => {
  return ref<InstanceType<T>>()
}
