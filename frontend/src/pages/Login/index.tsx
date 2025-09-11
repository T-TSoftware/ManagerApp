import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SidePhoto from "../../assets/images/background.png";
import { KeyRound, Mail, Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/admin-dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    if (!emailTrimmed || !passwordTrimmed) return;
    try {
      await login(emailTrimmed, passwordTrimmed);
      navigate("/admin-dashboard", { replace: true });
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="min-h-screen flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center" />
        <div className="flex flex-1 items-center justify-center">
          <form
            onSubmit={handleSubmit}
            // ▼ daha kompakt: tek bir küçük max-width
            className="flex flex-col items-center justify-center rounded-lg w-full px-4 max-w-sm"
            noValidate
          >
            <h2 className="text-xl font-bold font-mono">Hoşgeldiniz</h2>
            <p className="text-xs font-extralight text-gray-500 font-mono mb-4 text-center">
              Hoşgeldiniz, lütfen bilgilerinizi giriniz
            </p>

            {/* Email */}
            <div className="flex items-center border rounded-xl px-3 py-2 w-full shadow-sm mb-3 bg-white overflow-hidden">
              <Mail className="w-5 h-5 text-gray-500 shrink-0" />
              <div className="border-l mx-3 h-6 border-gray-300 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <label htmlFor="email" className="text-xs text-gray-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm font-normal text-black dark:text-white focus:outline-none bg-transparent w-full"
                  placeholder="name@gmail.com"
                  required
                  autoComplete="username"
                  aria-invalid={!!error}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-xl px-3 py-2 w-full shadow-sm mb-3 bg-white overflow-hidden">
              <KeyRound className="w-5 h-5 text-gray-500 shrink-0" />
              <div className="border-l mx-3 h-6 border-gray-300 shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <label htmlFor="password" className="text-xs text-gray-400">
                  Şifre
                </label>
                <div className="flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-sm font-normal text-black dark:text-white focus:outline-none bg-transparent flex-1 min-w-0"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    aria-invalid={!!error}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="ml-2 p-1 rounded hover:bg-gray-100 shrink-0"
                    aria-label={showPwd ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPwd ? (
                      <EyeOff className="w-5 h-5 text-gray-500 shrink-0" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-3 w-full text-left">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-light_fourth text-white p-3 rounded-lg shadow-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Lütfen bekleyiniz..." : "Giriş"}
            </button>
          </form>
        </div>
        <div className="flex-1" />
      </div>

      <div className="hidden h-screen flex-1 lg:block">
        <img className="min-h-full" src={SidePhoto} alt="user" />
      </div>
    </div>
  );
};

export default Login;
