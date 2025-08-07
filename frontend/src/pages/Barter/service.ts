import type { BarterRows } from "./types";
import axios from "../../utils/axios";
import { BarterItemRows } from "./BarterItems/types";

export const getAllBarters = async (token: string): Promise<BarterRows[]> => {
  const response = await axios.get(`barters`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBarterById = async (
  token: string,
  id: string
): Promise<BarterRows> => {
  const response = await axios.get(`barters/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBarterItemsById = async (
  token: string,
  id: string
): Promise<BarterItemRows[]> => {
  const response = await axios.get(`barter-items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addBarter = async (
  token: string,
  data: Partial<BarterRows>
): Promise<BarterRows> => {
  const { code, counterpartyId, ...cleanedData } = data;

  return (
    await axios.post("barters", cleanedData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
};

export const updateBarter = async (
  token: string,
  data: Partial<BarterRows>
): Promise<BarterRows> => {
  const response = await axios.patch(`barters/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const deleteBarter = async (token: string, id: string): Promise<void> => {
  await axios.delete(`barters/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

