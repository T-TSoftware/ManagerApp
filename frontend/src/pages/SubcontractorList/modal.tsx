"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubcontractorListRows } from "./types";

const schema = z.object({
  name: z.string().min(1, "Tedarikçi adı zorunludur"),
  site: z.string().optional(),
  status: z.string().optional(),
  estimatedStartDate: z.string().optional(),
  actualStartDate: z.string().optional(),
  estimatedEndDate: z.string().optional(),
  actualEndDate: z.string().optional(),
});

type SubcontractorsFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<SubcontractorListRows>;
  onClose: () => void;
  onSubmit: (data: Partial<SubcontractorListRows>) => Promise<void>;
  onSuccess: () => void;
};

const SubcontractorListModal = ({
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
  } = useForm<SubcontractorsFormSchema>({
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

const onFormSubmit = async (data: SubcontractorsFormSchema) => {
  try {
    const transformed: Partial<SubcontractorListRows> = {
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
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {mode === "create" ? "Proje Yarat" : "Projeyi Güncelle"}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Adı
            </label>
            <input
              {...register("name")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Proje adı girin"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şantiye
            </label>
            <input
              {...register("site")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Şantiye girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <input
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Durum girin (ör: Planned)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahmini Başlangıç
              </label>
              <input
                type="datetime-local"
                {...register("estimatedStartDate")}
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gerçek Başlangıç
              </label>
              <input
                type="datetime-local"
                {...register("actualStartDate")}
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahmini Bitiş
              </label>
              <input
                type="datetime-local"
                {...register("estimatedEndDate")}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gerçek Bitiş
              </label>
              <input
                type="datetime-local"
                {...register("actualEndDate")}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
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

export default SubcontractorListModal;
