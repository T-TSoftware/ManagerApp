// services/authService.ts
import api, { extractApiError } from "../utils/axios";

export type NormalizedLoginResponse = {
  token: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    // extend as your API returns
  };
};

/**
 * Always returns { token, user? }.
 * Accepts common token field names or raw string body.
 */
export const login = async (
  email: string,
  password: string
): Promise<NormalizedLoginResponse> => {
  try {
    // RELATIVE PATH — baseURL is already on axios instance
    const res = await api.post("/auth/login", { email, password });
    const data = res?.data;

    // Accept multiple shapes; normalize
    const candidate =
      typeof data === "string"
        ? data
        : data?.token ?? data?.accessToken ?? data?.jwt;

    if (!candidate || typeof candidate !== "string") {
      // propagate a clean, standard error
      throw new Error("Invalid login response: token not found.");
    }

    return {
      token: candidate,
      user: typeof data === "object" ? data?.user : undefined,
    };
  } catch (err: any) {
    // Keep global error style consistent via extractApiError
    const message =
      typeof extractApiError === "function"
        ? extractApiError(err)
        : err?.message || "Login failed";
    throw new Error(message.errorMessage);
  }
};

export const logout = async (): Promise<void> => {
  try {
    // RELATIVE PATH — baseURL is already on axios instance
    await api.post("/auth/logout");
  } catch {
    // Intentionally swallow logout transport errors:
    // We still want to clear local state & redirect.
  }
};
