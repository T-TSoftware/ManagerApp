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

export interface ValidationError {
  code: string;
  field: keyof BaseSubcontractorRow;
  message: string;
}

export interface ValidationRule {
  label: string;
  required?: boolean;
  mustBePositiveNumber?: boolean;
}

export const SUBCONTRACTOR_VALIDATION_RULES: Record<
  keyof BaseSubcontractorRow,
  ValidationRule
> = {
  id: { label: "Id" },
  code: { label: "Kod" },
  category: { label: "Kategori", required: true },
  unit: { label: "Birim", required: true },
  unitPrice: {
    label: "Birim Fiyatı",
    required: true,
    mustBePositiveNumber: true,
  },
  quantity: { label: "Miktar", required: true, mustBePositiveNumber: true },
  companyName: { label: "Şirket" },
  description: { label: "Açıklama", required: true },
  contractAmount: { label: "Sözleşme Tutarı" },
  paidAmount: { label: "Ödenen Tutar" },
  remainingAmount: { label: "Kalan Tutar" },
  status: { label: "Durum", required: true },
  createdBy: { label: "Oluşturan" },
  updatedBy: { label: "Güncelleyen" },
  createdatetime: { label: "Oluşturulma Tarihi" },
  updatedatetime: { label: "Güncellenme Tarihi" },
};

export const validateSubcontractorRow = (row: SubcontractorRows): string[] => {
  const errors: string[] = [];

  Object.entries(SUBCONTRACTOR_VALIDATION_RULES).forEach(([field, rule]) => {
    const value = row[field as keyof SubcontractorRows];

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