import type { EmployeesRows } from "./types";
import axios from "../../utils/axios";

export const getAllEmployees = async (token: string): Promise<EmployeesRows[]> => {
  const response = await axios.get(`employees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.employees;
};

export const getEmployeeById = async (
  token: string,
  id: string
): Promise<EmployeesRows> => {
  const response = await axios.get(`employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const addEmployee = async (
  token: string,
  data: Partial<EmployeesRows>
): Promise<EmployeesRows> => {
  const response = await axios.post(`employees`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateEmployee = async (
  token: string,
  data: Partial<EmployeesRows>
): Promise<EmployeesRows> => {
  const response = await axios.patch(`employees/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteEmployee = async (token: string, id: string): Promise<void> => {
  await axios.delete(`employees/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

