export interface QuantityRows {
  id?: string;
  edit?:string;
  code: string;
  category: string;
  unit: string;
  quantity: number;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
}