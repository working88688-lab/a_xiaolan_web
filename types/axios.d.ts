import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    showError?: boolean //新增是否在请求失败时 toast 接口信息
    showSuccess?: boolean // 新增是否在接口请求成功 toast 接口信息
    throwError?: boolean //新增是否在请求失败时直接 reject 接口信息
    successCode?: number // 新增接口是否请求成功判断 code 可配置
    imgDomain?: string // 图片域名
    signKey?: string //加密key
  }

  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}

export {}
