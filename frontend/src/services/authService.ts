import { API_BASE_URL } from "../config/api";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  console.log("LOGIN RESPONSE:", data);
  return data;
};
