import { FinancialGridRow } from '../../types/grid/commonTypes';

// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Base Supply Row interface
export interface BaseSupplyRow {
  id?: string;
  code: string;
  category: string;
  quantityItemCode: string;
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

// Supply row with tracking information
export interface SupplyRows extends FinancialGridRow {
  id: string;
  code: string;
  category: string;
  quantityItemCode: string;
  companyName: string;
  unit: string;
  description: string;
  status: string;
  isNew?: boolean;
  _originalData?: Omit<SupplyRows, "_originalData" | "isNew">;
}

// Type for new supply payload (without id)
export type NewSupplyPayload = Omit<SupplyRows, 'id' | 'isNew' | '_originalData'>;

// Update için özel tip - sadece değişen alanları içerir
export type UpdateSupplyPayload = {
  code: string;
} & Partial<Omit<SupplyRows, 'id' | 'isNew' | '_originalData'>>;

// Type for row validation
export interface ValidationError {
  code: string;
  field: keyof BaseSupplyRow;
  message: string;
}

export interface ValidationRule {
  label: string;
  required?: boolean;
  mustBePositiveNumber?: boolean;
}

export const SUPPLY_VALIDATION_RULES: Record<keyof BaseSupplyRow, ValidationRule> = {
  id: { label: "Id" },
  code: { label: "Kod" },
  category: { label: "Kategori", required: true },
  unit: { label: "Birim", required: true },
  quantity: { label: "Miktar", required: true, mustBePositiveNumber: true },
  description: { label: "Açıklama", required: true },
  quantityItemCode: { label: "Metraj", required: true },
  companyName: { label: "Şirket" },
  unitPrice: { label: "Birim Fiyatı" },
  contractAmount: { label: "Sözleşme Tutarı" },
  paidAmount: { label: "Ödenen Tutar" },
  remainingAmount: { label: "Kalan Tutar" },
  status: { label: "Durum", required: true },
  createdBy: { label: "Oluşturan" },
  updatedBy: { label: "Güncelleyen" },
  createdatetime: { label: "Oluşturulma Tarihi" },
  updatedatetime: { label: "Güncellenme Tarihi" },
};


export const validateSupplyRow = (row: SupplyRows): string[] => {
  const errors: string[] = [];

  Object.entries(SUPPLY_VALIDATION_RULES).forEach(([field, rule]) => {
    const value = row[field as keyof SupplyRows];

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

export interface SupplyService {
  getAllSupplies: (projectId: string, token: string) => Promise<SupplyRows[]>;
  addSupply: (
    token: string,
    projectId: string,
    payload: NewSupplyPayload[]
  ) => Promise<void>;
  updateSupply: (
    token: string,
    projectId: string,
    payload: Omit<SupplyRows, "isNew" | "_rowState" | "_originalData">[]
  ) => Promise<void>;
  deleteSupply: (
    token: string,
    projectId: string,
    ids: string[]
  ) => Promise<void>;
} 