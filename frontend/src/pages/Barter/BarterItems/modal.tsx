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
import { direction } from "../../../constants/direction";
import { barterItemType } from "../../../constants/barterItemType";
import { useNotifier } from "../../../hooks/useNotifier";
import { checkStatus } from "../../../constants/checkStatus";

const optionalString = z.string().optional().or(z.literal(""));

const schema = z.object({
  direction: z.string().min(1, "Girdi/Çıktı zorunludur."),
  status: optionalString,
  itemType: z.string().min(1, "Tür zorunludur."),
  description: z.string().min(1, "Açıklama zorunludur."),
  agreedValue: z.coerce.number().positive("Pozitif değer girin."),
  remainingAmount: z.coerce.number().positive("Pozitif değer girin."),
  processedAmount: z.coerce.number().positive("Pozitif değer girin."),
  relatedStock: z.string().optional(),
  relatedSubcontractor: z.string().optional(),
  relatedSupplier: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

type Props = {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<BarterItemRows>;
  onClose: () => void;
  onSubmit: (data: Partial<BarterItemRows>) => Promise<void>;
  onSuccess: () => void;
};

const BarterItemModal = ({
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
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });
  const selectedItemType = watch("itemType");
  const memoizedDefaultValues = useMemo(() => {
    if (mode === "edit" && defaultValues) {
      return {
        ...defaultValues,
      };
    }

    return {
      direction: "",
      itemtype: "",
      assetDetails: "",
      agreedValue: 0,
      relatedStock: "",
      description: "",
      relatedSubcontractor: "",
      relatedSupplier: "",
    };
  }, [defaultValues, mode]);

  useEffect(() => {
    reset(memoizedDefaultValues);
  }, [reset, memoizedDefaultValues]);
  const notify = useNotifier();
  const onFormSubmit = async (data: FormSchema) => {
    try {
      const transformed: Partial<BarterItemRows> = {
        ...data,
      };

      await onSubmit(transformed);
      onSuccess();
    } catch {
      notify.error("Bir hata oluştu.");
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {mode === "create" ? "Barter Item Ekle" : "Barter Item Düzenle"}
        </h2>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-4 gap-4 p-5"
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
            options={checkStatus}
            register={register}
            error={errors.status?.message}
            editable={selectedItemType != "CASH"}
            required
          />
          <Dropdown
            name="direction"
            label="Girdi/Çıktı"
            options={direction}
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

          <TextInput
            label="İlişkili Stok"
            name="relatedStock"
            register={register}
            editable={selectedItemType == "STOCK"}
          />

          <TextInput
            label="İlişkili Taşeron İşi"
            name="relatedSubcontractor"
            register={register}
          />
          <TextInput
            label="İlişkili Tedarik"
            name="relatedSupplier"
            register={register}
          />

          <NumberInput
            label="Parasal Karşılık"
            name="agreedValue"
            register={register}
            error={errors.agreedValue?.message}
            editable={selectedItemType === "CASH"}
          />

          <NumberInput
            label="İşlenen Ödeme"
            name="processedAmount"
            register={register}
            error={errors.processedAmount?.message}
            editable={selectedItemType === "CASH"}
          />
          <NumberInput
            label="Kalan Ödeme"
            name="remainingAmount"
            register={register}
            error={errors.remainingAmount?.message}
          />

          <TextAreaInput
            name="description"
            label="Açıklama"
            register={register}
            classes="col-span-4"
          />
          <div className="col-span-4 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border-light_primary bg-light_primary text-gray-500  hover:shadow-sm dark:bg-secondary dark:hover:shadow-tertiary dark:text-white dark:border-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-white bg-light_fourth hover:shadow-sm hover:shadow-light_fourth  dark:bg-fourth transition"
            >
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default BarterItemModal;
