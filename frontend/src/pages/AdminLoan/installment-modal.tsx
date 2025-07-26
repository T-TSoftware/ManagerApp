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
} from "../../components/inputs";

const schema = z.object({
  code: z.string().min(1, "Kod zorunludur."),
  name: z.string().min(1, "Ad zorunludur."),
  accountNo: z.string().min(1, "Hesap No zorunludur."),
  totalAmount: z.coerce
    .number()
    .positive("Toplam Kredi Tutarı pozitif olmalı."),
  interestRate: z.coerce.number().positive("Faiz Oranı pozitif olmalı."),
  totalInstallmentCount: z.coerce
    .number()
    .positive("Toplam Taksit Sayısı  pozitif olmalı."),
  loanDate: z.date({
    required_error: "Kredi tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  purpose: z.string().min(1, "Kredi Amacı zorunludur."),
  loanType: z.string().min(1, "Kredi Türü zorunludur."),
  status: z.string().min(1, "Durum zorunludur."),
  description: z.string().optional(),
});

type LoanFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<LoansRows>;
  onClose: () => void;
  onSubmit: (data: Partial<LoansRows>) => Promise<void>;
  onSuccess: () => void;
};

const InstallmentModal = ({
  open,
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
  } = useForm<LoanFormSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
  
      return {
        ...defaultValues,
        loanDate: defaultValues?.loanDate
          ? new Date(defaultValues.loanDate)
          : undefined,
      };
    

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
    };
  }, [defaultValues]);

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
      alert("Bir hata oluştu.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-5xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
         "Kredi"
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Durum
            </label>
            <input
              {...register("status")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light_fourth dark:bg-secondary dark:border-black"
              placeholder="Aktif / Pasif vb."
            />
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>
          <TextInput
            name="status"
            label="Durum"
            register={register}
            error={errors.status?.message}
          />
          <TextInput
            name="code"
            label="Kod"
            register={register}
            error={errors.code?.message}
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

export default InstallmentModal;
