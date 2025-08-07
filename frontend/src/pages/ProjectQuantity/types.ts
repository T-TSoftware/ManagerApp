import { ValidationFields } from '../../types/grid/commonTypes';

// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Base Quantity Row interface
export interface BaseQuantityRow {
  id?: string;
  code: string;
  category: string;
  unit: string;
  quantity: number;
  status: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
}

// Quantity row with tracking information
export interface QuantityRows extends BaseQuantityRow {
  isNew?: boolean;
  _originalData?: Omit<QuantityRows, '_originalData' | 'isNew'>;
}

// Type for new quantity payload (without tracking fields)
export type NewQuantityPayload = Omit<QuantityRows, 'id' | 'isNew' | '_originalData'>;

// Update için özel tip - sadece değişen alanları içerir
export type UpdateQuantityPayload = {
  code: string;
} & Partial<Omit<QuantityRows, 'id' | 'isNew' | '_originalData'>>;

// Type for row validation
export interface ValidationError {
  code: string;
  field: keyof BaseQuantityRow;
  message: string;
}

export interface ValidationRule {
  label: string;
  required?: boolean;
  mustBePositiveNumber?: boolean;
}

export const QUANTITY_VALIDATION_RULES: Record<
  keyof BaseQuantityRow,
  ValidationRule
> = {
  id:{label: "Id"},
  code: { label: "Kod" },
  status: { label: "Durum" },
  category: { label: "Kategori", required: true },
  unit: { label: "Birim", required: true },
  quantity: { label: "Miktar", required: true, mustBePositiveNumber: true },
  description: { label: "Açıklama", required: true },
  createdBy: { label: "Oluşturan" },
  updatedBy: { label: "Güncelleyen" },
  createdatetime: { label: "Oluşturulma Tarihi" },
  updatedatetime: { label: "Güncellenme Tarihi" },
};

export const validateQuantityRow = (row: QuantityRows): string[] => {
  const errors: string[] = [];

  Object.entries(QUANTITY_VALIDATION_RULES).forEach(([field, rule]) => {
    const value = row[field as keyof QuantityRows];

    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${rule.label} zorunludur`);
    }

    if (rule.mustBePositiveNumber && typeof value === "number" && value <= 0) {
      errors.push(`${rule.label} pozitif bir değer olmalıdır`);
    }
  });

  return errors;
};