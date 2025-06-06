
export type FinanceTransactionRows = {
  edit: string;
  id?: string;
  code: string;
  type: string;
  amount: number;
  currency: string;
  targettype: string;
  source: string;
  targetid: string;
  targetname: string;
  transactionDate: Date;
  method: string;
  category: string;
  invoiceyn: string;
  invoicecode: string;
  checkcode: string;
  checkstatus: string;
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

