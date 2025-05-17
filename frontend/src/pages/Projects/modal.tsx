"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectRows } from "./types";

const schema = z.object({
  code: z.string().min(1, "Kod zorunludur"),
  name: z.string().min(1, "Ad zorunludur"),
  site: z.string().optional(),
  status: z.string().optional(),
});

type ProjectFormSchema = z.infer<typeof schema>;
  console.log("MODAL STATE");
type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<ProjectRows>;
  onClose: () => void;
  onSubmit: (data: Partial<ProjectRows>) => Promise<void>;
  onSuccess: () => void;
};

const ProjectModal = ({
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
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      name: "",
      site: "",
      status: "",
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onFormSubmit = async (data: ProjectFormSchema) => {
    try {
      await onSubmit(data);
      onSuccess();
    } catch (err) {
      alert("Bir hata oluştu.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-tertiary p-6 rounded-lg w-[32rem] shadow-lg space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "create" ? "Yeni Proje Oluştur" : "Projeyi Güncelle"}
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <div>
            <input
              {...register("code")}
              placeholder="Kod"
              className="w-full px-4 py-2 border rounded"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("name")}
              placeholder="Ad"
              className="w-full px-4 py-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <input
            {...register("site")}
            placeholder="Adres"
            className="w-full px-4 py-2 border rounded"
          />

          <input
            {...register("status")}
            placeholder="Durum"
            className="w-full px-4 py-2 border rounded"
          />

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border bg-gray-300 text-black hover:bg-gray-400"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
