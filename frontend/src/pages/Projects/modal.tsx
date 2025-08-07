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
import { projectStatus } from "../../constants/projectStatus";
import DatePicker from "../../components/inputs/DatePicker";
import Button from "../../components/buttons/Button";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  name: z.string().min(1, "Proje adı zorunludur"),
  site: z.string().min(1, "Şantiye zorunludur"),
  status: z.string().min(1, "Durum zorunludur"),
  estimatedStartDate: z.date({
    required_error: "Beklenen Başlama Tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  actualStartDate: z.date({
    required_error: "Gerçek Başlama Tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  estimatedEndDate: z.date({
    required_error: "Beklenen Bitiş Tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  actualEndDate: z.date({
    required_error: "Gerçek Bitiş Tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
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
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

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
    } catch (err) {
      notify.error("Bir hata oluştu.");
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

          <Dropdown
            name="status"
            label="Durum"
            options={projectStatus}
            register={register}
            error={errors.status?.message}
            required
          />

          <DatePicker
            label="Tahmini Başlangıç"
            value={watch("estimatedStartDate")}
            onChange={(val) => setValue("estimatedStartDate", val!)}
            error={errors.estimatedStartDate?.message}
            required
          />

          <DatePicker
            label="Gerçek Başlangıç"
            value={watch("actualStartDate")}
            onChange={(val) => setValue("actualStartDate", val!)}
            error={errors.actualStartDate?.message}
            required
          />

          <DatePicker
            label="Tahmini Bitiş"
            value={watch("estimatedEndDate")}
            onChange={(val) => setValue("estimatedEndDate", val!)}
            error={errors.estimatedEndDate?.message}
            required
          />

          <DatePicker
            label="Gerçek Bitiş"
            value={watch("actualEndDate")}
            onChange={(val) => setValue("actualEndDate", val!)}
            error={errors.actualEndDate?.message}
            required
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
