"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FinanceTransactionRows } from "./types";
import { financeTypes } from "../../constants/financeTypes";
import { financeCategory } from "../../constants/financeCategory";
import { currencyList } from "../../constants/currencyList";

const schema = z
  .object({
    type: z.string().min(1, "Tür zorunludur."),
    source: z.string().min(1, "Kaynak zorunludur."),
    amount: z.coerce.number().positive("Tutar pozitif olmalı."),
    currency: z.string().min(1, "Para birimi zorunludur."),
    fromAccountCode: z.string().optional(),
    toAccountCode: z.string().optional(),
    transactionDate: z.string().optional(),
    method: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    invoiceyn: z.string().optional(),
    invoicecode: z.string().optional(),
    targetname: z.string().optional(),
  });

type FinanceFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<FinanceTransactionRows>;
  onClose: () => void;
  onSubmit: (data: Partial<FinanceTransactionRows>) => Promise<void>;
  onSuccess: () => void;
};

const FinanceTransactionModal = ({
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
  } = useForm<FinanceFormSchema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (defaultValues) {
      const format = (date?: string | Date) =>
        date ? new Date(date).toISOString().slice(0, 16) : "";

      reset({
        ...defaultValues,
        transactionDate: format(defaultValues.transactionDate),
        
      });
    }
  }, [defaultValues, reset]);

  const onFormSubmit = async (data: FinanceFormSchema) => {
    try {
      const transformed: Partial<FinanceTransactionRows> = {
        ...data,
        amount: Number(data.amount),
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : undefined,
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
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {mode === "create" ? "Ödeme Ekle" : "Ödeme Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Tür</label>
            <select
              {...register("type")}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {financeTypes.map((option) => (
                <option key={option.code} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hedef Adı</label>
            <input
              {...register("targetname")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Hedef Adı"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Faturalı mı?
            </label>
            <select
              {...register("invoiceyn")}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Seçiniz</option>
              <option value="Y">Evet</option>
              <option value="N">Hayır</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fatura Kodu
            </label>
            <input
              {...register("invoicecode")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Fatura kodu girin"
            />
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
            <label className="block text-sm font-medium mb-1">
              Para Birimi
            </label>
            <select
              {...register("currency")}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {currencyList.map((option) => (
                <option key={option.code} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-sm">{errors.currency.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Çıkan Hesap
            </label>
            <input
              {...register("fromAccountCode")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Gönderen Hesap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Giden Hesap
            </label>
            <input
              {...register("toAccountCode")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Alan Hesap"
            />
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Yöntem</label>
            <input
              {...register("method")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Yöntem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              {...register("category")}
              className="w-full px-4 py-2 border rounded-lg"
            >
            {financeCategory.map((option) => (
              <option key={option.code} value={option.name}>
                {option.name}
              </option>
            ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kaynak</label>
            <input
              {...register("source")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Kaynak"
            />
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source.message}</p>
            )}
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
              placeholder="Açıklama"
            />
          </div>

          <div className="col-span-3 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border bg-gray-500 text-white hover:shadow-md shadow-gray-400"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-green-700 text-white hover:shadow-lime-600 shadow-md transition"
            >
              {isSubmitting ? "Güncelleniyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceTransactionModal;
