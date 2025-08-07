import type { AnnualLeavesRows } from "./types";
import axios from "../../utils/axios";

export const getAllAnnualLeaves = async (token: string): Promise<AnnualLeavesRows[]> => {
  const response = await axios.get(`employee-leaves`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.employeeLeaves;
};

export const getAnnualLeaveById = async (
  token: string,
  id: string
): Promise<AnnualLeavesRows> => {
  const response = await axios.get(`employee-leaves/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const addAnnualLeave = async (
  token: string,
  data: Partial<AnnualLeavesRows>
): Promise<AnnualLeavesRows> => {

  const response = await axios.post(`employee-leaves`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateAnnualLeave = async (
  token: string,
  data: Partial<AnnualLeavesRows>
): Promise<AnnualLeavesRows> => {
  const response = await axios.patch(`employee-leaves`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteAnnualLeave = async (token: string, id: string): Promise<void> => {
  await axios.delete(`finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

