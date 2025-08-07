import axios from "axios";
import { getToken } from "./token";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
console.log(apiUrl)
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  const isLogin = config.url?.includes("/auth/login");

  if (token && !isLogin) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
