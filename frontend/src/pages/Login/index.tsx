// pages/Login/index.tsx
"use client";
import { useState} from "react";
import { useNavigate } from "react-router-dom";

import { useApp } from "../../hooks/useApp";

const LoginPage = () => {

  const { setCompanyId } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setCompanyId("123");
      navigate("/adminDashboard");
      console.log("Success", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-tertiary p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
          Giriş Yap
        </h1>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black dark:text-white dark:bg-gray-800"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black dark:text-white dark:bg-gray-800"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
         //href="/adminDashboard"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
