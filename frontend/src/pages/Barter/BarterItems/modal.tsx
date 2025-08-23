"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BarterItemRows } from "./types";
import ModalWrapper from "../../../components/layout/ModalWrapper";
import {
  TextInput,
  NumberInput,
  TextAreaInput,
  Dropdown,
} from "../../../components/inputs";
import { barterItemType } from "../../../constants/barter/barterItemType";
import { useNotifier } from "../../../hooks/useNotifier";
import { barterDirection } from "../../../constants/barter/barterDirection";
import { barterItemStatus } from "../../../constants/barter/barterItemStatus";
import Button from "../../../components/buttons/Button";
import {
  useStockOptions,
  useSubcontractorOptions,
  useSupplierOptions,
} from "../../../hooks/useReferenceOptions";
import { extractApiError } from "../../../utils/axios";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z
  .object({
    direction: z.string().min(1, "Girdi/Çıktı zorunludur."),
    status: optionalString,
    itemType: z.string().min(1, "Tür zorunludur."),
    description: z.string().min(1, "Açıklama zorunludur."),
    agreedValue: z.number().optional(),
    relatedStockCode: optionalString,
    relatedSubcontractorCode: optionalString,
    relatedSupplierCode: optionalString,
  })
  .superRefine((values, ctx) => {
    if (values.itemType === "CASH") {
      if (values.agreedValue === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["agreedValue"],
          message: "Parasal Karşılık  pozitif olmalı.",
        });
      }
    } else {
      if (values.status === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["status"],
          message: "Durum zorunludur.",
        });
      }
    }
  });

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<BarterItemRows>;
  projectId: string;
  onClose: () => void;
  onSubmit: (data: Partial<BarterItemRows>) => Promise<void>;
  onSuccess: () => void;
};

const BarterItemModal = ({
  open,
  mode,
  defaultValues,
  projectId,
  onClose,
  onSubmit,
  onSuccess,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const notify = useNotifier();
  const selectedItemType = watch("itemType");
  const {
    options: stockOptions,
    loading: stockLoading,
  } = useStockOptions(projectId);
  const {
    options: supplierOptions,
    loading: supplierLoading
  } = useSupplierOptions(projectId);
  const {
    options: subcontractorOptions,
    loading: subcontractorLoading
  } = useSubcontractorOptions(projectId);

  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
        relatedStockCode: defaultValues.relatedStock?.code,
        relatedSubcontractorCode: defaultValues.relatedStock?.code,
        relatedSupplierCode: defaultValues.relatedStock?.code,
      };
    }

    return {
      status: "PENDING",
      direction: "",
      itemtype: "",
      assetDetails: "",
      agreedValue: 0,
      relatedStockCode: "",
      description: "",
      relatedSubcontractorCode: "",
      relatedSupplierCode: "",
    };
  }, [defaultValues, mode]);
console.log(projectId);
  useEffect(() => {
    if (open) {
      reset(memoizedDefaultValues);
    }
  }, [open, reset, memoizedDefaultValues]);

  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<BarterItemRows> = {
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
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-4xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Barter Item Ekle" : "Barter Item Düzenle"}
        </h2>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-3 gap-3 p-5"
        >
          <TextInput
            label="Kod"
            name="code"
            hidden={mode === "create" ? true : false}
            register={register}
            editable={false}
          />
          <Dropdown
            name="status"
            label="Durum"
            options={barterItemStatus}
            register={register}
            error={errors.status?.message}
            editable={selectedItemType != "CASH" && mode != "create"}
            required={selectedItemType != "CASH"}
          />

          <Dropdown
            name="direction"
            label="Girdi/Çıktı"
            options={barterDirection}
            register={register}
            error={errors.direction?.message}
            required
          />

          <Dropdown
            name="itemType"
            label="Tür"
            options={barterItemType}
            register={register}
            error={errors.itemType?.message}
            required
          />

          <Dropdown
            name="relatedStockCode"
            label="İlişkili Stok"
            options={stockOptions}
            register={register}
            editable={selectedItemType == "STOCK"}
          />

          <Dropdown
            name="relatedSubcontractorCode"
            label="İlişkili Taşeron İşi"
            options={subcontractorOptions}
            register={register}
          />

          <Dropdown
            name="relatedSupplierCode"
            label="İlişkili Tedarik"
            options={supplierOptions}
            register={register}
          />

          <NumberInput
            label="Parasal Karşılık"
            name="agreedValue"
            register={register}
            error={errors.agreedValue?.message}
            //editable={selectedItemType === "CASH"}
            //required={selectedItemType === "CASH"}
            required
          />

          <TextAreaInput
            name="description"
            label="Açıklama"
            register={register}
            classes="col-span-4"
            error={errors.description?.message}
            required
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
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default BarterItemModal;
