/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://127.0.0.1:8000/',
      timeout: 60 * 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptors
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      (error: any) => {
        toast.error('Đã có lỗi xảy ra')
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
