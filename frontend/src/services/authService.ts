import axios from "../utils/axios";
import { API_BASE_URL } from "../config/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Giriş işlemi başarısız oldu";
    throw new Error(message);
  }
}; 