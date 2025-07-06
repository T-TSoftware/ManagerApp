import { ValidationFields } from '../../types/grid/commonTypes';

// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Base Subcontractor Row interface
export interface BaseSubcontractorRow {
  id?: string;
  code: string;
  category: string;
  companyName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  contractAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  description: string;
  contactPerson: string;
  phone: string;
  email: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
}

// Subcontractor row with tracking information
export interface SubcontractorRows extends BaseSubcontractorRow {
  isNew?: boolean;
  _originalData?: Omit<SubcontractorRows, '_originalData' | 'isNew'>;
}

// Type for new subcontractor payload (without tracking fields)
export type NewSubcontractorPayload = Omit<SubcontractorRows, 'id' | 'isNew' | '_originalData'>;

// Update için özel tip - sadece değişen alanları içerir
export type UpdateSubcontractorPayload = {
  code: string;
} & Partial<Omit<SubcontractorRows, 'id' | 'isNew' | '_originalData'>>;

export const SUBCONTRACTOR_REQUIRED_FIELDS: ValidationFields<SubcontractorRows> = {
  code: 'Kod',
  companyName: 'Şirket',
  unit: 'Birim',
  contractAmount: 'Sözleşme Tutarı',
  contactPerson: 'İletişim Kişisi',
  phone: 'Telefon',
  email: 'E-posta'
};

export const validateSubcontractorRow = (row: SubcontractorRows): string[] => {
  const errors: string[] = [];
  Object.entries(SUBCONTRACTOR_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof SubcontractorRows];
    if (value === undefined || value === null || value === '') {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
};
