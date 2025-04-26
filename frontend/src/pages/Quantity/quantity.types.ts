export interface QuantityRows {
  id:string;
  code: string;
  quantityItemCode: string;
  quantityItemName: string;
  quantity: number;
  unit: string;
  description: string;
  category: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  isNew?: boolean;
}
