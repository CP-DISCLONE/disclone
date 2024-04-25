import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { User } from './types/usertypes';
export const api: AxiosInstance = axios.create({
    baseURL: "http://0.0.0.0:8000/app/"
})

export const userConfirmation = async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Token ${token}`
        console.log("Set token to header: ", token)
        const response: AxiosResponse = await api.get('users/info/')
        if (response.status === 200) {
            console.log(response.data)
            return { email: response.data.email, displayName: response.data.display_name, firstName: response.data.first_name, lastName: response.data.last_name }
        } else {
            console.log('error userConfirmation', response)
            return null
        }
    } else {
        console.log('userConfirmation: no token in localStorage')
        return null
    }
}