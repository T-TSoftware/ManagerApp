export type ProjectRows = {
  edit: string;
  id?: string;
  code: string;
  name: string;
  site: string;
  status: string;
  estimatedStartDate: Date;
  actualStartDate: Date;
  estimatedEndDate: Date;
  actualEndDate: Date;
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
