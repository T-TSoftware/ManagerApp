import type { SalesRows } from "./types";
import axios from "../../utils/axios";

export const getAllSales = async (
  token: string,
  projectId: string
): Promise<SalesRows[]> => {
  const response = await axios.get(`orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.orders;
};

export const getSalesById = async (
  token: string,
  projectId: string,
  id: string
): Promise<SalesRows> => {
  const response = await axios.get(`orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response);
  return response.data;
};

export const addSales = async (
  token: string,
  projectId: string,
  data: Partial<SalesRows>
): Promise<SalesRows> => {
  console.log("data", data);
  const response = await axios.post(`orders`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response)
  return response.data;
};

export const updateSales = async (
  token: string,
  projectId: string,
  data: Partial<SalesRows>
): Promise<SalesRows> => {
  const response = await axios.patch(`orders`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSales = async (
  token: string,
  projectId: string,
  id: string
): Promise<void> => {
  await axios.delete(`orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
