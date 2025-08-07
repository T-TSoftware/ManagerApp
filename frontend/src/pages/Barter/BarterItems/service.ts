import axios from "../../../utils/axios";
import type { BarterItemRows } from "./types";

export const getBarterItemsById = async (
  token: string,
  barterId: string
): Promise<BarterItemRows[]> => {
  const response = await axios.get(`barter-items/barter/${barterId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addBarterItem = async (
  token: string,
  data: Partial<BarterItemRows>,
  barterId: string
): Promise<BarterItemRows> => {
  const response = await axios.post(`barter-items/${barterId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBarterItem = async (
  token: string,
  data: Partial<BarterItemRows>
): Promise<BarterItemRows> => {
  const response = await axios.patch(`barter-items/${data.id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteBarterItem = async (
  token: string,
  id: string
): Promise<void> => {
  await axios.delete(`barter-items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
