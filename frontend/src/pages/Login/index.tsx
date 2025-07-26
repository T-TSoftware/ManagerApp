import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import SidePhoto from "../../assets/images/background.png";
import { KeyRound, Mail } from "lucide-react";

const Login = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-h-screen flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center"></div>
        <div className="flex flex-1 items-center justify-center ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center rounded-lg w-5/12"
          >
            <h2 className="text-xl font-bold font-mono">Hoşgeldiniz</h2>
            <p className="text-xs font-extralight text-gray-500 font-mono mb-4 md:text-xxs">
              Hoşgeldiniz, Lütfen bilgilerinizi giriniz
            </p>
            <div className="flex items-center border rounded-xl px-4 py-2 w-full max-w-md shadow-sm mb-4">
              <Mail className="w-5 h-5 text-gray-500" />

              <div className="border-l mx-3 h-6 border-gray-300"></div>

              <div className="flex flex-col flex-1">
                <label className="text-xs text-gray-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm font-normal text-black focus:outline-none bg-transparent"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>
            <div className="flex items-center border rounded-xl px-4 py-2 w-full max-w-md shadow-sm mb-4">
              <KeyRound className="w-5 h-5 text-gray-500" />

              <div className="border-l mx-3 h-6 border-gray-300"></div>

              <div className="flex flex-col flex-1">
                <label className="text-xs text-gray-400">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm font-normal text-black focus:outline-none bg-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full bg-light_fourth text-white p-3 rounded-lg shadow-md"
              disabled={loading}
            >
              {loading ? "Lütfen Bekleyiniz..." : "Giriş"}
            </button>
          </form>
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="hidden h-screen flex-1 lg:block">
        <img className="min-h-full" src={SidePhoto} alt="user"></img>
      </div>
    </div>
  );
};

export default Login;
