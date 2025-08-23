"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "../../components/layout/ModalWrapper";
import type { BarterRows } from "./types";
import {
  TextInput,
  NumberInput,
  TextAreaInput,
  DatePicker,
  Dropdown,
} from "../../components/inputs";
import { counterPartyType } from "../../constants/barter/counterPartyType";
import { useNotifier } from "../../hooks/useNotifier";
import Button from "../../components/buttons/Button";
import { useProjects } from "../../hooks/useProjects";
import { barterStatus } from "../../constants/barter/barterStatus";
import { extractApiError } from "../../utils/axios";

const optionalString = z.string().optional().or(z.literal(""));
const schema = z.object({
  code: optionalString,
  counterpartyType: z.string().min(1, "Karşı Taraf Tipi zorunludur."),
  counterpartyName: z.string().min(1, "Karşı Taraf Adı zorunludur."),
  agreementDate: z.date({
    required_error: "Anlaşma tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  status: z.string().min(1, "Durum zorunludur."),
  description: optionalString,
  projectId: z.string().min(1, "Proje zorunludur."),
  totalOurValue: z.coerce.number().positive("Gider Değeri pozitif olmalı."),
  totalTheirValue: z.coerce.number().positive("Gelir Değeri pozitif olmalı."),
});

type BarterFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<BarterRows>;
  onClose: () => void;
  onSubmit: (data: Partial<BarterRows>) => Promise<void>;
  onSuccess: () => void;
};

const BarterAgreementModal = ({
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
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BarterFormSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        agreementDate: defaultValues?.agreementDate
          ? new Date(defaultValues.agreementDate)
          : undefined,
        projectId: defaultValues.project?.id,
      };
    }

    return {
      code: "",
      counterpartyType: "",
      counterpartyId: "",
      counterpartyName: "",
      agreementDate: new Date(),
      status: "",
      description: "",
      totalOurValue: 0,
      totalTheirValue: 0,
      projectId: "",
    };
  }, [defaultValues, mode]);

  const notify = useNotifier();

  const { projectOptionsById } = useProjects();

  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues, { keepDirty: false }); 
    }
  }, [open, reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: BarterFormSchema) => {
    try {
      if (mode === "edit" && !isDirty) {
        notify.error("Kaydedilecek değişiklik yok.");
        return;
      }
      const transformed: Partial<BarterRows> = {
        ...data,
        agreementDate: data.agreementDate
          ? new Date(data.agreementDate)
          : undefined,
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
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Anlaşma Ekle" : "Anlaşma Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-4 gap-4"
        >
          <TextInput
            name="code"
            label="Kod"
            register={register}
            editable={false}
            hidden={mode === "create" ? true : false}
          />

          <DatePicker
            label="Anlaşma Tarihi"
            value={watch("agreementDate")}
            onChange={(val) => setValue("agreementDate", val!)}
            error={errors.agreementDate?.message}
            required
          />

          <Dropdown
            name="status"
            label="Durum"
            options={barterStatus}
            register={register}
            error={errors.status?.message}
            required
          />

          <Dropdown
            name="projectId"
            label="Proje"
            options={[{ code: "", name: "Seçiniz" }, ...projectOptionsById]}
            register={register}
            error={errors.projectId?.message}
            required
          />

          <Dropdown
            name="counterpartyType"
            label="Karşı Taraf Tipi"
            options={counterPartyType}
            register={register}
            error={errors.counterpartyType?.message}
            required
          />

          <TextInput
            name="counterpartyName"
            label="Karşı Taraf Adı"
            register={register}
            error={errors.counterpartyName?.message}
            required
          />

          <NumberInput
            name="totalOurValue"
            label="Gider Değeri"
            register={register}
            error={errors.totalOurValue?.message}
            required
          />

          <NumberInput
            name="totalTheirValue"
            label="Gelir Değeri"
            register={register}
            error={errors.totalTheirValue?.message}
            required
          />

          <TextAreaInput
            classes="col-span-4"
            name="description"
            label="Açıklama"
            register={register}
          />
          <div className="col-span-4 pt-6 flex justify-end gap-3">
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
              disabled={isSubmitting || (mode === "edit" && !isDirty)}
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default BarterAgreementModal;
