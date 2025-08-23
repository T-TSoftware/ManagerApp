export type StockRows = {
  edit: string;
  id?: string;
  code?: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minimumQuantity: number;
  description: string;
  location: string;
  stockDate: Date;
  project: {
    id: string;
    code: string;
    name:string;
  };
  createdBy: {
    id: string;
    email: string;
  };
  updatedBy: {
    id: string;
    email: string;
  };
  createdatetime: Date;
  updatedatetime: Date;
};
