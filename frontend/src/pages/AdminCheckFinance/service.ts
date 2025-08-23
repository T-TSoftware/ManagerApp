import type { CheckFinanceRows } from "./types";
import axios from "../../utils/axios";
import { AutocompleteOptionById } from "../../types/grid/commonTypes";

export const getAllChecks = async (token: string): Promise<CheckFinanceRows[]> => {
  const response = await axios.get(`checks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.checks;
};

export const getCheckById = async (
  token: string,
  id: string
): Promise<CheckFinanceRows> => {
  const response = await axios.get(`checks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const addCheck = async (
  token: string,
  data: Partial<CheckFinanceRows>
): Promise<CheckFinanceRows> => {
  console.log(data)
  const response = await axios.post(`checks`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCheck = async (
  token: string,
  data: Partial<CheckFinanceRows>
): Promise<CheckFinanceRows> => {
  const response = await axios.patch(`checks/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteCheck = async (token: string, id: string): Promise<void> => {
  await axios.delete(`finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchAccounts = async (
  token: string
): Promise<AutocompleteOptionById[]> => {
  const response = await axios.get(`balances`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};