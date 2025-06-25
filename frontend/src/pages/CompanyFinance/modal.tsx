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
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Ödeme Ekle" : "Ödeme Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Tür</label>
            <select
              {...register("type")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
            >
              {financeTypes.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Hedef Adı</label>
            <input
              {...register("targetname")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Hedef Adı"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Faturalı mı?
            </label>
            <select
              {...register("invoiceyn")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
            >
              <option value="">Seçiniz</option>
              <option value="Y">Evet</option>
              <option value="N">Hayır</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Fatura Kodu
            </label>
            <input
              {...register("invoicecode")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Fatura kodu girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Tutar</label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="0"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Para Birimi
            </label>
            <select
              {...register("currency")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
            >
              {currencyList.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-sm">{errors.currency.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Çıkan Hesap
            </label>
            <input
              {...register("fromAccountCode")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Gönderen Hesap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Giden Hesap
            </label>
            <input
              {...register("toAccountCode")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Alan Hesap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              İşlem Tarihi
            </label>
            <input
              type="datetime-local"
              {...register("transactionDate")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Yöntem</label>
            <input
              {...register("method")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Yöntem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Kategori</label>
            <select
              {...register("category")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
            >
            {financeCategory.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Kaynak</label>
            <input
              {...register("source")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Kaynak"
            />
            {errors.source && (
              <p className="text-red-500 text-sm">{errors.source.message}</p>
            )}
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Açıklama</label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              rows={2}
              placeholder="Açıklama"
            />
          </div>

          <div className="col-span-3 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border-light_primary bg-light_primary text-gray-500  hover:shadow-sm dark:bg-secondary dark:hover:shadow-tertiary dark:text-white dark:border-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-white bg-light_fourth hover:shadow-sm hover:shadow-light_fourth  dark:bg-fourth transition"
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
