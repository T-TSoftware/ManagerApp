"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckFinanceRows } from "./types";
import { checkStatus } from "../../constants/check/checkStatus";
import ModalWrapper from "../../components/layout/ModalWrapper";
import { checkTypes } from "../../constants/check/checkTypes";
import {
  TextInput,
  Dropdown,
  NumberInput,
  TextAreaInput,
  DatePicker,
  AutoComplete,
} from "../../components/inputs";
import { useNotifier } from "../../hooks/useNotifier";
import Button from "../../components/buttons/Button";
import { useProjects } from "../../hooks/useProjects";
import { AutocompleteOptionById } from "../../types/grid/commonTypes";
import { extractApiError } from "../../utils/axios";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  checkDate: z.date({
    required_error: "Çek tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  bankId: z.string().min(1, "Banka zorunludur"),
  firm: z.string().min(1, "Firma zorunludur"),
  amount: z.coerce.number().positive("Tutar pozitif olmalı"),
  checkNo: z.string().min(1, "Çek No zorunludur"),
  projectId: optionalString,
  status: optionalString,
  type: z.string().min(1, "Tür zorunludur"),
  description: optionalString,
  dueDate: z.date({
    required_error: "Son Ödeme tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<CheckFinanceRows>;
  options: AutocompleteOptionById[];
  onClose: () => void;
  onSubmit: (data: Partial<CheckFinanceRows>) => Promise<void>;
  onSuccess: () => void;
};

const CheckFinanceModal = ({
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
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const notify = useNotifier();
  const { projectOptionsById, loading } = useProjects();

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        checkDate: defaultValues?.checkDate
          ? new Date(defaultValues.checkDate)
          : undefined,
        dueDate: defaultValues?.dueDate
          ? new Date(defaultValues.dueDate)
          : undefined,
        projectId: defaultValues?.project?.id,
        bankId: defaultValues?.bank?.id,
      };
    }

    return {
      checkDate: new Date(),
      bankId: "",
      code: "",
      dueDate: new Date(),
      firm: "",
      amount: 0,
      checkNo: "",
      status: "PENDING",
      type: "",
      description: "",
      projectId: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<CheckFinanceRows> = {
        ...data,
        amount: Number(data.amount),
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        checkDate: data.checkDate ? new Date(data.checkDate) : undefined,
        code: defaultValues?.code,
      };

      await onSubmit(transformed);
      onSuccess();
    } catch (error){
      const { errorMessage } = extractApiError(error);
      notify.error(errorMessage);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Çek Ekle" : "Çek Bilgilerini Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <TextInput
            name="checkNo"
            label="Çek No"
            register={register}
            editable={mode === "create" ? true : false}
            error={errors.checkNo?.message}
            required
          />

          <DatePicker
            label="Çek Tarihi"
            value={watch("checkDate")}
            onChange={(val) => setValue("checkDate", val!)}
            error={errors.checkDate?.message}
            required
          />

          <DatePicker
            label="Son Ödeme Tarihi"
            value={watch("dueDate")}
            onChange={(val) => setValue("dueDate", val!)}
            error={errors.checkDate?.message}
            required
          />

          <Dropdown
            name="status"
            label="Durum"
            options={checkStatus}
            hidden={mode === "create" ? true : false}
            register={register}
            editable={false}
          />

          <TextInput
            name="firm"
            label="Firma"
            register={register}
            error={errors.firm?.message}
            required
          />

          <AutoComplete
            options={options}
            label="Banka"
            value={watch("bankId")!}
            onChange={(val) => setValue("bankId", val)}
            placeholder="Banka"
            error={errors.bankId?.message}
            valueKey="id"
            required
          />

          <Dropdown
            name="type"
            label="Tür"
            options={checkTypes}
            register={register}
            error={errors.type?.message}
            required
          />

          <NumberInput
            name="amount"
            label="Tutar"
            register={register}
            error={errors.amount?.message}
            required
          />

          <Dropdown
            name="projectId"
            label="Proje"
            options={[{ code: "", name: "Seçiniz" }, ...projectOptionsById]}
            register={register}
          />

          <TextAreaInput
            classes="col-span-3"
            name="description"
            label="Açıklama"
            register={register}
          />

          <div className="col-span-3 pt-6 flex justify-end gap-3">
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
};

export default CheckFinanceModal;
