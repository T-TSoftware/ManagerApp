import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import { useAlertContext } from "../context/AlertContext";
import type { AlertMessage } from "../types/alert/AlertTypes";
import { useRef } from "react";

export const useNotifier = () => {
  const { addMessage, removeMessage, clearMessages } = useAlertContext();
  const loadingIdRef = useRef<string | null>(null);

  const success = (msg: string) => toast.success(msg);
  const error = (msg: string) => toast.error(msg);
  const loading = (msg: string) => toast.loading(msg);
  const dismiss = () => toast.dismiss();

  const showLoading = (msg: string) => {
    if (!loadingIdRef.current) {
      loadingIdRef.current = toast.loading(msg);
    }
  };

  const dismissLoading = () => {
    if (loadingIdRef.current) {
      toast.dismiss(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  };

  const alert = (alert: AlertMessage) => {
    addMessage(alert);
  };

  const dismissAlert = (id: string) => {
    removeMessage(id);
  };

  const handleError = (err: unknown) => {
    dismissLoading();

    let errorMsg = "Beklenmeyen bir hata oluştu";

    if (err instanceof ZodError) {
      const first = err.errors?.[0];
      if (first) {
        errorMsg = first.message || "Form doğrulama hatası";
      } else {
        errorMsg = "Geçersiz form verisi";
      }
    } else if (typeof err === "object" && err !== null && "message" in err) {
      errorMsg = (err as any).message || errorMsg;
    }

    setTimeout(() => {
      toast.error(errorMsg);
    }, 50);
  };

  return {
    success,
    error,
    loading,
    dismiss,

    showLoading,
    dismissLoading,

    alert,
    dismissAlert,
    clearAlerts: clearMessages,
    handleError,
  };
};
