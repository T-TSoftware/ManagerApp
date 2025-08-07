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
  relatedStock: string;
  relatedSubcontractor: string;
  relatedSupplier: string;
  createdBy: {
    id: string
  };
  updatedBy: {
    id: string
  };
  createdatetime: Date;
  updatedatetime: Date;
  cashDetails?: string;
};

    