import axios from "../utils/axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}auth/login`,
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