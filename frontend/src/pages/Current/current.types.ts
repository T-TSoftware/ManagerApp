import { ValidationFields } from '../../types/grid/commonTypes';

// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Base Current Row interface
export interface BaseCurrentRow {
  id: string;
  balanceCode: string;
  type: string;
  amount: string;
  currency: string;
  description: string;
  transactionDate: Date;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
}

// Current row with tracking information
export interface CurrentRows extends BaseCurrentRow {
  isNew?: boolean;
  _originalData?: Omit<CurrentRows, '_originalData' | 'isNew'>;
}

export const CURRENT_REQUIRED_FIELDS: ValidationFields<CurrentRows> = {
  type: 'Cari Tipi',
  balanceCode: 'Hesap Kodu',
  amount: 'Tutar',
  currency: 'Döviz Tipi',
  description: 'Açıklama',
  transactionDate: 'İşlem Tarihi'
};

export const validateCurrentRow = (row: CurrentRows): string[] => {
  const errors: string[] = [];
  Object.entries(CURRENT_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof CurrentRows];
    if (value === undefined || value === null || value === '') {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
};
