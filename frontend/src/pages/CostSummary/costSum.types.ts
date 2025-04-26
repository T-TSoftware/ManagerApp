export interface CostSummaryRows {
  projectid: string;
  projectcode: string;
  quantityitemcode: string;
  quantityitemname: string;
  expectedquantity: number;
  unit: string;
  suppliedquantity: number;
  expectedpayment: number;
  totalpayment: number;
  remainingpayment: number;
  remainingquantity: number;
  overlimit: string;
}
