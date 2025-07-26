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
export const BALANCE_REQUIRED_FIELDS: ValidationFields<BalanceRows> = {
  name: "İsim",
  amount: "Miktar",
  currency: "Para Birimi",
};

export const validateBalanceRow = (row: BalanceRows): string[] => {
  const errors: string[] = [];
  Object.entries(BALANCE_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof BalanceRows];
    if (value === undefined || value === null || value === "") {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
};
