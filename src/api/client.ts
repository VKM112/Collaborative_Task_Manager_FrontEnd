import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? ''

const client = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
