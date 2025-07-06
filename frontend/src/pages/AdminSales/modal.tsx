"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesRows } from "./types";

const schema = z.object({
  customerName: z.string().min(1, "Müşteri zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  totalamount: z.coerce.number().positive("Toplam Ödeme zorunludur"),
  receivedamount: z.coerce.number().positive("Alınan ödeme  pozitif olmalı."),
  projectid: z.string().min(1, "Proje zorunludur."),
  stocktype: z.string().min(1, "Stok Tipi zorunludur."),
  stockid: z.string().min(1, "Stok Id zorunludur."),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<SalesRows>;
  onClose: () => void;
  onSubmit: (data: Partial<SalesRows>) => Promise<void>;
  onSuccess: () => void;
};

const SalesModal = ({
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
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      await onSubmit(data);
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
          {mode === "create" ? "Satış Ekle" : "Satış Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Müşteri</label>
            <input
              {...register("customerName")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Müşteri adı"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm">
                {errors.customerName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Proje</label>
            <input
              {...register("projectid")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Proje ID"
            />
            {errors.projectid && (
              <p className="text-red-500 text-sm">{errors.projectid.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stok Tipi</label>
            <input
              {...register("stocktype")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Stok Tipi"
            />
            {errors.stocktype && (
              <p className="text-red-500 text-sm">{errors.stocktype.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stok ID</label>
            <input
              {...register("stockid")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Stok ID"
            />
            {errors.stockid && (
              <p className="text-red-500 text-sm">{errors.stockid.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Toplam Tutar
            </label>
            <input
              type="number"
              {...register("totalamount")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Toplam Tutar"
            />
            {errors.totalamount && (
              <p className="text-red-500 text-sm">
                {errors.totalamount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Alınan Tutar
            </label>
            <input
              type="number"
              {...register("receivedamount")}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Alınan Tutar"
            />
            {errors.receivedamount && (
              <p className="text-red-500 text-sm">
                {errors.receivedamount.message}
              </p>
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
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
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
              className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesModal;
