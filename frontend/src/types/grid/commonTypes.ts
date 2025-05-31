export interface BaseGridRow {
  id?: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  isNew?: boolean;
  _originalData?: unknown;
}

export interface FinancialGridRow extends BaseGridRow {
  unitPrice: number;
  quantity: number;
  contractAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export interface ValidationFields<T> {
  [key: string]: string;
}

export const isRowModified = <T extends BaseGridRow>(row: T): boolean => {
  if (!row._originalData) return false;
  const original = row._originalData as T;
  return JSON.stringify(original) !== JSON.stringify({ ...row, _originalData: undefined, isNew: undefined });
}; 