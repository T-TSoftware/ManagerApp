import { useState, useEffect } from "react";
import {
  getAllChecks,
  getCheckById,
  addCheck,
  updateCheck,
  deleteCheck,
  fetchAccounts,
} from "./service";
import { getToken } from "../../utils/token";
import type { CheckFinanceRows } from "./types";
import { useNotifier } from "../../hooks/useNotifier";
import { AutocompleteOption } from "../../types/grid/commonTypes";


export const useCheckFinance = () => {
  const [localData, setLocalData] = useState<CheckFinanceRows[]>([]);
  const [loading, setLoading] = useState(false);
    const [accountOptions, setAccountOptions] = useState<AutocompleteOption[]>(
      []
    );
  const [alert, setAlert] = useState<any>(null);
  const notify = useNotifier();
  const token = getToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllChecks(token!);
      const optionResult = await fetchAccounts(token!);
      setLocalData(result);
      setAccountOptions(optionResult);
    } catch (err) {
       notify.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      return await getCheckById(token!, id);
    } catch (err) {
      notify.error("Bir sorun oluştu.");
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
    } catch (err) {
      notify.error("Bir sorun oluştu.");
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
    notify.success("Değişiklikler kaydedildi.");
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
