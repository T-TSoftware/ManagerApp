import { useState, useEffect } from "react";
import {
  getAllChecks,
  getCheckById,
  addCheck,
  updateCheck,
  deleteCheck,
} from "./service";
import { getToken } from "../../utils/token";
import type { CheckFinanceRows } from "./types";


export const useCheckFinance = () => {
  const [localData, setLocalData] = useState<CheckFinanceRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllChecks(token!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getCheckById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<CheckFinanceRows>) => {
    const newItem = await addCheck(token!, data);
    return newItem;
  };

  const update = async (data: Partial<CheckFinanceRows>) => {
    const updatedItem = await updateCheck(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: CheckFinanceRows[]) => {
    try {
      const record = selected[0];
      await deleteCheck(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: CheckFinanceRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: CheckFinanceRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: CheckFinanceRows[]) => {
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
