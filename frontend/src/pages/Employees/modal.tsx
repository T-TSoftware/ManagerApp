"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "../../components/layout/ModalWrapper";
import {
  TextInput,
  NumberInput,
  DatePicker,
} from "../../components/inputs";
import { EmployeesRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import Button from "../../components/buttons/Button";


const schema = z.object({
  firstName: z.string().min(1, "Ad zorunludur."),
  lastName: z.string().min(1, "Soyad zorunludur."),
  age: z.coerce.number().int().positive("Yaş pozitif olmalı."),
  startDate: z.date({
    required_error: "Başlangıç tarihi zorunludur.",
    invalid_type_error: "Geçerli bir tarih girin.",
  }),
  position: z.string().min(1, "Pozisyon zorunludur."),
  department: z.string().min(1, "Departman zorunludur."),
  netSalary: z.coerce.number().positive("Net maaş pozitif olmalı."),
  grossSalary: z.coerce.number().positive("Brüt maaş pozitif olmalı."),
});

type EmployeeFormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<EmployeesRows>;
  onClose: () => void;
  onSubmit: (data: Partial<EmployeesRows>) => Promise<void>;
  onSuccess: () => void;
};

const EmployeeModal = ({
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
  } = useForm<EmployeeFormSchema>({
    resolver: zodResolver(schema),
  });

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        startDate: defaultValues.startDate
          ? new Date(defaultValues.startDate)
          : undefined,
        employeeId: defaultValues.employee?.id,
      };
    }
    return {
      code: "",
      firstName: "",
      lastName: "",
      age: 0,
      startDate: new Date(),
      netSalary: 0,
      grossSalary: 0,
      position: "",
      department: "",
      employeeId:""
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const notify = useNotifier();

  const onFormSubmit = async (data: EmployeeFormSchema) => {
    try {
      await onSubmit({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      });
      onSuccess();
    } catch {
      notify.error("Bir sorun oluştu.");
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
          className="grid grid-cols-3 gap-4"
        >
          <TextInput
            name="firstName"
            label="Ad"
            register={register}
            error={errors.firstName?.message}
          />
          <TextInput
            name="lastName"
            label="Soyad"
            register={register}
            error={errors.lastName?.message}
          />
          <NumberInput
            name="age"
            label="Yaş"
            register={register}
            error={errors.age?.message}
          />
          <DatePicker
            label="Başlangıç Tarihi"
            value={watch("startDate")}
            onChange={(val) => setValue("startDate", val!)}
            error={errors.startDate?.message}
            required
          />
          <TextInput
            name="position"
            label="Pozisyon"
            register={register}
            error={errors.position?.message}
          />
          <TextInput
            name="department"
            label="Departman"
            register={register}
            error={errors.department?.message}
          />
          <NumberInput
            name="netSalary"
            label="Net Maaş"
            register={register}
            error={errors.netSalary?.message}
          />
          <NumberInput
            name="grossSalary"
            label="Brüt Maaş"
            register={register}
            error={errors.grossSalary?.message}
          />

          <div className="col-span-3 pt-6 flex justify-end gap-3">
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

export default EmployeeModal;
