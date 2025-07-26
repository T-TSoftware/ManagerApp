"use client";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "../../components/layout/ModalWrapper";
import type { AutocompleteOption, FinanceTransactionRows } from "./types";
import { financeTypes } from "../../constants/financeTypes";
import { financeCategory } from "../../constants/financeCategory";
import { currencyList } from "../../constants/currencyList";
import { yesNo } from "../../constants/yesNo";
import { paymentMethods } from "../../constants/paymentMethods";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
  DatePicker,
  AutoComplete,
} from "../../components/inputs";

const optionalString = z.string().optional().or(z.literal(""));
const schema = z.object({
  type: z.string().min(1, "Tür zorunludur."),
  source: z.string().min(1, "Kaynak zorunludur."),
  amount: z.coerce.number().positive("Tutar pozitif olmalı."),
  currency: z.string().min(1, "Para birimi zorunludur."),
  code: optionalString,
  project: optionalString,
  fromAccountCode: optionalString,
  toAccountCode: optionalString,
  transactionDate: z.date({
    required_error: "İşlem tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  method: optionalString,
  category: optionalString,
  description: optionalString,
  invoiceYN: optionalString,
  invoiceCode: optionalString,
  targetName: optionalString,
});

type FinanceFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<FinanceTransactionRows>;
  options: AutocompleteOption[];
  onClose: () => void;
  onSubmit: (data: Partial<FinanceTransactionRows>) => Promise<void>;
  onSuccess: () => void;
};

const FinanceTransactionModal = ({
  open,
  mode,
  defaultValues,
  options,
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
    formState: { errors, isSubmitting },
  } = useForm<FinanceFormSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {

      return {
        ...defaultValues,
        transactionDate: defaultValues?.transactionDate
          ? new Date(defaultValues.transactionDate)
          : undefined,
        fromAccountCode: defaultValues.fromAccount?.code,
        toAccountCode: defaultValues.toAccount?.code,
        project: defaultValues.project ?? undefined,
      };
    }

    return {
      code: "",
      description: "",
      amount: 0,
      transactionDate: new Date(),
      type: "",
      source: "",
      currency: "",
      project: "",
      fromAccountCode: "",
      toAccountCode: "",
      method: "",
      category: "",
      invoiceYN: "",
      invoiceCode: "",
      targetName: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FinanceFormSchema) => {
    try {
      const transformed: Partial<FinanceTransactionRows> = {
        ...data,
        amount: Number(data.amount),
        transactionDate: data.transactionDate
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
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Ödeme Ekle" : "Ödeme Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-4 gap-4"
        >
          <TextInput
            name="targetName"
            label="Hedef Adı"
            register={register}
            error={errors.targetName?.message}
          />

          <TextInput
            name="invoiceCode"
            label="Fatura Kodu"
            register={register}
            error={errors.invoiceCode?.message}
          />

          <TextInput
            name="source"
            label="Kaynak"
            register={register}
            error={errors.source?.message}
          />

          <TextInput
            name="project"
            label="Proje"
            register={register}
            error={errors.project?.message}
          />

          <NumberInput
            name="amount"
            label="Tutar"
            register={register}
            error={errors.amount?.message}
          />

          <Dropdown
            name="type"
            label="Tür"
            options={financeTypes}
            register={register}
            error={errors.type?.message}
          />

          <Dropdown
            name="currency"
            label="Para Birimi"
            options={currencyList}
            register={register}
            error={errors.currency?.message}
          />

          <Dropdown
            name="method"
            label="Yöntem"
            options={paymentMethods}
            register={register}
          />

          <Dropdown
            name="category"
            label="Kategori"
            options={financeCategory}
            register={register}
          />

          <Dropdown
            name="invoiceYN"
            label="Faturalı mı?"
            options={yesNo}
            register={register}
          />

          <DatePicker
            label="İşlem Tarihi"
            value={watch("transactionDate")}
            onChange={(val) => setValue("transactionDate", val!)}
            error={errors.transactionDate?.message}
            required
          />

          <AutoComplete
            options={options}
            label="Kaynak Hesap (Giden)"
            value={watch("fromAccountCode")!}
            onChange={(val) => setValue("fromAccountCode", val)}
            placeholder="Kaynak Hesap"
          />

          <AutoComplete
            options={options}
            label="Hedef Hesap (Alan)"
            value={watch("toAccountCode")!}
            onChange={(val) => setValue("toAccountCode", val)}
            placeholder="Hedef Hesap"
          />

          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
          />
          <div className="col-span-4 pt-6 flex justify-end gap-3">
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
              {isSubmitting ? "Güncelleniyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default FinanceTransactionModal;
