"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectRows } from "./types";
import ModalWrapper from "../../components/layout/ModalWrapper";
import { useNotifier } from "../../hooks/useNotifier";
import TextInput from "../../components/inputs/TextInput";
import Dropdown from "../../components/inputs/Dropdown";
import { projectStatus } from "../../constants/project/projectStatus";
import DatePicker from "../../components/inputs/DatePicker";
import Button from "../../components/buttons/Button";
import { extractApiError } from "../../utils/axios";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  name: z.string().min(1, "Proje adı zorunludur"),
  site: z.string().min(1, "Şantiye zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  estimatedStartDate: z.date().optional(),
  actualStartDate: z.date().optional(),
  estimatedEndDate: z.date().optional(),
  actualEndDate: z.date().optional(),
});

type ProjectFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<ProjectRows>;
  onClose: () => void;
  onSubmit: (data: Partial<ProjectRows>) => Promise<void>;
  onSuccess: () => void;
};

const ProjectModal = ({
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
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        estimatedStartDate: defaultValues?.estimatedStartDate
          ? new Date(defaultValues.estimatedStartDate)
          : undefined,
        actualStartDate: defaultValues?.actualStartDate
          ? new Date(defaultValues.actualStartDate)
          : undefined,
        estimatedEndDate: defaultValues?.estimatedEndDate
          ? new Date(defaultValues.estimatedEndDate)
          : undefined,
        actualEndDate: defaultValues?.actualEndDate
          ? new Date(defaultValues.actualEndDate)
          : undefined,
      };
    }

    return {
      name: "",
      site: "",
      status: "",
      estimatedStartDate: new Date(),
      actualStartDate: new Date(),
      estimatedEndDate: new Date(),
      actualEndDate: new Date(),
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const notify = useNotifier();

  const onFormSubmit = async (data: ProjectFormSchema) => {
    try {
      const transformed: Partial<ProjectRows> = {
        ...data,
        estimatedStartDate: data.estimatedStartDate
          ? new Date(data.estimatedStartDate)
          : undefined,
        actualStartDate: data.actualStartDate
          ? new Date(data.actualStartDate)
          : undefined,
        estimatedEndDate: data.estimatedEndDate
          ? new Date(data.estimatedEndDate)
          : undefined,
        actualEndDate: data.actualEndDate
          ? new Date(data.actualEndDate)
          : undefined,
      };

      await onSubmit(transformed);
      onSuccess();
    } catch (error) {
      console.log(error)
      const { errorMessage } = extractApiError(error);
      notify.error(errorMessage);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Proje Ekle" : "Proje Düzenle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <Dropdown
            name="status"
            label="Durum"
            options={projectStatus}
            register={register}
            error={errors.status?.message}
            required
          />

          <TextInput
            name="name"
            label="Proje Adı"
            register={register}
            error={errors.name?.message}
            required
          />

          <TextInput
            name="site"
            label="Şantiye"
            register={register}
            error={errors.site?.message}
            required
          />

          <DatePicker
            label="Tahmini Başlangıç"
            value={watch("estimatedStartDate")}
            onChange={(val) => setValue("estimatedStartDate", val!)}
          />

          <DatePicker
            label="Gerçek Başlangıç"
            value={watch("actualStartDate")}
            onChange={(val) => setValue("actualStartDate", val!)}
          />

          <DatePicker
            label="Tahmini Bitiş"
            value={watch("estimatedEndDate")}
            onChange={(val) => setValue("estimatedEndDate", val!)}
          />

          <DatePicker
            label="Gerçek Bitiş"
            value={watch("actualEndDate")}
            onChange={(val) => setValue("actualEndDate", val!)}
          />

          <div className="col-span-3 pt-6 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              label="İptal Et"
              variant="secondary"
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

export default ProjectModal;
