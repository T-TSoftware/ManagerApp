import { useState, useEffect } from "react";
import {
  getAllSales,
  getSalesById,
  addSales,
  updateSales,
  deleteSales,
} from "./service";
import { getToken } from "../../utils/token";
import { useApp } from "../../hooks/useApp";
import type { SalesRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";

export const useSales = () => {
  const [localData, setLocalData] = useState<SalesRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();
  const { projectId } = useApp();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSales(token!);
      setLocalData(result);
    } catch (err) {
      notify.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getSalesById(token!, id);
    } catch (err) {
      notify.error("Bir hata oluştu.");
      return undefined;
    }
  };

  const create = async (data: Partial<SalesRows>) => {
    const newItem = await addSales(token!, data);
    return newItem;
  };

  const update = async (data: Partial<SalesRows>) => {
    const updatedItem = await updateSales(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: SalesRows[]) => {
    try {
      const record = selected[0];
      await deleteSales(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
      notify.error("Bir hata oluştu.");
    }
  };

  const addRow = (item: SalesRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: SalesRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: SalesRows[]) => {
    notify.success("Değişiklikler kaydedildi.");
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
  };
};
