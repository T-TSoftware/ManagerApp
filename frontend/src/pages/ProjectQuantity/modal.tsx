"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "../../components/layout/ModalWrapper";
import type { QuantityRows } from "./types";
import { financeTypes } from "../../constants/finance/financeTypes";
import { financeCategory } from "../../constants/finance/financeCategory";
import { currencyList } from "../../constants/common/currencyList";
import { paymentMethods } from "../../constants/finance/paymentMethods";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
  DatePicker,
  AutoComplete,
} from "../../components/inputs";
import { useProjects } from "../../hooks/useProjects";
import { AutocompleteOption } from "../../types/grid/commonTypes";
import { useReferenceOptions } from "../../hooks/useReferenceOptions";
import { useParams } from "react-router-dom";
import { useNotifier } from "../../hooks/useNotifier";

const optionalString = z.string().optional().or(z.literal(""));
const schema = z
  .object({
    type: z.string().min(1, "Tür zorunludur."),
    source: optionalString,
    amount: z.coerce.number().positive("Tutar pozitif olmalı."),
    currency: z.string().min(1, "Para birimi zorunludur."),
    code: optionalString,
    projectId: optionalString,
    orderCode: optionalString,
    fromAccountCode: z.string().min(1, "Kaynak Hesap (Giden) zorunludur."),
    toAccountCode: optionalString,
    transactionDate: z.date({
      required_error: "İşlem tarihi zorunludur.",
      invalid_type_error: "Geçerli bir tarih girin.",
    }),
    method: z.string().min(1, "Yöntem zorunludur."),
    category: z.string().min(1, "Kategori zorunludur."),
    description: optionalString,
    invoiceCode: optionalString,
    targetName: optionalString,
    referenceCode: optionalString,
  })
  .superRefine((values, ctx) => {
    if (values.category != "TRANSFER" && values.category != "") {
      if (values.referenceCode === "" || values.referenceCode === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["referenceCode"],
          message: "Reference Kodu zorunludur.",
        });
      }
    }
    if (values.category === "TRANSFER") {
      if (values.toAccountCode === "" || values.toAccountCode === undefined) {
        console.log("a");
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["toAccountCode"],
          message: "Hedef Hesap (Alan) zorunludur.",
        });
      }
    }
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
    formState: { errors, isSubmitting },
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
      description: "",
      amount: 0,
      transactionDate: new Date(),
      type: "",
      source: "",
      currency: "",
      projectId: "",
      fromAccountCode: "",
      toAccountCode: "",
      orderCode: "",
      method: "",
      category: "",
      invoiceYN: "",
      invoiceCode: "",
      targetName: "",
      referenceCode: "",
    };
  }, [defaultValues, mode]);

  const { projectOptionsById } = useProjects();
  const notify = useNotifier();

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FinanceFormSchema) => {
    try {
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
            name="targetName"
            label="Hedef Adı"
            register={register}
            error={errors.targetName?.message}
          />

          <NumberInput
            name="amount"
            label="Tutar"
            register={register}
            error={errors.amount?.message}
            required
          />
          <Dropdown
            name="currency"
            label="Para Birimi"
            options={currencyList}
            register={register}
            error={errors.currency?.message}
            required
          />

          <Dropdown
            name="method"
            label="Yöntem"
            options={paymentMethods}
            register={register}
            error={errors.method?.message}
            required
          />

          <Dropdown
            name="type"
            label="Tür"
            options={financeTypes}
            register={register}
            error={errors.type?.message}
            required
          />

          <Dropdown
            name="category"
            label="Kategori"
            options={financeCategory}
            register={register}
            required
          />

          <Dropdown
            name="referenceCode"
            label="Referans Kodu"
            options={referenceOptions}
            register={register}
            error={errors.referenceCode?.message}
          />

          <Dropdown
            name="projectId"
            label="Proje"
            options={[{ code: "", name: "Seçiniz" }, ...projectOptionsById]}
            register={register}
            error={errors.projectId?.message}
          />

          <DatePicker
            label="İşlem Tarihi"
            value={watch("transactionDate")}
            onChange={(val) => setValue("transactionDate", val!)}
            error={errors.transactionDate?.message}
            required
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

export default QuantityItemModal;
