import { ValidationFields } from "../../../types/grid/commonTypes";

// Row state types
export type RowState = "unchanged" | "new" | "modified" | "deleted";

export interface BaseLoanPaymentRows {
  id?: string;
  code: string;
  installmentNumber: number;
  dueDate: Date;
  totalAmount: number;
  interestAmount: number;
  principalAmount: number;
  paymentAmount: number;
  description: string;
  remainingAmount:number;
  status:string;
  paymentDate:Date;
  penaltyAmount:number;
  createdBy:string;
  updatedBy:string;
  createdatetime:Date;
  updatedatetime:Date;
  loan:{
    id:string;
    code:string;
    name:string;
    project: {
             id:string;
    code:string;
    name:string;          
  };
}
  bank:{
    id:string;
    code:string;
    name:string;
  };

}

// Loan row with tracking information
export interface LoanPaymentRows {
  id?: string;
  code: string;
  installmentNumber: number;
  dueDate: Date;
  totalAmount: number;
  interestAmount: number;
  principalAmount: number;
  paymentAmount: number;
  description: string;
  remainingAmount: number;
  status: string;
  paymentDate: Date;
  penaltyAmount: number;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  loan: {
    id: string;
    code: string;
    name: string;
    project: {
      id: string;
      code: string;
      name: string;
    };
  };
  bank: {
    id: string;
    code: string;
    name: string;
  };
  isNew?: boolean;
  _originalData?: Omit<LoanPaymentRows, "_originalData" | "isNew">;
}

// Type for new loan payload (without tracking fields)
export type NewLoanPaymentPayload = Omit<LoanPaymentRows, "id" | "isNew" | "_originalData">;

export type UpdateLoanPaymentPayload = {
  code: string;
} & Partial<Omit<LoanPaymentRows, "id" | "isNew" | "_originalData">>;

// Type for row validation
export interface ValidationError {
  code: string;
  field: keyof BaseLoanPaymentRows;
  message: string;
}

export interface ValidationRule {
  label: string;
  required?: boolean;
  mustBePositiveNumber?: boolean;
}

export const LOANPAYMENT_VALIDATION_RULES: Record<
  keyof BaseLoanPaymentRows,
  ValidationRule
> = {
  id: { label: "Kod" },
  loan: { label: "Kredi" },
  bank: { label: "Banka" },
  code: { label: "Kod" },
  installmentNumber: { label: "Taksit" },
  dueDate: { label: "Son Ödeme Tarihi" },
  totalAmount: { label: "Toplam Kredi Tutarı" },
  interestAmount: { label: "Faiz Tutarı" },
  principalAmount: { label: "Ana Para" },
  paymentAmount: { label: "Ödeme Tutarı" },
  description: { label: "Açıklama" },
  remainingAmount: { label: "Kalan Tutar" },
  status: { label: "Durum" },
  paymentDate: { label: "Ödeme Tarihi" },
  penaltyAmount: { label: "Oluşturulma Tarihi" },
  createdBy: { label: "Oluşturan" },
  updatedBy: { label: "Güncelleyen" },
  createdatetime: { label: "Oluşturulma Tarihi" },
  updatedatetime: { label: "Güncellenme Tarihi" },
};

export const validateLoanPaymentRow = (row: LoanPaymentRows): string[] => {
  const errors: string[] = [];

  Object.entries(LOANPAYMENT_VALIDATION_RULES).forEach(([field, rule]) => {
    const value = row[field as keyof LoanPaymentRows];

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

