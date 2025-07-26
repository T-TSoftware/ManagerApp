import axios from "../../utils/axios";
import { StockRows, NewStockPayload, UpdateStockPayload } from "./types";

export const getAllStocks = async (
  token: string
): Promise<StockRows[]> => {
  const res = await axios.get(`stocks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addStock = async (
  token: string,
  items: NewStockPayload[]
): Promise<void> => {
  const res = await axios.post(`stocks`, items, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateStock = async (
  token: string,
  items: UpdateStockPayload[]
): Promise<void> => {
  const res = await axios.patch(`stocks`, items, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteStock = async (
  token: string,
  codes: string[]
): Promise<void> => {
  const res = await axios.delete(
    `stocks`,
    {
      data: codes,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};