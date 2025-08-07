import type { LoansRows } from "./types";
import axios from "../../utils/axios";
import { AutocompleteOption } from "../../types/grid/commonTypes";

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
  console.log(data)
  const response = await axios.post(`loans`, data, {
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

export const fetchAccounts = async (
  token: string
): Promise<AutocompleteOption[]> => {
  const response = await axios.get(`balances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

