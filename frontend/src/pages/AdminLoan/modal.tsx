"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoansRows } from "./types";
import ModalWrapper from "../../components/layout/ModalWrapper";
import {
  TextInput,
  NumberInput,
  TextAreaInput,
  DatePicker,
  Dropdown,
  AutoComplete,
} from "../../components/inputs";
import { loanStatus } from "../../constants/loanStatus";
import { useProjects } from "../../hooks/useProjects";
import { AutocompleteOption } from "../../types/grid/commonTypes";
import { useNotifier } from "../../hooks/useNotifier";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  code: optionalString,
  name: z.string().min(1, "Ad zorunludur."),
  accountNo: z.string().min(1, "Hesap No zorunludur."),
  totalAmount: z.coerce
    .number()
    .positive("Toplam Kredi Tutarı pozitif olmalı."),
  interestRate: z.coerce.number().positive("Kalan Ana Para pozitif olmalı."),
  remainingPrincipal: z.coerce.number().positive("Faiz Oranı pozitif olmalı."),
  remainingInstallmentAmount: z.coerce
    .number()
    .positive("Faiz Oranı pozitif olmalı."),
  totalInstallmentCount: z.coerce
    .number()
    .positive("Kalan Taksit Tutarı pozitif olmalı."),
  loanDate: z.date({
    required_error: "Kredi tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  purpose: z.string().min(1, "Kredi Amacı zorunludur."),
  loanType: z.string().min(1, "Kredi Türü zorunludur."),
  projectCode: optionalString,
  bankCode:optionalString,
  status: optionalString,
  description: z.string().optional(),
});

type LoanFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<LoansRows>;
  options: AutocompleteOption[];
  onClose: () => void;
  onSubmit: (data: Partial<LoansRows>) => Promise<void>;
  onSuccess: () => void;
};

const LoanModal = ({
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormSchema>({
    resolver: zodResolver(schema),
  });
  const notify = useNotifier();
  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
     
      return {
        ...defaultValues,
        loanDate: defaultValues?.loanDate
          ? new Date(defaultValues.loanDate)
          : undefined,
        projectCode: defaultValues.project?.name,
        bankCode: defaultValues.bank?.name,
      };
    }

    return {
      code: "",
      name: "",
      accountNo: "",
      totalAmount: 0,
      interestRate: 0,
      totalInstallmentCount: 0,
      loanDate: new Date(),
      purpose: "",
      loanType: "",
      status: "",
      description: "",
      remainingPrincipal: 0,
      remainingInstallmentAmount: 0,
      projectCode: "",
      bankCode:"",
    };
  }, [defaultValues, mode]);
const { projectOptionsByCode, loading } = useProjects();
  
  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);


const onFormSubmit = async (data: LoanFormSchema) => {
  try {
    const transformed: Partial<LoansRows> = {
      ...data,
      totalAmount: Number(data.totalAmount),
      loanDate: data.loanDate ? new Date(data.loanDate) : undefined, 
    };

    await onSubmit(transformed);
    onSuccess();
  } catch {
    notify.error("Bir hata oluştu.");
  }
};

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Kredi Ekle" : "Kredi Düzenle"}
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
            editable={false}
          />

          <Dropdown
            name="status"
            label="Durum"
            options={loanStatus}
            hidden={mode === "create" ? true : false}
            register={register}
            editable={false}
          />

          <TextInput
            name="name"
            label="Ad"
            register={register}
            error={errors.name?.message}
          />
          <TextInput
            name="accountNo"
            label="Hesap No"
            register={register}
            error={errors.accountNo?.message}
          />
          <NumberInput
            name="totalAmount"
            label="Toplam Kredi Tutarı"
            register={register}
            error={errors.totalAmount?.message}
          />
          <NumberInput
            name="remainingPrincipal"
            label="Kalan Ana Para"
            register={register}
            error={errors.remainingPrincipal?.message}
          />
          <NumberInput
            name="remainingInstallmentAmount"
            label="Kalan Taksit Tutarı"
            register={register}
            error={errors.remainingInstallmentAmount?.message}
          />
          <NumberInput
            name="interestRate"
            label="Faiz Oranı (%)"
            register={register}
            error={errors.interestRate?.message}
          />
          <NumberInput
            name="totalInstallmentCount"
            label="Toplam Taksit Sayısı"
            register={register}
            error={errors.totalInstallmentCount?.message}
          />
          <DatePicker
            label="Kredi Tarihi"
            value={watch("loanDate")}
            onChange={(val) => setValue("loanDate", val!)}
            error={errors.loanDate?.message}
            required
          />
          <TextInput
            name="purpose"
            label="Kredi Amacı"
            register={register}
            error={errors.purpose?.message}
          />
          <TextInput
            name="loanType"
            label="Kredi Türü"
            register={register}
            error={errors.loanType?.message}
          />
          <Dropdown
            name="projectCode"
            label="Proje"
            options={[{ code: "", name: "Seçiniz" }, ...projectOptionsByCode]}
            register={register}
          />
          <AutoComplete
            options={options}
            label="Banka"
            value={watch("bankCode")!}
            onChange={(val) => setValue("bankCode", val)}
            placeholder="Banka"
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
              className="px-5 py-2 rounded-lg border-light_primary bg-light_primary text-gray-500 hover:shadow-sm dark:bg-secondary dark:hover:shadow-tertiary dark:text-white dark:border-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-white bg-light_fourth hover:shadow-sm hover:shadow-light_fourth dark:bg-fourth transition"
            >
              {isSubmitting ? "Güncelleniyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default LoanModal;
