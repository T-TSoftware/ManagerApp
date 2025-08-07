export type EmployeesRows = {
  edit: string;
  id?: string;
  code: string;
  firstName: string;
  lastName: string;
  age: number;
  startDate: Date;

  netSalary: number;
  grossSalary: number;

  position: string;
  department: string;

  paidLeaveAmount: number;
  unpaidLeaveAmount: number;
  sickLeaveAmount: number;
  roadLeaveAmount: number;
  excuseLeaveAmount: number;

  createdatetime: Date;
  updatedatetime: Date;

  employee: {
    id: string;
    code: string;
    firstName: string;
    lastName: string;
  };
  company: {
    id: string;
  };

  createdBy: {
    id: string;
  };

  updatedBy: {
    id: string;
  };
};
