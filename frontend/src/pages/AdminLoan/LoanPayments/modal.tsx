// LoanPaymentModal.tsx
"use client";
import { useEffect, useMemo } from "react";
import ModalWrapper from "../../../components/layout/ModalWrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoanPaymentRows } from "./types";
import { extractApiError } from "../../../utils/axios";
import { useNotifier } from "../../../hooks/useNotifier";
import { DatePicker, Dropdown, NumberInput, TextInput } from "../../../components/inputs";
import { loanPaymentStatus } from "../../../constants/loan/loanPaymentStatus";
import Button from "../../../components/buttons/Button";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  installmentNumber: z.coerce.number().positive("Taksit No pozitif olmalı."),
  dueDate: z.coerce.date({
    required_error: "Vade tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  totalAmount: z.coerce.number().positive("Toplam Tutar pozitif olmalı."),
  interestAmount: z.coerce.number().positive("Faiz Tutarı pozitif olmalı."),
  principalAmount: z.coerce.number().positive("Anapara Tutarı pozitif olmalı."),
  paymentAmount: z.coerce.number().positive("Ödenen Tutar pozitif olmalı."),
  paymentDate: z.coerce.date().optional(),
  status: optionalString,
  penaltyAmount: z.coerce.number().optional(),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  defaultValues?: Partial<LoanPaymentRows>;
  onClose: () => void;
  onSubmit: (data: Partial<LoanPaymentRows>) => Promise<void>;
};

export default function LoanPaymentModal({
  open,
  defaultValues,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const memoDefaults = useMemo(() => {
    if (!defaultValues) return {};
    return {
      ...defaultValues,
      dueDate: defaultValues.dueDate
        ? new Date(defaultValues.dueDate)
        : undefined,
    };
  }, [defaultValues]);
  const notify = useNotifier();
  useEffect(() => {
    if (open) reset(memoDefaults);
  }, [open, memoDefaults, reset]);

    const onFormSubmit = async (data: FormSchema) => {
      try {
        if (!isDirty) {
          notify.error("Kaydedilecek değişiklik yok.");
          return;
        }
        const transformed: Partial<LoanPaymentRows> = {
          ...data,
        };

        await onSubmit(transformed);
      } catch (error) {
        const { errorMessage } = extractApiError(error);
        notify.error(errorMessage);
      }
    };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl dark:bg-primary dark:text-white">
        <h2 className="text-xl font-semibold mb-4">Taksit Güncelle</h2>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-4 gap-4"
        >
          <Dropdown
            name="status"
            label="Durum"
            options={loanPaymentStatus}
            register={register}
            editable={false}
          />

          <TextInput
            name="code"
            label="Kod"
            register={register}
            editable={false}
          />

          <NumberInput
            name="installmentNumber"
            label="Taksit No"
            register={register}
            error={errors.installmentNumber?.message}
            required
          />

          <NumberInput
            name="penaltyAmount"
            label="Ceza Tutarı"
            register={register}
            error={errors.penaltyAmount?.message}
            required
          />

          <NumberInput
            name="totalAmount"
            label="Toplam Tutar"
            register={register}
            error={errors.totalAmount?.message}
            required
          />

          <NumberInput
            name="interestAmount"
            label="Faiz Tutarı"
            register={register}
            error={errors.interestAmount?.message}
            required
          />

          <NumberInput
            name="principalAmount"
            label="Anapara Tutarı"
            register={register}
            error={errors.principalAmount?.message}
            required
          />
          <NumberInput
            name="paymentAmount"
            label="Ödenen Tutar"
            register={register}
            error={errors.paymentAmount?.message}
            required
          />
          <div className="col-span-4 pt-6 flex justify-end gap-4">
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
}
