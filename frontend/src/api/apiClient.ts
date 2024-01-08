import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default apiClient
