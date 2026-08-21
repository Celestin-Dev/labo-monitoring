import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const http = axios.create({
  baseURL,
  timeout: 10000,
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise le message d'erreur renvoyé par le GlobalExceptionHandler du backend
    const message = error.response?.data?.message || error.message || 'Erreur réseau'
    return Promise.reject(new Error(message))
  },
)

export default http
