"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierListRows } from "./types";

const schema = z.object({
  name: z.string().min(1, "Tedarikçi adı zorunludur"),
  site: z.string().optional(),
  status: z.string().optional(),
  estimatedStartDate: z.string().optional(),
  actualStartDate: z.string().optional(),
  estimatedEndDate: z.string().optional(),
  actualEndDate: z.string().optional(),
});

type SuppliersFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<SupplierListRows>;
  onClose: () => void;
  onSubmit: (data: Partial<SupplierListRows>) => Promise<void>;
  onSuccess: () => void;
};

const SupplierListModal = ({
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
  } = useForm<SuppliersFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      site: "",
      status: "Planned",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      const format = (date?: string | Date) =>
        date ? new Date(date).toISOString().slice(0, 16) : "";

      reset({
        ...defaultValues,
        estimatedStartDate: format(defaultValues.estimatedStartDate),
        actualStartDate: format(defaultValues.actualStartDate),
        estimatedEndDate: format(defaultValues.estimatedEndDate),
        actualEndDate: format(defaultValues.actualEndDate),
      });
    }
  }, [defaultValues, reset]);

const onFormSubmit = async (data: SuppliersFormSchema) => {
  try {
    const transformed: Partial<SupplierListRows> = {
      ...data,
      estimatedStartDate: data.estimatedStartDate
        ? new Date(data.estimatedStartDate)
        : undefined,
      actualStartDate: data.actualStartDate
        ? new Date(data.actualStartDate)
        : undefined,
      estimatedEndDate: data.estimatedEndDate
        ? new Date(data.estimatedEndDate)
        : undefined,
      actualEndDate: data.actualEndDate
        ? new Date(data.actualEndDate)
        : undefined,
    };

    await onSubmit(transformed);
    onSuccess();
  } catch (err) {
    alert("Bir hata oluştu.");
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Proje Yarat" : "Projeyi Güncelle"}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Proje Adı
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Proje adı girin"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Şantiye
            </label>
            <input
              {...register("site")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Şantiye girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Durum
            </label>
            <input
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Durum girin (ör: Planned)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Tahmini Başlangıç
              </label>
              <input
                type="datetime-local"
                {...register("estimatedStartDate")}
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Gerçek Başlangıç
              </label>
              <input
                type="datetime-local"
                {...register("actualStartDate")}
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Tahmini Bitiş
              </label>
              <input
                type="datetime-local"
                {...register("estimatedEndDate")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Gerçek Bitiş
              </label>
              <input
                type="datetime-local"
                {...register("actualEndDate")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
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
              {isSubmitting
                ? mode === "create"
                  ? "Oluşturuluyor..."
                  : "Güncelleniyor..."
                : mode === "create"
                ? "Proje Oluştur"
                : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierListModal;
