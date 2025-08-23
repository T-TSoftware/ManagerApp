export type SubcontractorRows = {
  edit: string;
  id?: string;
  code?: string;
  companyName: string;
  category: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  paidAmount: number;
  contractAmount: number;
  remainingAmount: number;
  description: string;
  addedFromQuantityYN:string;
  locked:string;
  status: string;
  project: {
    id: string;
    code: string;
    name: string;
  };
  createdBy: {
    id: string;
    code: string;
    email: string;
  };
  updatedBy: {
    id: string;
    code: string;
    email: string;
  };
  createdatetime: Date;
  updatedatetime: Date;
};
