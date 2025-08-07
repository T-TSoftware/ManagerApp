import { ValidationFields } from "../../types/grid/commonTypes";
// Row state types
export type RowState = "unchanged" | "new" | "modified" | "deleted";

// Base Balance Row interface
export interface BaseBalanceRow {
  id?: string;
  code: string;
  name: string;
  amount: number;
  currency: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
}

// Balance row with tracking information
export interface BalanceRows {
  id?: string;
  code: string;
  name: string;
  amount: number;
  currency: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  isNew?: boolean;
  _originalData?: Omit<BalanceRows, "_originalData" | "isNew">;
}

// Type for new balance payload (without tracking fields)
export type NewBalancePayload = Omit<
  BalanceRows,
  "id" |  "isNew" | "_originalData"
>;

// Update için özel tip - sadece değişen alanları içerir
export type UpdateBalancePayload = {
  code: string;
} & Partial<Omit<BalanceRows, "id" | "isNew" | "_originalData">>;

// Type for row validation
export interface ValidationError {
  code: string;
  field: keyof BaseBalanceRow;
  message: string;
}

export interface ValidationRule {
  label: string;
  required?: boolean;
  mustBePositiveNumber?: boolean;
} 

export const BALANCE_VALIDATION_RULES: Record<keyof BaseBalanceRow, ValidationRule> = {
  id: { label: "Id" },
  code: { label: "Kod" },
  name: { label: "İsim", required: true },
  amount: { label: "Miktar", required: true, mustBePositiveNumber: true },
  currency: { label: "Döviz Birimi", required: true },
  createdBy: { label: "Oluşturan" },
  updatedBy: { label: "Güncelleyen" },
  createdatetime: { label: "Oluşturulma Tarihi" },
  updatedatetime: { label: "Güncellenme Tarihi" },
};


export const validateBalanceRow = (row: BalanceRows): string[] => {
  const errors: string[] = [];

  Object.entries(BALANCE_VALIDATION_RULES).forEach(([field, rule]) => {
    const value = row[field as keyof BalanceRows];

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
