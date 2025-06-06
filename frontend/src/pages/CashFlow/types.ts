export interface CashFlowRows {
  id?:string;
  transactiondate: Date;
  method: string;
  description:string;
  income: number;
  expense: number;
  companyid: string;
}
