// Grid ve GET işlemleri için detaylı tip
export type CheckFinanceRows = {
  edit: string;
  id?: string;
  code?: string;
  checkDate: Date;
  transactionDate: Date;
  dueDate: Date;
  remainingAmount: number;
  firm: string;
  amount: number;
  checkNo: string;
  description: string;
  status: string;
  type: string;
  bankCode?: string;
  bank: {
    id: string;
    code: string;
    name: string;
  };
  project: {
    id: string;
    code: string;
    name: string;
  };
  projectId?: string;
  transactionid: string;
  companyid: string;
  createdby: string;
  updatedby: string;
  createdatetime: Date;
  updatedatetime: Date;
};

