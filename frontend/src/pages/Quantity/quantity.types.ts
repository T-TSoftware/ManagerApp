import { ValidationFields } from '../../types/grid/commonTypes';

// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Base Quantity Row interface
export interface BaseQuantityRow {
  id?: string;
  code: string;
  category: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  contractAmount: number;
  paidAmount: number;
  remainingAmount: number;
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

export const QUANTITY_REQUIRED_FIELDS: ValidationFields<QuantityRows> = {
  code: 'Kod',
  category: 'Kategori',
  unit: 'Birim',
  quantity: 'Metraj',
  contractAmount: 'Sözleşme Tutarı'
};

export const validateQuantityRow = (row: QuantityRows): string[] => {
  const errors: string[] = [];
  Object.entries(QUANTITY_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof QuantityRows];
    if (value === undefined || value === null || value === '') {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
};
