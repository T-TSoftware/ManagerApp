import { FinancialGridRow, ValidationFields } from '../../types/grid/commonTypes';

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
  _originalData?: Omit<SupplyRows, '_originalData' | 'isNew'>;
}

// Type for new supply payload (without id)
export type NewSupplyPayload = Omit<SupplyRows, 'id' | 'isNew' | '_originalData'>;

// Update için özel tip - sadece değişen alanları içerir
export type UpdateSupplyPayload = {
  code: string;
} & Partial<Omit<SupplyRows, 'id' | 'isNew' | '_originalData'>>;

// Type for row validation
export interface ValidationError {
  id: string;
  field: keyof BaseSupplyRow;
  message: string;
}

export const SUPPLY_REQUIRED_FIELDS: ValidationFields<SupplyRows> = {
  category: 'Kategori',
  quantityItemCode: 'Metraj Kodu',
  companyName: 'Şirket',
  unit: 'Birim',
  description: 'Açıklama'
};

export const validateSupplyRow = (row: SupplyRows): string[] => {
  const errors: string[] = [];
  Object.entries(SUPPLY_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof typeof SUPPLY_REQUIRED_FIELDS];
    if (value === undefined || value === null || value === '') {
      errors.push(`${label} zorunludur`);
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