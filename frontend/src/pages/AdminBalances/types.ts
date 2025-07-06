// Row state types
export type RowState = "unchanged" | "new" | "modified" | "deleted";

// Base Balance Row interface
export interface BaseBalanceRow {
  id?: string;
  code: string;
  name: string;
  amount: number;
  currency: string;
}

// Balance row with tracking information
export interface BalanceRows extends BaseBalanceRow {
  id: string;
  isNew?: boolean;
  _originalData?: Omit<BalanceRows, "_originalData" | "isNew">;
}

// Type for validation
export interface ValidationError {
  id: string;
  field: keyof BaseBalanceRow;
  message: string;
}

export const BALANCE_REQUIRED_FIELDS: Record<
  keyof Pick<BaseBalanceRow, "name" | "amount" | "currency">,
  string
> = {
  name: "Ad",
  amount: "Miktar",
  currency: "Döviz Birimi",
};

export const validateBalanceRow = (row: BalanceRows): string[] => {
  const errors: string[] = [];
  Object.entries(BALANCE_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof typeof BALANCE_REQUIRED_FIELDS];
    if (value === undefined || value === null || value === "") {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
};
