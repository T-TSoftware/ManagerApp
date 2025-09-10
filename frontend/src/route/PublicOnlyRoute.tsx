import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PublicOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    );
  }
  if (isAuthenticated) {
    const to = (location.state as any)?.from?.pathname || "/";
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
}
