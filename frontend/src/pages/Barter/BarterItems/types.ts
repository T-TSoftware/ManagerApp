export type BarterItemRows = {
  edit: string;
  id?: string;
  code: string;
  status: string;
  direction: string;
  itemType: string;
  description: string;
  agreedValue: number;
  assetDetails: string;
  remainingAmount: number;
  processedAmount: number;
  relatedStockCode: string;
  relatedSubcontractorCode: string;
  relatedSupplierCode: string;
  relatedStock: {
    id: string;
    code: string;
    name: string;
  };
  relatedSubcontractor: {
    id: string;
    code: string;
    name: string;
  };
  relatedSupplier: {
    id: string;
    code: string;
    name: string;
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
  cashDetails?: string;
};

    