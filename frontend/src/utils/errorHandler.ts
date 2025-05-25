import { ZodError } from "zod";

export const handleKnownError = (
  error: unknown,
  notify: {
    error: (msg: string) => void;
    alert: (args: {
      id: string;
      message: string;
      type?: "warning" | "error";
    }) => void;
    dismiss: () => void;
  }
) => {
  notify.dismiss();

  // Zod validation hatası
  if (error instanceof ZodError) {
    const msg =
      error.errors?.[0]?.message || "Lütfen gerekli alanları doldurun.";
    notify.error(msg);
    return;
  }

  // Fetch kullanıyorsan response objesi throw edilmiş olabilir
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as any).status === "number"
  ) {
    const err = error as { status: number; message?: string };

    if (err.status === 401) {
      notify.alert({
        id: "unauthorized",
        message: "Yetkisiz işlem. Lütfen tekrar giriş yapın.",
        type: "error",
      });
    } else if (err.status === 403) {
      notify.alert({
        id: "forbidden",
        message: "Bu işlemi yapmaya yetkiniz yok.",
        type: "error",
      });
    } else if (err.status === 500) {
      notify.error("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
    } else {
      notify.error(err.message || "Bir hata oluştu.");
    }

    return;
  }

  // Genel Error nesnesi
  if (error instanceof Error) {
    notify.error(error.message);
    return;
  }

  // Bilinmeyen hata
  notify.error("Bilinmeyen bir hata oluştu.");
};
