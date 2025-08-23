"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesRows } from "./types";
import ModalWrapper from "../../components/layout/ModalWrapper";
import {
  Dropdown,
  NumberInput,
  TextAreaInput,
  TextInput,
} from "../../components/inputs";
import { useProjects } from "../../hooks/useProjects";
import Button from "../../components/buttons/Button";
import { stockCategories } from "../../constants/stock/stockCategories";
import { useStocks } from "../../hooks/useStocks";
import { useNotifier } from "../../hooks/useNotifier";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  customerName: z.string().min(1, "Müşteri zorunludur"),
  description: optionalString,
  totalAmount: z.coerce.number().positive("Toplam Ödeme zorunludur"),
  projectId: optionalString,
  stockType: z.string().min(1, "Stok Tipi zorunludur."),
  stockCode: z.string().min(1, "Stok Kodu zorunludur."),
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

  const notify = useNotifier();
  const { projectOptionsById } = useProjects();

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        projectId: defaultValues.project?.id,
      };
    }

    return {
      customerName: "",
      description: "",
      totalAmount: 0,
      projectCode: "",
      stockType: "",
      stockCode: "",
    };
  }, [defaultValues, mode]);


  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const { stockOptions, loading: loadingStocks } = useStocks();

  const onFormSubmit = async (data: FormSchema) => {
    try {
      await onSubmit(data);
      onSuccess();
    } catch {
      notify.error("Bir hata oluştu.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Satış Ekle" : "Satış Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <TextInput
            name="customerName"
            label="Müşteri"
            register={register}
            error={errors.customerName?.message}
            required
          />

          <Dropdown
            name="projectId"
            label="Proje"
            options={[{ code: "", name: "Seçiniz" }, ...projectOptionsById]}
            register={register}
          />

          <Dropdown
            name="stockType"
            label="Stok Tipi"
            options={stockCategories}
            register={register}
            error={errors.stockType?.message}
            required
          />

          <Dropdown
            name="stockCode"
            label="Stok Kodu"
            options={[{ code: "", name: "Seçiniz" }, ...stockOptions]}
            register={register}
            error={errors.stockCode?.message}
            required
          />

          <NumberInput
            name="totalAmount"
            label=" Toplam Tutar"
            register={register}
            error={errors.totalAmount?.message}
            required
          />

          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
          />

          <div className="col-span-3 pt-6 flex justify-end gap-3">
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

export default SalesModal;
