"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "../../components/layout/ModalWrapper";
import type { QuantityRows } from "./types";
import { stockCategories } from "../../constants/stock/stockCategories";
import { units } from "../../constants/stock/units";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
} from "../../components/inputs";
import { useReferenceOptions } from "../../hooks/useReferenceOptions";
import { useParams } from "react-router-dom";
import { useNotifier } from "../../hooks/useNotifier";
import Button from "../../components/buttons/Button";

const optionalString = z.string().optional().or(z.literal(""));
const schema = z.object({
  code: optionalString,
  category: z.string().min(1, "Kategori zorunludur."),
  unit: z.string().min(1, "Birim zorunludur."),
  quantity: z.coerce.number().positive("Miktar pozitif olmalı."),
  description: optionalString,
  projectId:optionalString,
});

type FinanceFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<QuantityRows>;
  onClose: () => void;
  onSubmit: (data: Partial<QuantityRows>) => Promise<void>;
  onSuccess: () => void;
};

const QuantityItemModal = ({
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
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FinanceFormSchema>({
    resolver: zodResolver(schema),
  });
  const selectedCategory = watch("category");
  const { projectId } = useParams();
  const { options: referenceOptions } = useReferenceOptions(
    selectedCategory,
    projectId
  );

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
      };
    }

    return {
      code: "",
      category: "",
      unit: "",
      quantity: 0,
      description: "",
      projectId: projectId
    };
  }, [defaultValues, mode]);

  const notify = useNotifier();

  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FinanceFormSchema) => {
    try {
      if (mode === "edit" && !isDirty) {
        notify.error("Kaydedilecek değişiklik yok.");
        return;
      }
      
      const transformed: Partial<QuantityRows> = {
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
          {mode === "create" ? "Metraj Ekle" : "Metraj Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <TextInput
            name="code"
            label="Kod"
            register={register}
            hidden={mode === "create" ? true : false}
          />

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
            name="quantity"
            label="Miktar"
            register={register}
            error={errors.quantity?.message}
            required
          />

          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
          />

          <div className="col-span-4 pt-6 flex justify-end gap-3">
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
              disabled={isSubmitting || (mode === "edit" && !isDirty)}
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default QuantityItemModal;
