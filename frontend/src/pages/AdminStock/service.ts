import axios from "../../utils/axios";
import { StockRows} from "./types";

export const getAllStocks = async (token: string): Promise<StockRows[]> => {
  const response = await axios.get(`stocks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStockById = async (
  token: string,
  id: string
): Promise<StockRows> => {
  const response = await axios.get(`stocks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addStock = async (
  token: string,
  data: Partial<StockRows>
): Promise<StockRows> => {
  const response = await axios.post(`stocks`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateStock = async (
  token: string,
  data: Partial<StockRows>
): Promise<StockRows> => {
    console.log(data);
  const response = await axios.patch(`stocks/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    console.log(response);
  return response.data;
};

export const deleteStock = async (
  token: string,
  id: string
): Promise<void> => {
  const res = await axios.delete(`stocks`, {
    data: id,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
