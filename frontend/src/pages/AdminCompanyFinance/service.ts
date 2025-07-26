import type { AutocompleteOption, FinanceTransactionRows } from "./types";
import axios from "../../utils/axios";

export const getAllFinance = async (
  token: string
): Promise<FinanceTransactionRows[]> => {
  const response = await axios.get(`finances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.transactions;
};

export const getFinanceById = async (
  token: string,
  id: string
): Promise<FinanceTransactionRows> => {
  const response = await axios.get(`finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const addFinance = async (
  token: string,
  data: Partial<FinanceTransactionRows>
): Promise<FinanceTransactionRows> => {
  const response = await axios.post(`finances`, [data], {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateFinance = async (
  token: string,
  data: Partial<FinanceTransactionRows>
): Promise<FinanceTransactionRows> => {
  console.log("uuid:" , data)
  const response =  await axios.patch(`finances/${data.code}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
   return response.data;
};


export const deleteFinance = async (token: string, id: string): Promise<void> => {
  await axios.delete(`finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchAccounts = async (token: string): Promise<AutocompleteOption[]> => {
  const response = await axios.get(`balances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};