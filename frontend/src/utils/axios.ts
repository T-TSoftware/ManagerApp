import axios, { AxiosError } from "axios";
import { getToken } from "./token";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  const isLogin = config.url?.includes("/auth/login");
  if (token && !isLogin) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function extractApiError(error: unknown): {
  errorMessage: string;
  fieldErrors?: Record<string, string>;
} {
  // 1) AxiosError ise
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const data = err.response?.data;

    // Alan bazlı hatalar (çeşitli backend formatları için esnek okuma)
    const fieldErrors: Record<string, string> = {};
    if (data?.errors && Array.isArray(data.errors)) {
      for (const e of data.errors) {
        const key = e.field ?? e.path ?? e.name;
        // Backend'inde bazen "message", bazen "errorMessage" olabilir
        const msg = e.errorMessage ?? e.message ?? e.error ?? "";
        if (key && msg) fieldErrors[key] = msg;
      }
    } else if (data?.fieldErrors && typeof data.fieldErrors === "object") {
      Object.assign(fieldErrors, data.fieldErrors);
    }

    // Genel mesaj adayları
    const candidates = [
      typeof data === "string" ? data : undefined,
      data?.errorMessage,
      data?.message,
      data?.error,
      Array.isArray(data?.errors) &&
        (data.errors[0]?.errorMessage ?? data.errors[0]?.message),
      err.response ? `HTTP ${err.response.status} hatası` : undefined,
      err.code === "ECONNABORTED" ? "İstek zaman aşımına uğradı." : undefined,
      !err.response ? "Ağ hatası. Sunucuya ulaşılamadı." : undefined,
    ].filter(Boolean) as string[];

    return {
      errorMessage: candidates[0] ?? "Bilinmeyen bir hata oluştu.",
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    };
  }

  // 2) Plain Error ise (hook'ların `throw new Error(...)`'u)
  if (error instanceof Error && error.message) {
    return { errorMessage: error.message };
  }

  // 3) Diğer
  return { errorMessage: "Bilinmeyen bir hata oluştu." };
}

// Global response interceptor: 401 yakala + mevcut hata akışını bozma
axiosInstance.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = (error as AxiosError)?.response?.status;
    if (status === 401 && typeof onUnauthorized === "function") {
      try {
        onUnauthorized(); // token temizle + login'e yönlendir (AuthContext içinde tanımlanacak)
      } catch {
        // burada swallow ediyoruz; ana hata akışını bozmuyoruz
      }
    }
    // ❗ Burada reject etmeye devam ediyoruz ki mevcut extract... akışı aynen çalışsın
    return Promise.reject(error);
  }
);

// Authorization header set/clear (merkezi)
export const setAuthHeader = (token?: string | null) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};


export default axiosInstance;