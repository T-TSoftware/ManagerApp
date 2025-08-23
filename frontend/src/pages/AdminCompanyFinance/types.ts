
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
  description: string;
  referenceCode: string;
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

  project?: {
    id: string;
    code: string;
    name: string;
  };
  updatedBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  order?: {
    id: string;
    description: string;
    code: string;
  };
};

