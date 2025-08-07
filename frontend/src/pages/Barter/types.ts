
export type BarterRows = {
  edit: string;
  id?: string;
  code: string;
  counterpartyType: string;
  counterpartyId: string;
  counterpartyName: string;
  agreementDate: Date;
  status: string;
  description: string;
  totalOurValue: number;
  totalTheirValue: number;
  project: {
    id: string;
    code: string;
    name: string;
  };
  createdBy:{
    id:string;
    email:string;
  };
  updatedBy:{
    id:string;
    email:string;
  };
  createdatetime: Date;
  updatedatetime: Date;
};

       
        
        
       