import { useState, useEffect } from "react";
import {
  getAllFinance,
  getFinanceById,
  addFinance,
  updateFinance,
  deleteFinance,
  fetchAccounts,
} from "./service";
import { getToken } from "../../utils/token";
import type { AutocompleteOption, FinanceTransactionRows } from "./types";


export const useFinance = () => {
  const [localData, setLocalData] = useState<FinanceTransactionRows[]>([]);
  const [accountOptions, setAccountOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllFinance(token!);
      const optionResult = await fetchAccounts(token!);
      setLocalData(result);
      setAccountOptions(optionResult) ;
    } catch (err) {
      setAlert({ message: "Veriler yüklenemedi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getFinanceById(token!, id);
    } catch (err) {
      setAlert({ message: "Kayıt alınamadı", type: "error" });
      return undefined;
    }
  };

  const create = async (data: Partial<FinanceTransactionRows>) => {
    const newItem = await addFinance(token!, data);
    return newItem;
  };

  const update = async (data: Partial<FinanceTransactionRows>) => {
    console.log("d:",data)
    const updatedItem = await updateFinance(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: FinanceTransactionRows[]) => {
    try {
      const record = selected[0];
      await deleteFinance(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
      setAlert({ message: "Silme işlemi başarılı", type: "success" });
    } catch (err) {
      setAlert({ message: "Silme işlemi başarısız", type: "error" });
    }
  };

  const addRow = (item: FinanceTransactionRows) => {
    setLocalData((prev) => [item, ...prev]);
  };

  const updateRow = (item: FinanceTransactionRows) => {
    setLocalData((prev) =>
      prev.map((row) => (row.id === item.id ? item : row))
    );
  };

  const saveChanges = async (allRows: FinanceTransactionRows[]) => {
    console.log("Tüm kayıtlar kaydedildi:", allRows);
    setAlert({ message: "Değişiklikler kaydedildi", type: "success" });
  };

  return {
    localData,
    loading,
    alert,
    accountOptions,
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
