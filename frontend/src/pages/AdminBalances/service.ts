import axios from "../../utils/axios";
import { BalanceRows, NewBalancePayload, UpdateBalancePayload } from "./types";

export const getAllBalance = async (token: string): Promise<BalanceRows[]> => {
  const res = await axios.get("balances", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addBalances = async (
  token: string,
  data: NewBalancePayload[]
) => {
  const res = await axios.post("balances", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateBalances = async (token: string, data: UpdateBalancePayload[]) => {
  const res = await axios.put(`balances`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteBalances = async (token: string, ids: string[]) => {
  const res = await axios.delete("balances", {
    headers: { Authorization: `Bearer ${token}` },
    data: { ids }, 
  });
  return res.data;
};
