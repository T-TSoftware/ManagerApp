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

export const useSales = () => {
  const [localData, setLocalData] = useState<SalesRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();
  const { projectId } = useApp();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllSales(token!, projectId!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getSalesById(token!, projectId!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<SalesRows>) => {
    const newItem = await addSales(token!, projectId!, data);
    return newItem;
  };

  const update = async (data: Partial<SalesRows>) => {
    const updatedItem = await updateSales(token!, projectId!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: SalesRows[]) => {
    try {
      const record = selected[0];
      await deleteSales(token!, projectId!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
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
    console.log("Tüm kayıtlar kaydedildi:", allRows);
    setAlert({ message: "Değişiklikler kaydedildi", type: "success" });
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
