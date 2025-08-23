"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StockRows } from "./types";
import ModalWrapper from "../../components/layout/ModalWrapper";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
  DatePicker,
} from "../../components/inputs";
import { useNotifier } from "../../hooks/useNotifier";
import Button from "../../components/buttons/Button";
import { useProjects } from "../../hooks/useProjects";
import { stockCategories } from "../../constants/stock/stockCategories";
import { units } from "../../constants/stock/units";
import { extractApiError } from "../../utils/axios";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  name: z.string().min(1, "İsim zorunludur"),
  category: z.string().min(1, "Kategori zorunludur"),
  unit: z.string().min(1, "Birim zorunludur"),
  quantity: z.coerce.number().positive("Miktar pozitif olmalı"),
  stockDate: z.date({
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  location: optionalString,
  projectId: optionalString,
  description: optionalString,
  minimumQuantity: z.coerce.number().optional(),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<StockRows>;
  onClose: () => void;
  onSubmit: (data: Partial<StockRows>) => Promise<void>;
  onSuccess: () => void;
};

const StockModal = ({
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
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const notify = useNotifier();
  const { projectOptionsById, loading } = useProjects();

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        stockDate: defaultValues?.stockDate
          ? new Date(defaultValues.stockDate)
          : undefined,
        projectId: defaultValues.project?.id
      };
    }

    return {
      name: "",
      category: "",
      unit: "",
      quantity: 0,
      minimumQuantity: 0,
      description: "",
      location: "",
      stockDate: new Date(),
      projectId: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<StockRows> = {
        ...data,
        stockDate: data.stockDate ? new Date(data.stockDate) : undefined,
      };

      await onSubmit(transformed);
      onSuccess();
    } catch (error) {
       const { errorMessage} = extractApiError(error);
       notify.error(errorMessage);
  }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Çek Ekle" : "Çek Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <TextInput
            name="code"
            label="Stock Kodu"
            register={register}
            editable={mode === "create" ? true : false}
            hidden={mode === "create" ? true : false}
          />
          <TextInput
            name="name"
            label="Stock Adı"
            register={register}
            error={errors.name?.message}
            required
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
          <NumberInput
            name="minimumQuantity"
            label="Minimum Miktar"
            register={register}
          />
          <DatePicker
            label="Stock Tarihi"
            value={watch("stockDate")}
            onChange={(val) => setValue("stockDate", val!)}
          />
          <Dropdown
            name="projectId"
            label="Proje"
            options={[{ code: "", name: "Seçiniz" }, ...projectOptionsById]}
            register={register}
          />

          <TextInput name="location" label="Konum" register={register} />

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

export default StockModal;
