// Row state types
export type RowState = 'unchanged' | 'new' | 'modified' | 'deleted';

// Common alias for ISO date strings (or null if cleared)
export type ISODateString = string | Date | null;
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
  stockDate: ISODateString;
  projectCode: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: ISODateString;
  updatedatetime: ISODateString;
}

// Stock row with tracking information
export interface StockRows extends BaseStockRow {
  isNew?: boolean;
  _originalData?: Omit<StockRows, "_originalData" | "isNew">;
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

export interface ValidationRule {
  label: string;
  required?: boolean;
  mustBePositiveNumber?: boolean;
}

export const STOCK_VALIDATION_RULES: Record<
  keyof BaseStockRow,
  ValidationRule
> = {
  id:{label: "Id"},
  code: { label: "Kod" },
  name: { label: "İsim", required: true },
  category: { label: "Kategori", required: true },
  unit: { label: "Birim", required: true },
  quantity: { label: "Miktar", required: true, mustBePositiveNumber: true },
  minimumQuantity: {label: "Minimum Miktar",},
  description: { label: "Açıklama", required: true },
  location: { label: "Konum" },
  projectCode: {label: "Proje"},
  stockDate: { label: "Stok Tarihi" },
  createdBy: { label: "Oluşturan" },
  updatedBy: { label: "Güncelleyen" },
  createdatetime: { label: "Oluşturulma Tarihi" },
  updatedatetime: { label: "Güncellenme Tarihi" },
};

export const validateStockRow = (row: StockRows): string[] => {
  const errors: string[] = [];

  Object.entries(STOCK_VALIDATION_RULES).forEach(([field, rule]) => {
    const value = row[field as keyof StockRows];

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