"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckFinanceRows } from "./types";
import { checkStatus } from "../../constants/checkStatus";

const schema = z.object({
  checkDate: z.string().min(1, "Çek tarihi zorunludur"),
  bankCode: z.string().min(1, "Banka Kodu zorunludur"),
  transactionDate: z.string().min(1, "İşlem tarihi zorunludur"),
  firm: z.string().min(1, "Firma adı zorunludur"),
  amount: z.coerce.number().positive("Tutar pozitif olmalı"),
  checkNo: z.string().min(1, "Çek numarası zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  type: z.string().min(1, "Tür zorunludur"),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<CheckFinanceRows>;
  onClose: () => void;
  onSubmit: (data: Partial<CheckFinanceRows>) => Promise<void>;
  onSuccess: () => void;
};

const CheckFinanceModal = ({
  open,
  mode,
  defaultValues,
  onClose,
  onSubmit,
  onSuccess,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (defaultValues) {
      const formatDateOnly = (date?: string | Date) =>
        date ? new Date(date).toISOString().slice(0, 10) : "";
      const formatDateTime = (date?: string | Date) =>
        date ? new Date(date).toISOString().slice(0, 16) : "";

      reset({
        ...defaultValues,
        checkDate: formatDateOnly(defaultValues.checkDate),
        transactionDate: formatDateTime(defaultValues.transactionDate),
      });
    }
  }, [defaultValues, reset]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<CheckFinanceRows> = {
        ...data,
        amount: Number(data.amount),
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : undefined,
        checkDate: data.checkDate, // string olarak kalıyor
      };

      await onSubmit(transformed);
      onSuccess();
    } catch {
      alert("Bir hata oluştu.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {mode === "create" ? "Çek Ekle" : "Çek Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Çek Tarihi</label>
            <input
              type="date"
              {...register("checkDate")}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.checkDate && (
              <p className="text-red-500 text-sm">{errors.checkDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              İşlem Tarihi
            </label>
            <input
              type="datetime-local"
              {...register("transactionDate")}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.transactionDate && (
              <p className="text-red-500 text-sm">
                {errors.transactionDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Firma</label>
            <input
              {...register("firm")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Firma"
            />
            {errors.firm && (
              <p className="text-red-500 text-sm">{errors.firm.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tutar</label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="0"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Çek No</label>
            <input
              {...register("checkNo")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Çek numarası"
            />
            {errors.checkNo && (
              <p className="text-red-500 text-sm">{errors.checkNo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bank Code</label>
            <input
              {...register("bankCode")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Çek numarası"
            />
            {errors.bankCode && (
              <p className="text-red-500 text-sm">{errors.bankCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Durum</label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {checkStatus.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tür</label>
            <input
              {...register("type")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Tür"
            />
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
              placeholder="Açıklama girin"
            />
          </div>

          <div className="col-span-3 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Güncelleniyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckFinanceModal;
