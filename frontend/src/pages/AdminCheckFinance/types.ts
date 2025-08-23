export type CheckFinanceRows = {
  edit: string;
  id?: string;
  code?: string;
  checkDate: Date;
  dueDate: Date;
  remainingAmount: number;
  processedAmount: number;
  firm: string;
  amount: number;
  checkNo: string;
  description: string;
  status: string;
  type: string;
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
  transaction: string;
  createdBy: {
    id:string,
    code:string,
    email:string
  };
  updatedBy: {
    id:string,
    code:string,
    email:string
  };
  createdatetime: Date;
  updatedatetime: Date;
};

