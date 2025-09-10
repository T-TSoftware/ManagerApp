import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./route/routes";

import { AlertProvider } from "./context/AlertContext";
import Alert from "./components/feedback/Alert";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              duration: 3000,
              style: { background: "#10B981", color: "white" },
            },
            error: {
              duration: 5000,
              style: { background: "#EF4444", color: "white" },
            },
            loading: { style: { background: "#3B82F6", color: "white" } },
          }}
        />
        <Alert />
        <RouterProvider router={router} />
      </AuthProvider>
    </AlertProvider>
  );
}
