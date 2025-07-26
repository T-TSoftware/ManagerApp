import { useState, useEffect } from "react";
import {
  getAllLoans,
  getLoanById,
  addLoan,
  updateLoan,
  deleteLoan,
} from "./service";
import { getToken } from "../../utils/token";
import type { LoansRows } from "./types";


export const useLoan = () => {
  const [localData, setLocalData] = useState<LoansRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllLoans(token!);
      setLocalData(result);
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getLoanById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<LoansRows>) => {
    const newItem = await addLoan(token!, data);
    return newItem;
  };

  const update = async (data: Partial<LoansRows>) => {
    const updatedItem = await updateLoan(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: LoansRows[]) => {
    try {
      const record = selected[0];
      await deleteLoan(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: LoansRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: LoansRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: LoansRows[]) => {
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
