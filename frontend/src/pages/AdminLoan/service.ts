import type { LoansRows } from "./types";
import axios from "../../utils/axios";

export const getAllLoans = async (token: string): Promise<LoansRows[]> => {
  const response = await axios.get(`loans`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response)
  return response.data.loans;
};

export const getLoanById = async (
  token: string,
  id: string
): Promise<LoansRows> => {
  const response = await axios.get(`loans/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const addLoan = async (
  token: string,
  data: Partial<LoansRows>
): Promise<LoansRows> => {
  const response = await axios.post(`loans`, [data], {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateLoan = async (
  token: string,
  data: Partial<LoansRows>
): Promise<LoansRows> => {
  const response = await axios.patch(`loans`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteLoan = async (token: string, id: string): Promise<void> => {
  await axios.delete(`loans/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

