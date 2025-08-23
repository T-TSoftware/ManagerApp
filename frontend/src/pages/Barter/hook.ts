import { useState, useEffect } from "react";
import {
  getAllBarters,
  getBarterById,
  addBarter,
  updateBarter,
  deleteBarter,
  getBarterItemsById,
} from "./service";
import { getToken } from "../../utils/token";
import type { BarterRows } from "./types";
import { BarterItemRows } from "./BarterItems/types";
import { useNotifier } from "../../hooks/useNotifier";
import { extractApiError } from "../../utils/axios";

export const useBarter = () => {
  const [localData, setLocalData] = useState<BarterRows[]>([]);
  const [selectedBarterId, setSelectedBarterId] = useState<string | null>(null);
  const [barterItems, setBarterItems] = useState<BarterItemRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, [token]);

  // Parent row seçildiğinde çağrılır
  const handleRowSelection = (barterId: string) => {
    setSelectedBarterId(barterId);
    fetchBarterItems(barterId);
  };

  // API'den child grid verisi çekilir
  const fetchBarterItems = async (barterId: string) => {
    try {
      const response = await getBarterItemsById(token!, barterId);
      setBarterItems(response);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      notify.error(errorMessage);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllBarters(token!);
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
      return await getBarterById(token!, id);
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const create = async (data: Partial<BarterRows>) => {
    try {
      const newItem = await addBarter(token!, data);
      return newItem;
    } catch (error) {
      const { errorMessage } = extractApiError(error);
      throw new Error(errorMessage);
    }
  };

  const update = async (data: Partial<BarterRows>) => {
    try {
      const updatedItem = await updateBarter(token!, data);
      return updatedItem;
    } catch (error) {
      const { errorMessage } = extractApiError(error);
      throw new Error(errorMessage);
    }
  };

  const deleteRows = async (selected: BarterRows[]) => {
    try {
      const record = selected[0];
      await deleteBarter(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      const { errorMessage } = extractApiError(err);
      throw new Error(errorMessage);
    }
  };

  const addRow = (item: BarterRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: BarterRows) => {
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
    selectedBarterId,
    setSelectedBarterId,
    barterItems,
    handleRowSelection,
    fetchBarterItems,
  };
};
