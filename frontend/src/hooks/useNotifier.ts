import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import { useAlertContext } from "../context/AlertContext";
import type { AlertMessage } from "../types/alert/AlertTypes";

export const useNotifier = () => {
  const { addMessage, removeMessage, clearMessages } = useAlertContext();

  const success = (msg: string) => toast.success(msg);
  const error = (msg: string) => toast.error(msg);
  const loading = (msg: string) => toast.loading(msg);
  const dismiss = () => toast.dismiss();

  const alert = (alert: AlertMessage) => {
    addMessage(alert);
  };

  const dismissAlert = (id: string) => {
    removeMessage(id);
  };

  const handleError = (err: unknown) => {
    dismiss(); 
    
    if (err instanceof ZodError) {
      const first = err.errors?.[0];
      if (first) {
        error(first.message || "Form doğrulama hatası");
      } else {
        error("Geçersiz form verisi");
      }
      return;
    }

    if (typeof err === "object" && err !== null && "message" in err) {
      const msg = (err as any).message || "Bilinmeyen hata oluştu";
      error(msg);
      return;
    }

    error("Beklenmeyen bir hata oluştu");
  };

  return {
    success,
    error,
    loading,
    dismiss,
    alert,
    dismissAlert,
    clearAlerts: clearMessages,
    handleError,
  };
};
