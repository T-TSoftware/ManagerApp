export type SalesRows = {
  edit: string;
  id?: string;
  code?: string;
  customerName: string;
  stockType: string;
  description: string;
  totalAmount: number;
  receivedamount: number;
  remainingamount: number;
  status: string;
  companyid: string;
  stock : {
    id: string;
    code:string;
    name:string
  }
    project : {
    id: string;
    code:string;
    name:string
  }
  createdby: string;
  updatedby: string;
  createdatetime: Date;
  updatedatetime: Date;
};

