export type CompanyFormValues = {
  id?: string;
  name: string;
  site: string;
  status: string;//"draft" | "in_progress" | "completed";
  estimatedStartDate: string;
  actualStartDate: string;
  estimatedEndDate: string;
  actualEndDate: string;
};
