// pages/AdminStock/hook.ts  (tamamı)
import { useEffect, useState } from "react";
import { StockRows } from "./types";
import {
  getAllStocks,
  addStock,
  updateStock,
  deleteStock,
  getStockById,
} from "./service";
import { useNotifier } from "../../hooks/useNotifier";
import { getToken } from "../../utils/token";
import { extractApiError } from "../../utils/axios";

export const useStock = () => {
  const [localData, setLocalData] = useState<StockRows[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();
  const notify = useNotifier();

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllStocks(token!);
      setLocalData(result);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getStockById(token!, id);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const create = async (data: Partial<StockRows>): Promise<StockRows> => {
    try {
      const newItem = await addStock(token!, data);
      return newItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const update = async (data: Partial<StockRows>): Promise<StockRows> => {
    try {
      const updatedItem = await updateStock(token!, data);
      return updatedItem;
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const deleteRows = async (selected: StockRows[]) => {
    try {
      const record = selected[0];
      await deleteStock(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const addRow = (item: StockRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: StockRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };


  return {
    localData,
    loading,
    alert,
    setAlert,
    fetchData,
    getById,
    create,
    update,
    deleteRows,
    addRow,
    updateRow,
  };
};
