"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AnnualLeavesRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";

const schema = z.object({
  startDate: z.string().min(1, "Başlangıç tarihi zorunludur."),
  endDate: z.string().min(1, "Bitiş tarihi zorunludur."),
  code: z.string().optional(),
  description: z.string().optional(),
  targetname: z.string().optional(), 
});

type AnnualLeavesSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<AnnualLeavesRows>;
  onClose: () => void;
  onSubmit: (data: Partial<AnnualLeavesRows>) => Promise<void>;
  onSuccess: () => void;
};

const AnnualLeavesModal = ({
  open,
  mode,
  defaultValues,
  onClose,
  onSubmit,
  onSuccess,
}: Props) => {
  const notifier = useNotifier();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnualLeavesSchema>({
    resolver: zodResolver(schema),
  });

    const memoizedDefaultValues = useMemo(() => {
      if (mode === "edit" && defaultValues) {
        const format = (date?: string | Date) =>
          date ? new Date(date).toISOString().slice(0, 10) : "";

        return {
          ...defaultValues,
          startDate: format(defaultValues.startDate),
          endDate: format(defaultValues.endDate),
        };
      }

      return {
        startDate: "",
        endDate: "",
        code: "",
        description: "",
        targetname: "",
      };
    }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const onFormSubmit = async (data: AnnualLeavesSchema) => {
    try {
      const transformed: Partial<AnnualLeavesRows> = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      };

      await onSubmit(transformed);
      onSuccess();

      if (data.startDate && data.endDate && data.targetname) {
        notifier.success(
          `${data.targetname} ${formatDate(data.startDate)} - ${formatDate(
            data.endDate
          )} tarihleri arasında izinli.`
        );
      } else {
        notifier.success("İzin başarıyla eklendi.");
      }
    } catch {
      notifier.error("Bir hata oluştu.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "İzin Ekle" : "İzin Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Personel Adı
            </label>
            <input
              {...register("targetname")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-secondary dark:border-black"
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Kod
            </label>
            <input
              {...register("code")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-secondary dark:border-black"
              placeholder="İzin kodu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-secondary dark:border-black"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-secondary dark:border-black"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Açıklama
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-secondary dark:border-black"
              rows={2}
              placeholder="Açıklama girin"
            />
          </div>

          <div className="col-span-2 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border bg-gray-200 text-gray-700 hover:shadow-sm dark:bg-secondary dark:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnualLeavesModal;
