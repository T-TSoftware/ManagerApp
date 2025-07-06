import { ValidationFields } from '../../types/grid/commonTypes';

// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Base Stock Row interface
export interface BaseStockRow {
  id?: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minimumQuantity: number;
  description: string;
  location: string;
  stockDate: Date;
  projectCode: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
}

// Stock row with tracking information
export interface StockRows {
  id?: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minimumQuantity: number;
  description: string;
  location: string;
  stockDate: Date;
  projectCode: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  isNew?: boolean;
  _originalData?: Omit<StockRows, '_originalData' | 'isNew'>;
}

// Type for new stock payload (without tracking fields)
export type NewStockPayload = Omit<StockRows, 'id' | 'isNew' | '_originalData'>;

// Update için özel tip - sadece değişen alanları içerir
export type UpdateStockPayload = {
  code: string;
} & Partial<Omit<StockRows, 'id' | 'isNew' | '_originalData'>>;

// Type for row validation
export interface ValidationError {
  code: string;
  field: keyof BaseStockRow;
  message: string;
}

export const STOCK_REQUIRED_FIELDS: ValidationFields<StockRows> = {
  name: 'İsim',
  category: 'Kategori',
  unit: 'Birim',
  quantity: 'Miktar',
  minimumQuantity: 'Minimum Miktar',
  description: 'Açıklama'
};

export const validateStockRow = (row: StockRows): string[] => {
  const errors: string[] = [];
  Object.entries(STOCK_REQUIRED_FIELDS).forEach(([field, label]) => {
    const value = row[field as keyof typeof STOCK_REQUIRED_FIELDS];
    if (value === undefined || value === null || value === '') {
      errors.push(`${label} zorunludur`);
    }
  });
  return errors;
};

export interface StockService {
  getAllStocks: (projectId: string, token: string) => Promise<StockRows[]>;
  addStock: (
    token: string,
    projectId: string,
    payload: NewStockPayload[]
  ) => Promise<void>;
  updateStock: (
    token: string,
    projectId: string,
    payload: UpdateStockPayload[]
  ) => Promise<void>;
  deleteStock: (
    token: string,
    projectId: string,
    codes: string[]
  ) => Promise<void>;
} 