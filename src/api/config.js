import axios from "axios"
import store from "@/store"

const axiosInstance = axios.create({ baseURL: process.env.VUE_APP_API_URL })

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  config.headers.common["Authorization"] = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (config) => config,
  (error) => {
    store.commit("error/setError", error.response.data)
    if (error.response.status === 401) {
      localStorage.removeItem("token")
      store.dispatch("user/clearUserData")
      window.location.reload()
    }
    return error
  }
)

export default axiosInstance
