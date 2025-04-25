import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/token";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;