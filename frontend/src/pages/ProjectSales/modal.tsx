"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesRows } from "./types";
import ModalWrapper from "../../components/layout/ModalWrapper";
import { Dropdown, NumberInput, TextAreaInput } from "../../components/inputs";
import { financeTypes } from "../../constants/financeTypes";

const schema = z.object({
  customerName: z.string().min(1, "Müşteri zorunludur"),
  description: z.string().min(1, "Açıklama zorunludur"),
  totalAmount: z.coerce.number().positive("Toplam Ödeme zorunludur"),
  receivedamount: z.coerce.number().positive("Alınan ödeme  pozitif olmalı."),
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


    const memoizedDefaultValues = useMemo(() => {
      if (mode === "edit" && defaultValues) {
        return {
          ...defaultValues,
        };
      }

      return {
        customerName: "",
        description: "",
        totalamount: 0,
        receivedamount: 0,
        stocktype: "",
        stockid: "",
      };
    }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      await onSubmit(data);
      onSuccess();
    } catch {
      alert("Bir hata oluştu.");
    }
  };


  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {mode === "create" ? "Satış Ekle" : "Satış Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <Dropdown
            name="customerName"
            label="Müşteri"
            options={financeTypes}
            register={register}
            error={errors.customerName?.message}
          />

          <Dropdown
            name="stocktype"
            label="Stok Tipi"
            options={financeTypes}
            register={register}
            error={errors.stocktype?.message}
          />

          <Dropdown
            name="stockid"
            label="Stok"
            options={financeTypes}
            register={register}
            error={errors.stockid?.message}
          />

          <NumberInput
            name="totalAmount"
            label=" Toplam Tutar"
            register={register}
            error={errors.totalAmount?.message}
          />

          <NumberInput
            name="receivedamount"
            label=" Alınan Tutar"
            register={register}
            error={errors.receivedamount?.message}
          />
          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
            error={errors.description?.message}
          />

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
    </ModalWrapper>
  );
};

export default SalesModal;
