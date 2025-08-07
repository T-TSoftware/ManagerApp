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
  }, []);

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
    } catch (error) {
      notify.error("Bir sorun oluştu.");
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllBarters(token!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getBarterById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

  const create = async (data: Partial<BarterRows>) => {
    const newItem = await addBarter(token!, data);
    return newItem;
  };

  const update = async (data: Partial<BarterRows>) => {
    const updatedItem = await updateBarter(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: BarterRows[]) => {
    try {
      const record = selected[0];
      await deleteBarter(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      notify.error("Bir sorun oluştu.");
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

  const saveChanges = async (allRows: BarterRows[]) => {
    notify.success("Değişiklikler kaydedildi");
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
    saveChanges,
    selectedBarterId,
    setSelectedBarterId,
    barterItems,
    handleRowSelection,
    fetchBarterItems,
  };
};
