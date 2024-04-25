import axios, { AxiosInstance } from 'axios'

export const api: AxiosInstance = axios.create({
    baseURL: "http://0.0.0.0:8000/api/v1/"
})