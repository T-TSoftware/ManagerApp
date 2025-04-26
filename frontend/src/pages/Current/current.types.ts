export interface CurrentRows {
  id: string;
  balance: number;
  type: string;
  amount: string;
  currency: string;
  description: string;
  transactionDate: Date;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  isNew?:boolean;
}
