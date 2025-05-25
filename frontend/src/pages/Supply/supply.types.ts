import { BaseGridRow } from "../../components/grid/BaseGridRows";
export interface SupplyRows extends BaseGridRow {
  id?: string;
  code?: string;
  category: string;
  quantityItemCode: string;
  companyName: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  contractAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdatetime: Date;
  updatedatetime: Date;
  isNew?: boolean;
}
