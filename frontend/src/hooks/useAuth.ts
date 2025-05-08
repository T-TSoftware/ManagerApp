import { useState } from "react";
import { login as loginRequest } from "../services/authService";
import { setToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await loginRequest(email, password);
      setToken(token);
      navigate("/admin-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
