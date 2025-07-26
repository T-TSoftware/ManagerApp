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

const schema = z.object({
  firstname: z.string().min(1, "Ad zorunludur."),
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
  paidLeaveAmount: z.coerce.number(),
  unpaidLeaveAmount: z.coerce.number(),
  sickLeaveAmount: z.coerce.number(),
  roadLeaveAmount: z.coerce.number(),
  excuseLeaveAmount: z.coerce.number(),
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
      };
    }
    return {
      code: "",
      firstname: "",
      lastName: "",
      age: 0,
      startDate: new Date(),
      netSalary: 0,
      grossSalary: 0,
      position: "",
      department: "",
      paidLeaveAmount: 0,
      unpaidLeaveAmount: 0,
      sickLeaveAmount: 0,
      roadLeaveAmount: 0,
      excuseLeaveAmount: 0,
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: EmployeeFormSchema) => {
    try {
      await onSubmit({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      });
      onSuccess();
    } catch {
      alert("Bir hata oluştu.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-6 px-8 rounded-xl shadow-xl w-full max-w-6xl dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Çalışan Ekle" : "Çalışan Güncelle"}
        </h2>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-4"
        >
          <TextInput
            name="firstname"
            label="Ad"
            register={register}
            error={errors.firstname?.message}
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
          <NumberInput
            name="paidLeaveAmount"
            label="Ücretli İzin"
            register={register}
            error={errors.paidLeaveAmount?.message}
          />
          <NumberInput
            name="unpaidLeaveAmount"
            label="Ücretsiz İzin"
            register={register}
            error={errors.unpaidLeaveAmount?.message}
          />
          <NumberInput
            name="sickLeaveAmount"
            label="Hastalık İzni"
            register={register}
            error={errors.sickLeaveAmount?.message}
          />
          <NumberInput
            name="roadLeaveAmount"
            label="Yol İzni"
            register={register}
            error={errors.roadLeaveAmount?.message}
          />
          <NumberInput
            name="excuseLeaveAmount"
            label="Mazeret İzni"
            register={register}
            error={errors.excuseLeaveAmount?.message}
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
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default EmployeeModal;
