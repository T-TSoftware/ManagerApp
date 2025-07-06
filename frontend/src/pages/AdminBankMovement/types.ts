export type BankMovementRows = {
  id: string;
  code: string;
  transactiondate: Date;
  from_account: string;
  to_account: string;
  description: string;
  currency: string;
  method: string;
  category: string;
  projectid: string;
  companyid: string;
  income: number;
  expense: number;
};
