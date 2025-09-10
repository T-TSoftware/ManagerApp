export interface QuantityRows {
  id?: string;
  edit?: string;
  code: string;
  category: string;
  unit: string;
  quantity: number;
  description: string;
  company: {
    id: string;
    name: string;
    code: string;
  };
  project: {
    id: string;
    name: string;
    code: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdatetime: Date;
  updatedatetime: Date;
}
