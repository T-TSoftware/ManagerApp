
export type LoansRows = {
  edit: string;
  createPayment: string;
  id?: string;
  code: string;
  name: string;
  accountNo: string;
  totalAmount: number;
  remainingPrincipal: number;
  remainingInstallmentAmount: number;
  remainingInstallmentCount: number;
  interestRate: number;
  totalInstallmentCount: number;
  loanDate: Date;
  purpose: string;
  loanType: string;
  status: string;
  description: string;
  projectCode: string;
  bankCode: string;
  createdatetime: string;
  updatedatetime: string;
  updatedby?: {
    id: string;
  };
  createdby?: {
    id: string;
  };

  bank?: {
    id: string;
    code:string;
    name:string;
  };

  company?: {
    id: string;
  };

  project?: {
    id: string;
    code: string;
    name: string;
  };
};

