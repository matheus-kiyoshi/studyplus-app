import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { redirect } from 'next/navigation'

const apiConfig: Partial<InternalAxiosRequestConfig> = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/',
  timeout: 10000,
  headers: new axios.AxiosHeaders({
    'Content-Type': 'application/json',
  }),
}

const api: AxiosInstance = axios.create(apiConfig)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error('Não autorizado! Redirecionando para login...')
        redirect('/sign-in')
      } else if (error.response.status === 500) {
        console.error('Erro interno do servidor!')
      }
    } else if (error.request) {
      console.error('Erro na comunicação com o servidor!')
    } else {
      console.error('Erro desconhecido:', error.message)
    }
    return Promise.reject(error)
  },
)

export default api
