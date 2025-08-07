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
import type { FinanceTransactionRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { AutocompleteOption } from "../../types/grid/commonTypes";


export const useFinance = () => {
  const [localData, setLocalData] = useState<FinanceTransactionRows[]>([]);
  const [accountOptions, setAccountOptions] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
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
       notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getFinanceById(token!, id);
    } catch (err) {
       notify.error("Bir sorun oluştu.");
      return undefined;
    }
  };

  const create = async (data: Partial<FinanceTransactionRows>) => {
    const newItem = await addFinance(token!, data);
    return newItem;
  };

  const update = async (data: Partial<FinanceTransactionRows>) => {
    const updatedItem = await updateFinance(token!, data);
    return updatedItem;
  };

  const deleteRows = async (selected: FinanceTransactionRows[]) => {
    try {
      const record = selected[0];
      await deleteFinance(token!, record.id!);
      setLocalData((prev) => prev.filter((r) => r.id !== record.id));
    } catch (err) {
       notify.error("Bir sorun oluştu.");
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
     notify.error("Değişiklikler kaydedildi");
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
