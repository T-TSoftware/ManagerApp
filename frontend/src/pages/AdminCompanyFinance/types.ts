
export type FinanceTransactionRows = {
  edit: string;
  id?: string;
  code: string;
  type: string;
  amount: number;
  currency: string;
  targetType: string;
  source: string;
  targetId: string;
  targetName: string;
  transactionDate: Date;
  method: string;
  category: string;
  invoiceYN: string;
  invoiceCode: string;
  checkCode: string;
  checkstatus: string;
  loanCode: string;
  loanStatus: string;
  description: string;
  createdatetime: string;
  updatedatetime: string;
  updatedby: string;

  fromAccount?: {
    id: string;
    code: string;
    name: string;
    amount: string;
    currency: string;
  };

  toAccount?: {
    id: string;
    code: string;
    name: string;
    amount: string;
    currency: string;
  };

  project?: any;
  updatedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
    company?: {
      id: string;
      name: string;
      code: string;
    };
  };
};

export interface AutocompleteOption {
  code: string;
  name: string;
}

