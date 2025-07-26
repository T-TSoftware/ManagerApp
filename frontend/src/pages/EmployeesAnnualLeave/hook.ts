import { useState, useEffect } from "react";
import {
  getAllAnnualLeaves,
  getAnnualLeaveById,
  addAnnualLeave,
  updateAnnualLeave,
  deleteAnnualLeave,
} from "./service";
import { getToken } from "../../utils/token";
import type { AnnualLeavesRows } from "./types";


export const useAnnualLeave = () => {
  const [localData, setLocalData] = useState<AnnualLeavesRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllAnnualLeaves(token!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getAnnualLeaveById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<AnnualLeavesRows>) => {
    const newItem = await addAnnualLeave(token!, data);
    return newItem;
  };

  const update = async (data: Partial<AnnualLeavesRows>) => {
    const updatedItem = await updateAnnualLeave(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: AnnualLeavesRows[]) => {
    try {
      const record = selected[0];
      await deleteAnnualLeave(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: AnnualLeavesRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: AnnualLeavesRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: AnnualLeavesRows[]) => {
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
