export interface UpcomingPaymentsRows {
  id: string;
  code: string;
  category: string;
  duedate: Date;
  amount: number;
  remainingamount: number;
  status: string;
  companyid: string;
  createdatetime: Date;
  remainingdays: number;
};
