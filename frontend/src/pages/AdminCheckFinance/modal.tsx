"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckFinanceRows } from "./types";
import { checkStatus } from "../../constants/checkStatus";
import ModalWrapper from "../../components/layout/ModalWrapper";
import { checkTypes } from "../../constants/checkTypes";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
  DatePicker,
} from "../../components/inputs";

const schema = z.object({
  checkDate: z.date({
    required_error: "Çek tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  bankCode: z.string().min(1, "Banka Kodu zorunludur"),
  transactionDate: z.date({
    required_error: "İşlem tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  firm: z.string().min(1, "Firma adı zorunludur"),
  amount: z.coerce.number().positive("Tutar pozitif olmalı"),
  checkNo: z.string().min(1, "Çek numarası zorunludur"),
  projectid: z.string().optional(),
  status: z.string().optional(),
  type: z.string().min(1, "Tür zorunludur"),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<CheckFinanceRows>;
  onClose: () => void;
  onSubmit: (data: Partial<CheckFinanceRows>) => Promise<void>;
  onSuccess: () => void;
};

const CheckFinanceModal = ({
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
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      const formatDateOne = (date?: string | Date) =>
        date ? new Date(date).toISOString().slice(0, 10) : "";
      const formatDateTwo = (date?: string | Date) =>
        date ? new Date(date).toISOString().slice(0, 16) : "";

      return {
        ...defaultValues,
        checkDate: defaultValues?.checkDate
          ? new Date(defaultValues.checkDate)
          : undefined,
        transactionDate: defaultValues?.transactionDate
          ? new Date(defaultValues.transactionDate)
          : undefined,
      };
    }

    return {
      checkDate: new Date(),
      bankCode: "",
      transactionDate: new Date(),
      firm: "",
      amount: 0,
      checkNo: "",
      status: "",
      type: "",
      description: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<CheckFinanceRows> = {
        ...data,
        amount: Number(data.amount),
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : undefined,
        checkDate: data.transactionDate
          ? new Date(data.transactionDate)
          : undefined,
      };

      await onSubmit(transformed);
      onSuccess();
    } catch {
      alert("Bir hata oluştu.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      {" "}
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {mode === "create" ? "Çek Ekle" : "Çek Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >

          <DatePicker
            label="Çek Tarihi"
            value={watch("checkDate")}
            onChange={(val) => setValue("checkDate", val!)}
            error={errors.checkDate?.message}
            required
          />

          <TextInput
            name="checkNo"
            label="Çek No"
            register={register}
            error={errors.checkNo?.message}
          />

          <DatePicker
            label="İşlem Tarihi"
            value={watch("transactionDate")}
            onChange={(val) => setValue("transactionDate", val!)}
            error={errors.transactionDate?.message}
            required
          />
          <TextInput
            name="firm"
            label="Firma"
            register={register}
            error={errors.firm?.message}
          />

          <TextInput
            name="bankCode"
            label="Banka"
            register={register}
            error={errors.bankCode?.message}
          />

          <NumberInput
            name="amount"
            label="Tutar"
            register={register}
            error={errors.amount?.message}
          />
          <TextInput name="projectid" label="Proje" register={register} />

          <Dropdown
            name="status"
            label="Durum"
            options={checkStatus}
            register={register}
          />

          <Dropdown
            name="type"
            label="Tür"
            options={checkTypes}
            register={register}
          />

          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
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
              {isSubmitting ? "Güncelleniyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default CheckFinanceModal;
