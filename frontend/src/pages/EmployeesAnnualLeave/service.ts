import type { AnnualLeavesRows } from "./types";
import axios from "../../utils/axios";

export const getAllAnnualLeaves = async (token: string): Promise<AnnualLeavesRows[]> => {
  const response = await axios.get(`employee-leaves`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.transactions;
};

export const getAnnualLeaveById = async (
  token: string,
  id: string
): Promise<AnnualLeavesRows> => {
  const response = await axios.get(`finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const addAnnualLeave = async (
  token: string,
  data: Partial<AnnualLeavesRows>
): Promise<AnnualLeavesRows> => {
  const data2 = [
    {
      type: "COLLECTION",
      amount: 100000,
      currency: "TRY",
      fromAccountCode: "ZIR001", 
      transactionDate: "2024-08-01T00:00:00.000Z",
      method: "BANK",
      category: "INTERNAL_TRANSFER", 
      description: "Ziraat Bankası hesabından Garanti hesabına transfer",
      source: "Finans Otomatik Transfer Modülü",
    },
  ];
  const response = await axios.post(`finances`, data2, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateAnnualLeave = async (
  token: string,
  data: Partial<AnnualLeavesRows>
): Promise<AnnualLeavesRows> => {
  const response = await axios.patch(`finances`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteAnnualLeave = async (token: string, id: string): Promise<void> => {
  await axios.delete(`finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

