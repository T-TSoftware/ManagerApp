"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplyRows } from "./types";
import ModalWrapper from "../../components/layout/ModalWrapper";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
} from "../../components/inputs";
import { useNotifier } from "../../hooks/useNotifier";
import Button from "../../components/buttons/Button";
import { stockCategories } from "../../constants/stock/stockCategories";
import { units } from "../../constants/stock/units";
import { supplierStatus } from "../../constants/supplier/supplierStatus";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  category: z.string().min(1, "Kategori zorunludur"),
  unit: z.string().min(1, "Birim zorunludur"),
  companyName: optionalString,
  unitPrice: z.coerce.number().positive("Birim Fiyat olmalı."),
  quantity: z.coerce.number().positive("Miktar pozitif olmalı."),
  contractAmount: z.coerce.number().positive("Sözleşme Tutarı pozitif olmalı."),
  description: optionalString,
  status: z.string().min(1, "Durum zorunludur"),
  type: optionalString,
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<SupplyRows>;
  onClose: () => void;
  onSubmit: (data: Partial<SupplyRows>) => Promise<void>;
  onSuccess: () => void;
};

const SupplyModal = ({
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
  const notify = useNotifier();
  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
      };
    }

    return {
      companyName: "",
      category: "",
      unit: "",
      unitPrice: 0,
      quantity: 0,
      contractAmount: 0,
      remainingAmount: 0,
      description: "",
      status: "",
      type: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<SupplyRows> = {
        ...data,
      };

      await onSubmit(transformed);
      onSuccess();
    } catch {
      notify.error("Bir hata oluştu.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create"
            ? "Tedarikçi Ekle"
            : "Tedarikçi Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <Dropdown
            name="status"
            label="Durum"
            options={supplierStatus}
            register={register}
            error={errors.status?.message}
            required
          />

          <TextInput name="companyName" label="Şirket" register={register} />

          <Dropdown
            name="category"
            label="Kategori"
            options={stockCategories}
            register={register}
            error={errors.category?.message}
            required
          />

          <Dropdown
            name="unit"
            label="Birim"
            options={units}
            register={register}
            error={errors.unit?.message}
            required
          />

          <NumberInput
            name="unitPrice"
            label="Birim Fiyat"
            register={register}
            error={errors.unitPrice?.message}
          />

          <NumberInput
            name="quantity"
            label="Miktar"
            register={register}
            error={errors.quantity?.message}
          />

          <NumberInput
            name="contractAmount"
            label="Sözleşme Tutarı"
            register={register}
            error={errors.contractAmount?.message}
          />

          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
          />

          <div className="col-span-3 pt-6 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              label="İptal Et"
              variant="secondary"
              disabled
            />
            <Button
              type="submit"
              label="Kaydet"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default SupplyModal;
