import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { ApiError } from '@/types/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('zeronix_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 429) {
      console.error('Rate limited — please try again later')
    }
    return Promise.reject(error)
  }
)

export const api = {
  get:    <T>(url: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(url, { params }).then(r => r.data),
  post:   <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data).then(r => r.data),
  put:    <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data).then(r => r.data),
  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then(r => r.data),
  upload: <T>(url: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient
      .post<T>(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(r => r.data)
  },
}
