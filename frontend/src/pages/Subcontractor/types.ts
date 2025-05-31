import { FinancialGridRow, ValidationFields } from '../../types/grid/commonTypes';

export interface SubcontractorRows extends FinancialGridRow {
  category: string;
  companyName: string;
  unit: string;
  status: string;
  description: string;
  contactPerson: string;
  phone: string;
  email: string;
  _originalData?: Omit<SubcontractorRows, '_originalData' | 'isNew'>;
}

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
    if (!row[field as keyof SubcontractorRows] && row[field as keyof SubcontractorRows] !== 0) {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
}; 