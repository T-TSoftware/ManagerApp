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
import { DatePicker, Dropdown, NumberInput, TextAreaInput, TextInput } from "../../../components/inputs";
import { loanPaymentStatus } from "../../../constants/loan/loanPaymentStatus";
import Button from "../../../components/buttons/Button";

const optionalString = z.string().optional().or(z.literal(""));
const optionalNumber = z.coerce.number().optional();

const schema = z.object({
  dueDate: z.coerce.date({
    required_error: "Vade tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  defaultValues?: Partial<LoanPaymentRows>;
  onClose: () => void;
  onSubmit: (data: Partial<LoanPaymentRows>) => Promise<void>;
  onSuccess: () => void;
};

export default function LoanPaymentModal({
  open,
  defaultValues,
  onClose,
  onSubmit,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
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
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };

      await onSubmit(transformed);
      onSuccess();
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

          <DatePicker
            label="Son Ödeme Tarihi"
            value={watch("dueDate")}
            onChange={(val) => setValue("dueDate", val!)}
            error={errors.dueDate?.message}
            required
          />

          <NumberInput
            name="installmentNumber"
            label="Taksit No"
            register={register}
            editable={false}
          />

          <NumberInput
            name="penaltyAmount"
            label="Ceza Tutarı"
            register={register}
            editable={false}
          />

          <NumberInput
            name="totalAmount"
            label="Toplam Tutar"
            register={register}
            editable={false}
          />

          <NumberInput
            name="interestAmount"
            label="Faiz Tutarı"
            register={register}
            editable={false}
          />

          <NumberInput
            name="principalAmount"
            label="Anapara Tutarı"
            register={register}
            editable={false}
          />

          <NumberInput
            name="paymentAmount"
            label="Ödenen Tutar"
            register={register}
            editable={false}
          />

          <TextAreaInput
            classes="col-span-4"
            name="description"
            label="Açıklama"
            register={register}
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
