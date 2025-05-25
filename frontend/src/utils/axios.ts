import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "./token";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
