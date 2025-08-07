"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AnnualLeavesRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { DatePicker, TextAreaInput } from "../../components/inputs";
import ModalWrapper from "../../components/layout/ModalWrapper";
import Button from "../../components/buttons/Button";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  startDate: z.date({
    required_error: "Başlangıç tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  endDate: z.date({
    required_error: "Bitiş tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  description: optionalString,
  type: z.string().min(1, "Tür zorunludur."),
});

type AnnualLeavesSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<AnnualLeavesRows>;
  onClose: () => void;
  onSubmit: (data: Partial<AnnualLeavesRows>) => Promise<void>;
  onSuccess: () => void;
};

const AnnualLeavesModal = ({
  open,
  mode,
  defaultValues,
  onClose,
  onSubmit,
  onSuccess,
}: Props) => {
  const notifier = useNotifier();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnnualLeavesSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
       
      return {
        ...defaultValues,
        startDate: defaultValues?.startDate
          ? new Date(defaultValues.startDate)
          : undefined,
        endDate: defaultValues?.endDate
          ? new Date(defaultValues.endDate)
          : undefined,
      };
    }

    return {
      startDate: new Date(),
      endDate: new Date(),
      description: "",
      targetname: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const onFormSubmit = async (data: AnnualLeavesSchema) => {
    try {
      const transformed: Partial<AnnualLeavesRows> = {
        ...data,
        startDate: data?.startDate ? new Date(data.startDate) : undefined,
        endDate: data?.endDate ? new Date(data.endDate) : undefined,
      };

      await onSubmit(transformed);
      onSuccess();
 
      if (data.startDate && data.endDate) {
        notifier.success(
          ` ${formatDate(data.startDate)} - ${formatDate(
            data.endDate
          )} tarihleri arasında izinli.`
        );
      } else {
        notifier.success("İzin başarıyla eklendi.");
      }
    } catch {
      notifier.error("Bir hata oluştu.");
    }
  };


  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Çalışan Ekle" : "Çalışan Bilgilerini Düzenle"}
        </h2>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <DatePicker
            label="Başlangıç Tarihi"
            value={watch("startDate")}
            onChange={(val) => setValue("startDate", val!)}
            error={errors.startDate?.message}
            required
          />

          <DatePicker
            label="Bitiş Tarihi"
            value={watch("endDate")}
            onChange={(val) => setValue("endDate", val!)}
            error={errors.endDate?.message}
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
              label="İptal Et"
              loading={isSubmitting}
              disabled={isSubmitting}
              variant= "secondary"
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

export default AnnualLeavesModal;
